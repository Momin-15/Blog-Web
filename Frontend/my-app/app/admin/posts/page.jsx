"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/adminShell";
import PostActions from "@/components/postActions";
import PostCard from "@/components/postCard";
import api from "@/lib/api";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    let cancelled = false;
    api.get("/admin/posts")
      .then(({ data }) => {
        if (!cancelled) setPosts(data.posts);
      }) 

      .catch((requestError) => {
        if (!cancelled) setError(requestError.response?.data?.message || "Could not load posts.");
      }) 
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <AdminShell title="Manage posts">
      {loading && <p className="text-sage">Loading posts…</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
      {!loading && !error && posts.length === 0 && <p className="text-sage">No posts found.</p>}
      {posts.map((post) => (
        <div key={post._id}>
          <PostCard post={post} />
          <div className="mb-6">
            <PostActions postId={post._id} authorId={post.author?._id} />
          </div>
        </div>
      ))}
    </AdminShell>
  );
}
