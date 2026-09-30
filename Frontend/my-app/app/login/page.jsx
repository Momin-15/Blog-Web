"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/login", form);

      await refreshUser();

      router.push("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-3xl text-forest mb-8">
        Welcome back
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-sm">
          <span className="block mb-1 text-ink">
            Email
          </span>

          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-line rounded-md px-3 py-2 outline-none focus:border-forest transition-colors bg-white"
          />
        </label>

        <label className="block text-sm">
          <span className="block mb-1 text-ink">
            Password
          </span>

          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full border border-line rounded-md px-3 py-2 outline-none focus:border-forest transition-colors bg-white"
          />
        </label>

        {error && (
          <p className="text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-forest text-paper py-2.5 rounded-full hover:bg-forest-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Log in"}
        </button>

        <p className="text-sm text-sage text-center">
          New here?{" "}
          <Link
            href="/register"
            className="text-forest underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}