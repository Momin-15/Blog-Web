"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);
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
    setMessage(null);
    setLoading(true);

    try {
      const response = await api.post("/auth/register", form);
      const data = response.data;

      setMessage(data.message);
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm px-5 py-16">
      <h1 className="font-display text-3xl text-forest mb-1">
        Join BlogApp 
      </h1>

      {message ? (
        <div className="border border-line rounded-md p-4 text-sm">
          <p className="text-forest font-medium mb-1">
            Account created
          </p>

          <p className="text-ink/80">
            {message}
          </p>

          <Link
            href="/login"
            className="inline-block mt-4 text-forest underline"
          >
            Go to log in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <Field
            label="Display name"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
          />

          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />

          {error && (
            <p className="text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest text-paper py-2.5 rounded-full hover:bg-forest-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-sm text-sage text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-forest underline"
            >
              Log in
            </Link>
          </p>
        </form>
      )}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block text-sm">
      <span className="block mb-1 text-ink">
        {label}
      </span>

      <input
        {...props}
        required
        className="w-full border border-line rounded-md px-3 py-2 outline-none focus:border-forest transition-colors bg-white"
      />
    </label>
  );
}