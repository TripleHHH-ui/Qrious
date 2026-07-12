"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AVATAR_PRESETS } from "@/lib/avatars";

export async function chooseAvatar(formData: FormData) {
  const avatarEmoji = formData.get("avatar_emoji");

  if (typeof avatarEmoji !== "string" || !AVATAR_PRESETS.includes(avatarEmoji as (typeof AVATAR_PRESETS)[number])) {
    return;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  await supabase.from("profiles").update({ avatar_emoji: avatarEmoji }).eq("id", user.id);

  redirect("/");
}
