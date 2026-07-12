-- Qrious Phase 1 schema: profiles, friendships, and the world/squad tables
-- needed by later phases. Run this once in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- 1. profiles ----------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  avatar_emoji text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles are viewable by authenticated users"
  on profiles for select
  to authenticated
  using (true);

create policy "users can update their own profile"
  on profiles for update
  to authenticated
  using (auth.uid() = id);

-- auto-create a profile row when a new auth user signs up, pulling the
-- username out of the signUp() call's options.data payload.
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 2. friendships ---------------------------------------------------------
create table friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles (id) on delete cascade,
  addressee_id uuid not null references profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

alter table friendships enable row level security;

create policy "users can view their own friendships"
  on friendships for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "users can send friend requests"
  on friendships for insert
  to authenticated
  with check (auth.uid() = requester_id);

create policy "participants can update friendship status"
  on friendships for update
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- 3. hawker_centres --------------------------------------------------------
create table hawker_centres (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  lat double precision not null,
  lng double precision not null,
  is_hot boolean not null default false,
  created_at timestamptz not null default now()
);

alter table hawker_centres enable row level security;

create policy "hawker centres are viewable by authenticated users"
  on hawker_centres for select
  to authenticated
  using (true);

-- 4. stalls ----------------------------------------------------------------
create table stalls (
  id uuid primary key default gen_random_uuid(),
  hawker_centre_id uuid not null references hawker_centres (id) on delete cascade,
  name text not null,
  cuisine_type text,
  created_at timestamptz not null default now()
);

alter table stalls enable row level security;

create policy "stalls are viewable by authenticated users"
  on stalls for select
  to authenticated
  using (true);

-- 5. discoveries (fog-of-war unlocks) --------------------------------------
create table discoveries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  hawker_centre_id uuid not null references hawker_centres (id) on delete cascade,
  discovered_at timestamptz not null default now(),
  unique (user_id, hawker_centre_id)
);

alter table discoveries enable row level security;

create policy "users manage their own discoveries"
  on discoveries for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. check_ins ---------------------------------------------------------------
create table check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  hawker_centre_id uuid not null references hawker_centres (id) on delete cascade,
  checked_in_at timestamptz not null default now()
);

alter table check_ins enable row level security;

create policy "users manage their own check-ins"
  on check_ins for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 7. squads --------------------------------------------------------------
create table squads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table squads enable row level security;

create policy "members can view their squads"
  on squads for select
  to authenticated
  using (
    auth.uid() = created_by
    or exists (
      select 1 from squad_members
      where squad_members.squad_id = squads.id
      and squad_members.user_id = auth.uid()
    )
  );

create policy "users can create squads"
  on squads for insert
  to authenticated
  with check (auth.uid() = created_by);

-- 8. squad_members -----------------------------------------------------------
create table squad_members (
  squad_id uuid not null references squads (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (squad_id, user_id)
);

alter table squad_members enable row level security;

create policy "members can view their squad's roster"
  on squad_members for select
  to authenticated
  using (
    auth.uid() = user_id
    or squad_id in (select squad_id from squad_members where user_id = auth.uid())
  );

create policy "users can join squads"
  on squad_members for insert
  to authenticated
  with check (
    auth.uid() = user_id
    or auth.uid() = (select created_by from squads where id = squad_id)
  );

-- 9. squad_missions -----------------------------------------------------------
create table squad_missions (
  id uuid primary key default gen_random_uuid(),
  squad_id uuid not null references squads (id) on delete cascade,
  hawker_centre_id uuid not null references hawker_centres (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'completed', 'expired')),
  points int not null default 10,
  created_at timestamptz not null default now()
);

alter table squad_missions enable row level security;

create policy "members can view their squad's missions"
  on squad_missions for select
  to authenticated
  using (squad_id in (select squad_id from squad_members where user_id = auth.uid()));

create policy "members can update their squad's missions"
  on squad_missions for update
  to authenticated
  using (squad_id in (select squad_id from squad_members where user_id = auth.uid()));
