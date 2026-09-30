"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function LikeButton({
  postId,
  initialLikesCount,
  initialLikedByMe,
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [likedByMe, setLikedByMe] = useState(initialLikedByMe);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {

    // If user is not logged in, go to login page
    if (!user) {
      router.push("/login");
      return;
    }

    // Don't allow another request while one is already running
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(`/posts/${postId}/like`);

      const data = response.data;

      setLikesCount(data.likesCount);
      setLikedByMe(data.likedByMe);

    } catch (error) {
      console.log("Like failed:", error);

    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
        likedByMe
          ? "bg-forest text-paper border-forest"
          : "border-line text-ink hover:border-forest"
      }`}
    >
      <span>
        {likedByMe ? "♥ Liked" : "♡ Like"}
      </span>

      <span>{likesCount}</span>
    </button>
  );
}