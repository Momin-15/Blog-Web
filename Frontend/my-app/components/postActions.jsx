"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function PostActions({ postId, authorId }) {
  const { user } = useAuth();
  const router = useRouter();

  // If user is not logged in, show nothing
  if (!user) {
    return null;
  }

  // Check if current user owns the post
  const isOwner = String(user.id) === String(authorId);

  // Check if current user is an admin
  const isAdmin = user.role === "admin";

  // User is neither owner nor admin
  if (!isOwner && !isAdmin) {
    return null;
  }

  const handleDelete = async () => {
    let message = "";

    if (isOwner) {
      message = "Delete this post? This can't be undone.";
    } else {
      message =
        "Remove this post as admin? The author will see it was removed by an admin.";
    }

    const confirmed = confirm(message);

    if (!confirmed) {
      return;
    }

    await api.delete(`/posts/${postId}`);

    if (isOwner) {
      router.push(`/profile/${user.username}`);
    } else {
      router.push("/admin/posts");
    }
  };

  return (
    <div className="flex items-center gap-4 text-sm">

      {/* Owner can edit */}
      {isOwner && (
        <Link
          href={`/edit-post/${postId}`}
          className="text-forest underline"
        >
          Edit
        </Link>
      )}

      {/* Admin can edit someone else's post */}
      {isAdmin && !isOwner && (
        <Link
          href={`/edit-post/${postId}`}
          className="text-forest underline"
        >
          Edit as admin
        </Link>
      )}

      {/* Owner or admin can delete */}
      <button
        onClick={handleDelete}
        className="text-red-700 underline"
      >
        Delete
      </button>

    </div>
  );
}