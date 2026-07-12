import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { acceptFriendRequest } from "./actions";
import { FriendSearch } from "./FriendSearch";

export default async function FriendsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_emoji")
    .eq("id", user.id)
    .single();

  const { data: incoming } = await supabase
    .from("friendships")
    .select("id, status, requester:profiles!friendships_requester_id_fkey(id, username, avatar_emoji)")
    .eq("addressee_id", user.id)
    .eq("status", "pending");

  const { data: accepted } = await supabase
    .from("friendships")
    .select(
      "id, requester:profiles!friendships_requester_id_fkey(id, username, avatar_emoji), addressee:profiles!friendships_addressee_id_fkey(id, username, avatar_emoji)"
    )
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .eq("status", "accepted");

  return (
    <div>
      <Header
        username={profile?.username ?? "hawker"}
        avatarEmoji={profile?.avatar_emoji ?? null}
      />
      <main className="mx-auto max-w-lg px-4 py-10">
        <h1 className="mb-4 text-xl font-bold">Find friends</h1>
        <FriendSearch />

        <h2 className="mb-2 mt-8 text-sm font-semibold uppercase text-neutral-500">
          Pending requests
        </h2>
        {!incoming?.length && <p className="text-sm text-neutral-500">No pending requests.</p>}
        <ul className="flex flex-col gap-2">
          {incoming?.map((request: any) => (
            <li
              key={request.id}
              className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{request.requester?.avatar_emoji ?? "🍜"}</span>
                {request.requester?.username}
              </span>
              <form action={acceptFriendRequest.bind(null, request.id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-matcha px-3 py-1 text-sm font-semibold text-white"
                >
                  Accept
                </button>
              </form>
            </li>
          ))}
        </ul>

        <h2 className="mb-2 mt-8 text-sm font-semibold uppercase text-neutral-500">
          Friends
        </h2>
        {!accepted?.length && <p className="text-sm text-neutral-500">No friends yet.</p>}
        <ul className="flex flex-col gap-2">
          {accepted?.map((friendship: any) => {
            const friend =
              friendship.requester?.id === user.id ? friendship.addressee : friendship.requester;
            return (
              <li
                key={friendship.id}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2"
              >
                <span className="text-xl">{friend?.avatar_emoji ?? "🍜"}</span>
                {friend?.username}
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
