"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { resolveImageUrl } from "../lib/imageUrl";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");  
  };

  const router = useRouter();

  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    const searchText = query.trim();

    router.push(`/search?q=${encodeURIComponent(searchText)}`);
  };


  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur border-b border-line">

      <div className="mx-auto max-w-5xl px-5 py-4 flex items-center gap-6">

        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-forest shrink-0"
        >
          BlogApp
        </Link>


        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-sm"
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a writer by username"
            className="w-full bg-transparent border-b border-line focus:border-forest px-1 py-1.5 text-sm placeholder:text-sage outline-none transition-colors"
          />
        </form>


        {/* Navigation */}
        <nav className="flex items-center gap-5 text-sm shrink-0">

          {/* Logged in user */}
          {!loading && user && (
            <>
              <Link
                href="/create-post"
                className="text-ink hover:text-forest transition-colors"
              >
                Write
              </Link>


              {/* Admin link */}
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-ink hover:text-forest transition-colors"
                >
                  Admin
                </Link>
              )}


              {/* Profile */}
              <Link
                href={`/profile/${user.username}`}
                className="flex items-center gap-2 text-ink hover:text-forest transition-colors"
              >
                {user.profilePicture ? (
                  <img
                    src={resolveImageUrl(user.profilePicture)}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border border-line"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-forest text-paper text-xs flex items-center justify-center">
                    {user.username?.[0]?.toUpperCase()}
                  </span>
                )}

                <span className="hidden sm:inline">
                  {user.username}
                </span>
              </Link>


              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-sage hover:text-forest transition-colors"
              >
                Log out
              </button>
            </>
          )}


          {/* Logged out user */}
          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="text-ink hover:text-forest transition-colors"
              >
                Log in
              </Link>

              <Link
                href="/register"
                className="bg-forest text-paper px-4 py-1.5 rounded-full hover:bg-forest-dark transition-colors"
              >
                Join
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}