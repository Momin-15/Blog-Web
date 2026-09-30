 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { resolveImageUrl } from "@/lib/imageUrl";

export default function SearchForm({ initialQuery }) {
  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQuery) return;
    let cancelled = false;
    api.get(`/users/search?q=${encodeURIComponent(initialQuery)}`)
      .then(({ data }) => {
        if (cancelled) return;
        setUsers(data.users);
        setSearched(true);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError.response?.data?.message || "Could not search writers.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [initialQuery]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get(
        `/users/search?q=${encodeURIComponent(query.trim())}`
      );
      setUsers(data.users);
      setSearched(true);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not search writers."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
      <h1 className="font-display text-3xl text-forest">Find a writer</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by username"
          aria-label="Search by username"
          className="min-w-0 flex-1 border border-line bg-white px-3 py-2 outline-none focus:border-forest"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-forest px-5 py-2 text-paper hover:bg-forest-dark disabled:opacity-60"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
      {searched && !users.length && !error && (
        <p className="mt-8 text-sage">No writers found.</p>
      )}
      <ul className="mt-7 divide-y divide-line">
        {users.map((user) => (
          <li key={user.username} className="py-4">
            <Link
              href={`/profile/${encodeURIComponent(user.username)}`}
              className="flex items-center gap-3 hover:text-forest"
            >
              {user.profilePicture ? (
                <img
                  src={resolveImageUrl(user.profilePicture)}
                  alt=""
                  className="h-10 w-10 rounded-full border border-line object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest text-paper">
                  {user.username[0]?.toUpperCase()}
                </span>
              )}
              <span>
                <span className="block font-medium">{user.displayName || user.username}</span>
                <span className="block text-sm text-sage">@{user.username}</span>
                {user.bio && <span className="mt-1 block text-sm text-ink/80">{user.bio}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
