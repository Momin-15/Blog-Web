import Link from "next/link";
import { resolveImageUrl } from "../lib/imageUrl";

function EditLabel({ post }) {
  if (post.isDeleted) {
    return (
      <span className="text-xs text-red-700 border border-red-200 bg-red-50 px-2 py-0.5 rounded-full">
        Deleted by Admin
      </span>
    );
  }

  if (post.isEdited) {
    if (post.lastEditedBy === "admin") {
      return (
        <span className="text-xs text-sage border border-line px-2 py-0.5 rounded-full">
          Edited by Admin
        </span>
      );
    }

    return (
      <span className="text-xs text-sage border border-line px-2 py-0.5 rounded-full">
        Edited
      </span>
    );
  }

  return null;
}

export default function PostCard({ post }) {
  const image = resolveImageUrl(post.image);

  const author = post.author;

  const authorName =
    author?.displayName || author?.username;

  const authorFirstLetter =
    author?.username?.[0]?.toUpperCase();

  const likes =
    post.likesCount ?? post.likes?.length ?? 0;

  const views =
    post.views ?? 0;

  return (
    <article className="py-7 border-b border-line first:pt-0">

      {/* Author information */}
      <div className="flex items-center gap-2 mb-2 text-sm text-sage">

        <Link
          href={`/profile/${author?.username}`}
          className="flex items-center gap-2 hover:text-forest transition-colors"
        >

          {/* Profile picture */}
          {author?.profilePicture ? (
            <img
              src={resolveImageUrl(author.profilePicture)}
              alt=""
              className="w-6 h-6 rounded-full object-cover border border-line"
            />
          ) : (
            <span className="w-6 h-6 rounded-full bg-forest text-paper text-[10px] flex items-center justify-center">
              {authorFirstLetter}
            </span>
          )}

          <span>
            {authorName}
          </span>

        </Link>

        <span>·</span>

        {/* Post date */}
        <time>
          {new Date(post.createdAt).toLocaleDateString()}
        </time>

        {/* Edited / deleted label */}
        <EditLabel post={post} />

      </div>


      {/* Post content */}
      <Link
        href={`/post/${post._id}`}
        className="block group"
      >
        <div className="flex gap-5 items-start">

          {/* Title and description */}
          <div className="flex-1">

            <h2 className="font-display text-2xl leading-snug text-ink group-hover:text-forest transition-colors">
              {post.title}
            </h2>

            <p className="mt-2 text-ink/80 leading-relaxed line-clamp-2">
              {post.description}
            </p>

          </div>


          {/* Post image */}
          {image && (
            <img
              src={image}
              alt=""
              className="w-28 h-28 object-cover rounded-md border border-line shrink-0"
            />
          )}

        </div>
      </Link>


      {/* Likes and views */}
      <div className="mt-3 flex items-center gap-4 text-sm text-sage">

        <span>
          {likes} likes
        </span>

        <span>
          {views} views
        </span>

      </div>

    </article>
  );
}