"use client";

import { useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";
import { resolveImageUrl } from "../lib/imageUrl";

export default function CommentSection({ postId, initialComments, postAuthorId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await api.post(`/posts/${postId}/comments`, { text });
      setComments((prev) => [...prev, data.comment]);
      setText("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not post your comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    await api.delete(`/comments/${commentId}`);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  const canDelete = (comment) =>
    user &&
    (String(user.id) === String(comment.user?._id) ||
      String(user.id) === String(postAuthorId) ||
      user.role === "admin");

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl text-forest mb-5">
        Comments <span className="text-sage">({comments.length})</span>
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Add to the discussion…"
            className="w-full border border-line rounded-md px-3 py-2 outline-none focus:border-forest transition-colors bg-white"
          />
          {error && <p className="text-sm text-red-700 mt-1">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-forest text-paper px-5 py-2 rounded-full hover:bg-forest-dark transition-colors disabled:opacity-60"
          >
            {submitting ? "Posting…" : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="text-sage mb-8 text-sm">
          <Link href="/login" className="text-forest underline">
            Log in
          </Link>{" "}
          to join the discussion.
        </p>
      )}

      <ul className="space-y-5">
        {comments.map((comment) => (
          <li key={comment._id} className="flex gap-3">
            {comment.user?.profilePicture ? (
              <img
                src={resolveImageUrl(comment.user.profilePicture)}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-line shrink-0"
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-forest text-paper text-xs flex items-center justify-center shrink-0">
                {comment.user?.username?.[0]?.toUpperCase()}
              </span>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${comment.user?.username}`}
                  className="text-sm font-medium text-ink hover:text-forest"
                >
                  {comment.user?.displayName || comment.user?.username}
                </Link>
                <time className="text-xs text-sage">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="text-ink/90 mt-0.5">{comment.text}</p>
            </div>
            {canDelete(comment) && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="text-xs text-sage hover:text-red-700 shrink-0"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
