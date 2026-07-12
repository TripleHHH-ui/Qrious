import { AVATAR_PRESETS } from "@/lib/avatars";
import { chooseAvatar } from "./actions";

export default function AvatarOnboardingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="mb-1 text-2xl font-bold">Pick your avatar</h1>
      <p className="mb-6 text-sm text-neutral-600">
        This is how squadmates will recognize you.
      </p>
      <form action={chooseAvatar} className="grid grid-cols-4 gap-3">
        {AVATAR_PRESETS.map((emoji) => (
          <button
            key={emoji}
            type="submit"
            name="avatar_emoji"
            value={emoji}
            className="flex aspect-square items-center justify-center rounded-xl border border-neutral-300 bg-white text-3xl hover:border-terracotta hover:bg-orange-50"
          >
            {emoji}
          </button>
        ))}
      </form>
    </main>
  );
}
