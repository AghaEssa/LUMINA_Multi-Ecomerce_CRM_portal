"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/common/Icons";
import { useAuth } from "@/context/AuthContext";

export function ProfileModal() {
  const { user, checkAuth, isProfileModalOpen, closeProfileModal } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  if (!isProfileModalOpen || !user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setMsg(null);
    setError(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || "Failed to update profile name.");
        return;
      }

      // Refresh user auth session across application
      await checkAuth();
      setMsg("🎉 Profile display name updated successfully!");
    } catch {
      setError("Network error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeProfileModal}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-scale-up p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Customer Profile
            </h3>
          </div>

          <button
            onClick={closeProfileModal}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 p-3 text-xs font-bold">
            ⚠️ {error}
          </div>
        )}

        {msg && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 p-3 text-xs text-emerald-700 font-bold">
            {msg}
          </div>
        )}

        {/* Profile Avatar Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="h-14 w-14 rounded-full bg-[#0b3328] border-2 border-emerald-500 text-emerald-400 font-black text-xl flex items-center justify-center shadow-inner shrink-0">
            {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
          </div>
          <div className="space-y-0.5 min-w-0">
            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
              {user.name || "Lumina Customer"}
            </h4>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
            <span className="inline-block text-[9px] font-extrabold uppercase bg-ocean-50 dark:bg-amber-400/10 text-ocean-700 dark:text-amber-400 px-2 py-0.5 rounded border border-ocean-200 dark:border-amber-400/20">
              {user.role} Account
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Display Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Address:
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-400 opacity-80 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950 py-3 text-xs font-extrabold shadow transition"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
