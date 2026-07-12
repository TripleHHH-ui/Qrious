import Link from "next/link";
import { logout } from "@/app/actions";

export function Header({
  username,
  avatarEmoji,
}: {
  username: string;
  avatarEmoji: string | null;
}) {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{avatarEmoji ?? "🍜"}</span>
        <span className="font-semibold">{username}</span>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/" className="hover:text-terracotta">
          Home
        </Link>
        <Link href="/friends" className="hover:text-terracotta">
          Friends
        </Link>
        <form action={logout}>
          <button type="submit" className="text-neutral-500 hover:text-terracotta">
            Log out
          </button>
        </form>
      </nav>
    </header>
  );
}
