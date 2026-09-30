import { notFound } from "next/navigation";
import PostCard from "@/components/postCard";
import { resolveImageUrl } from "@/lib/imageUrl";
import { serverFetch } from "@/lib/serverFetch";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }) {
  const { username } = await params;
  const result = await serverFetch(
    `/users/${encodeURIComponent(username)}`
  );

  if (result.status === 404) {
    notFound();
  }

  if (!result.ok) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <p role="alert" className="text-red-700">
          {result.data.message || "Could not load this profile."}
        </p>
      </main>
    );
  }

  const { user, posts, postCount } = result.data;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
      <header className="mb-9 flex items-center gap-5 border-b border-line pb-8">
        {user.profilePicture ? (
          <img
            src={resolveImageUrl(user.profilePicture)}
            alt=""
            className="h-16 w-16 rounded-full border border-line object-cover"
          />
        ) : (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-2xl text-paper">
            {user.username[0]?.toUpperCase()}
          </span>
        )}
        <div>
          <h1 className="font-display text-3xl text-forest">
            {user.displayName || user.username}
          </h1>
          <p className="mt-1 text-sm text-sage">@{user.username}</p>
          {user.bio && <p className="mt-3 text-ink/80">{user.bio}</p>}
          <p className="mt-2 text-sm text-sage">{postCount} posts</p>
        </div>
      </header>

      <section aria-label="Posts">
        {posts.length ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="py-10 text-center text-sage">No posts yet.</p>
        )}
      </section>
    </main>
  );
}
