"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AdminShell({ title, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    else if (!loading && user?.role !== "admin") router.replace("/");
  }, [loading, user, router]);

  if (loading || !user || user.role !== "admin") {
    return <main className="flex-1 px-5 py-12 text-center text-sage">Loading admin area…</main>;
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12">
      <h1 className="font-display text-3xl text-forest">{title}</h1>
      <nav aria-label="Admin navigation" className="mt-5 flex gap-5 border-b border-line pb-4 text-sm">
        <Link href="/admin" className="text-forest hover:underline">Overview</Link>
        <Link href="/admin/posts" className="text-forest hover:underline">Posts</Link>
        <Link href="/admin/users" className="text-forest hover:underline">Users</Link>
      </nav>
      <div className="py-6">{children}</div>
    </main>
  );
}
