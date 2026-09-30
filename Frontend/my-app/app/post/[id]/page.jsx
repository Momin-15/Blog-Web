import Link from "next/link";
import { notFound } from "next/navigation";
import CommentSection from "@/components/commentSection";
import LikeButton from "@/components/likeButton";
import PostActions from "@/components/postActions";
import { resolveImageUrl } from "@/lib/imageUrl";
import { serverFetch } from "@/lib/serverFetch";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }) {
  const { id } = await params;
  const result = await serverFetch(`/posts/${encodeURIComponent(id)}`);

  if (result.status === 404) {
    notFound();
  }

  if (!result.ok) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <p role="alert" className="text-red-700">
          {result.data.message || "Could not load this post."}
        </p>
      </main>
    );
  }

  const { post, comments, likedByMe } = result.data;
  const author = post.author;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
      <article>
        <Link
          href={`/profile/${encodeURIComponent(author.username)}`}
          className="text-sm text-sage hover:text-forest"
        >
          {author.displayName || author.username}
        </Link>
        <time className="ml-3 text-sm text-sage">
          {new Date(post.createdAt).toLocaleDateString()}
        </time>
        {post.isDeleted && (
          <p className="mt-4 text-sm text-red-700">Deleted by Admin</p>
        )}
        <h1 className="mt-4 font-display text-4xl leading-tight text-forest">
          {post.title}
        </h1>
        {post.image && (
          <img
            src={resolveImageUrl(post.image)}
            alt=""
            className="mt-7 max-h-[32rem] w-full rounded-md border border-line object-cover"
          />
        )}
        <div className="mt-8 whitespace-pre-wrap leading-8 text-ink/90">
          {post.description}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
          <div className="flex items-center gap-4 text-sm text-sage">
            <LikeButton
              postId={post._id}
              initialLikesCount={post.likesCount ?? post.likes?.length ?? 0}
              initialLikedByMe={Boolean(likedByMe)}
            />
            <span>{post.views ?? 0} views</span>
          </div>
          <PostActions postId={post._id} authorId={author._id} />
        </div>
      </article>
      <CommentSection
        postId={post._id}
        initialComments={comments}
        postAuthorId={author._id}
      />
    </main>
  );
}
