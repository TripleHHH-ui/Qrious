"use client";

import { useFormState, useFormStatus } from "react-dom";
import { searchUsers, sendFriendRequest } from "./actions";

function SearchButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-terracotta px-4 py-2 font-semibold text-white disabled:opacity-60"
    >
      {pending ? "Searching…" : "Search"}
    </button>
  );
}

export function FriendSearch() {
  const [state, formAction] = useFormState(searchUsers, { results: [], error: null });

  return (
    <div>
      <form action={formAction} className="flex gap-2">
        <input
          name="query"
          placeholder="Search by username"
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2"
        />
        <SearchButton />
      </form>
      {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}
      <ul className="mt-4 flex flex-col gap-2">
        {state.results.map((profile) => (
          <li
            key={profile.id}
            className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{profile.avatar_emoji ?? "🍜"}</span>
              {profile.username}
            </span>
            <form action={sendFriendRequest.bind(null, profile.id)}>
              <button
                type="submit"
                className="rounded-lg border border-terracotta px-3 py-1 text-sm font-semibold text-terracotta hover:bg-orange-50"
              >
                Add friend
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
