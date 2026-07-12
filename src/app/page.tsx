import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";

export default async function HomePage() {
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

  return (
    <div>
      <Header
        username={profile?.username ?? "hawker"}
        avatarEmoji={profile?.avatar_emoji ?? null}
      />
      <main className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-4xl">{profile?.avatar_emoji ?? "🍜"}</div>
          <h1 className="text-xl font-bold">Welcome, {profile?.username}!</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Phase 1 — done. Auth, profiles, and friends are wired up.
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            Next up: Roam Mode, the fog-of-war map, and squad missions.
          </p>
        </div>
      </main>
    </div>
  );
}
