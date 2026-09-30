"use client";

import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import PostCard from "./postCard";

export default function Feed({ initialPosts, initialHasMore }) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef(null);

  const loadMore = async () => {
    if (loading || !hasMore) {
      return;
    }

    setLoading(true);

    try {
      const nextPage = page + 1;

      const response = await api.get(
        `/posts?page=${nextPage}&limit=10`
      );

      const data = response.data;

      setPosts((oldPosts) => [
        ...oldPosts,
        ...data.posts,
      ]);

      setHasMore(data.hasMore);
      setPage(nextPage);

    } catch (error) {
      setHasMore(false);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const element = sentinelRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "300px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [page, loading, hasMore]);

  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-sage">
        <p className="font-display text-xl text-ink mb-2">
          Nothing here yet.
        </p>

        <p>Be the first to publish a post.</p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
        />
      ))}

      <div
        ref={sentinelRef}
        className="h-10"
      />

      {loading && (
        <p className="text-center text-sage py-6">
          Loading more posts…
        </p>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-sage py-6 text-sm">
          You've reached the end.
        </p>
      )}
    </div>
  );
}