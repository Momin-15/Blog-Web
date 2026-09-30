"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/adminShell";
import api from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users);
      setError(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    api.get("/admin/users")
      .then(({ data }) => {
        if (!cancelled) setUsers(data.users);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.response?.data?.message || "Could not load users.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleBan = async (user) => {
    setError(null);
    try {
      await api.put(`/admin/users/${encodeURIComponent(user._id)}/ban`);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update this account.");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete ${user.username} and their posts? This cannot be undone.`)) return;
    setError(null);
    try {
      await api.delete(`/admin/users/${encodeURIComponent(user._id)}`);
      setUsers((current) => current.filter((item) => item._id !== user._id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete this account.");
    }
  };

  return (
    <AdminShell title="Manage users">
      {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      {loading ? (
        <p className="text-sage">Loading users…</p>
      ) : users.length === 0 ? (
        <p className="text-sage">No users found.</p>
      ) : (
        <ul className="divide-y divide-line">
          {users.map((user) => (
            <li key={user._id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="font-medium text-ink">{user.displayName || user.username}</p>
                <p className="text-sm text-sage">@{user.username} · {user.email}</p>
                <p className="mt-1 text-xs text-sage">
                  {user.role}{user.isBanned ? " · Banned" : ""}
                </p>
              </div>
              <div className="flex gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => handleBan(user)}
                  disabled={user.role === "admin"}
                  className="text-forest underline disabled:opacity-50"
                >
                  {user.isBanned ? "Unban" : "Ban"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(user)}
                  disabled={user.role === "admin"}
                  className="text-red-700 underline disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
