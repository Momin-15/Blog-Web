import Link from "next/link";
import AdminShell from "@/components/adminShell";

export default function AdminPage() {
  return (
    <AdminShell title="Admin dashboard">
      <p className="text-ink/80">Manage the community’s posts and accounts.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/posts" className="rounded-md border border-line p-5 hover:border-forest">
          <h2 className="font-display text-xl text-forest">Manage posts</h2>
          <p className="mt-2 text-sm text-sage">Review, edit, and remove published posts.</p>
        </Link>
        <Link href="/admin/users" className="rounded-md border border-line p-5 hover:border-forest">
          <h2 className="font-display text-xl text-forest">Manage users</h2>
          <p className="mt-2 text-sm text-sage">Search accounts, ban, or remove users.</p>
        </Link>
      </div>
    </AdminShell>
  );
}
