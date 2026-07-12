"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function searchUsers(
  _prevState: { results: { id: string; username: string; avatar_emoji: string | null }[]; error: string | null },
  formData: FormData
) {
  const { supabase, user } = await requireUser();
  const query = String(formData.get("query") ?? "").trim();

  if (!query) {
    return { results: [], error: null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, avatar_emoji")
    .ilike("username", `%${query}%`)
    .neq("id", user.id)
    .limit(10);

  if (error) {
    return { results: [], error: error.message };
  }

  return { results: data ?? [], error: null };
}

export async function sendFriendRequest(addresseeId: string) {
  const { supabase, user } = await requireUser();

  await supabase.from("friendships").insert({
    requester_id: user.id,
    addressee_id: addresseeId,
    status: "pending",
  });

  revalidatePath("/friends");
}

export async function acceptFriendRequest(friendshipId: string) {
  const { supabase } = await requireUser();

  await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", friendshipId);

  revalidatePath("/friends");
}
