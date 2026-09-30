"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading || !user || !id) return;

    let cancelled = false;
    api.get(`/posts/${encodeURIComponent(id)}`)
      .then(({ data }) => {
        if (cancelled) return;
        setPost(data.post);
        setTitle(data.post.title);
        setDescription(data.post.description);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError.response?.data?.message || "Could not load this post.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      await api.put(`/posts/${encodeURIComponent(id)}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push(`/post/${encodeURIComponent(id)}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update your post.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || !user || loading) {
    return <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12 text-sage">Loading post…</main>;
  }

  if (error && !post) {
    return <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12"><p role="alert" className="text-red-700">{error}</p></main>;
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-5 py-12">
      <h1 className="mb-8 font-display text-3xl text-forest">Edit post</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm">
          <span className="mb-1 block text-ink">Title</span>
          <input
            required
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full border border-line bg-white px-3 py-2 outline-none focus:border-forest"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-ink">Description</span>
          <textarea
            required
            maxLength={5000}
            rows={10}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full border border-line bg-white px-3 py-2 leading-relaxed outline-none focus:border-forest"
          />
        </label>
        {post?.image && (
          <img
            src={post.image}
            alt=""
            className="max-h-64 w-full rounded-md border border-line object-cover"
          />
        )}
        <label className="block text-sm">
          <span className="mb-1 block text-ink">Replace cover image (optional)</span>
          <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-forest px-6 py-2.5 text-paper hover:bg-forest-dark disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </main>
  );
}
