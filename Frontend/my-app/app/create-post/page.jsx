"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function CreatePostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setImage(file);
      setPreview(window.URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null);
    setSubmitting(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = response.data;

      router.push(`/post/${data.post._id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Could not publish your post."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  if (user.role !== "user" && user.role !== "admin") {
    return (
      <div className="mx-auto max-w-sm px-5 py-16 text-center">
        <p className="text-ink">
          Your account is not allowed to publish posts.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <h1 className="font-display text-3xl text-forest mb-8">
        Write a new post
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm">
          <span className="block mb-1 text-ink">
            Title
          </span>

          <input
            required
            maxLength={120}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full border border-line rounded-md px-3 py-2 outline-none focus:border-forest transition-colors bg-white font-display text-lg"
            placeholder="Give your post a title"
          />
        </label>

        <label className="block text-sm">
          <span className="block mb-1 text-ink">
            Description
          </span>

          <textarea
            required
            maxLength={5000}
            rows={10}
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            className="w-full border border-line rounded-md px-3 py-2 outline-none focus:border-forest transition-colors bg-white leading-relaxed"
            placeholder="Write what you'd like to publish…"
          />
        </label>

        <label className="block text-sm">
          <span className="block mb-1 text-ink">
            Cover image (optional)
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-3 w-full max-h-64 object-cover rounded-md border border-line"
            />
          )}
        </label>

        {error && (
          <p className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-forest text-paper px-6 py-2.5 rounded-full hover:bg-forest-dark transition-colors disabled:opacity-60"
        >
          {submitting ? "Publishing…" : "Publish post"}
        </button>
      </form>
    </div>
  );
}