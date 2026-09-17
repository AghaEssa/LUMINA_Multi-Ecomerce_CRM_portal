"use client";

import React, { useState } from "react";
import { Icon } from "@/components/common/Icons";
import { useAuth } from "@/context/AuthContext";

interface Security2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Security2FAModal() {
  const { user, checkAuth, isSecurityModalOpen, closeSecurityModal } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Setup Flow States
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [totpCode, setTotpCode] = useState("");

  if (!isSecurityModalOpen || !user) return null;

  const handleDisable2FA = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/2fa/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enable: false }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || "Failed to disable 2FA.");
        return;
      }

      setSuccessMsg("Two-Factor Authentication (2FA) has been turned OFF.");
      await checkAuth();
    } catch {
      setError("Network error turning off 2FA.");
    } flex: {
      setLoading(false);
    }
  };

  const handleStartSetup = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Failed to start 2FA setup.");
        return;
      }

      setQrCodeUrl(data.qrCodeUrl);
      setIsSettingUp(true);
    } catch {
      setError("Network error starting 2FA setup.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: totpCode }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || "Invalid 6-digit code.");
        return;
      }

      setSuccessMsg("🎉 2FA Activated Successfully!");
      setIsSettingUp(false);
      await checkAuth();
    } catch {
      setError("Network error verifying 2FA code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeSecurityModal}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-scale-up p-6 space-y-6">
        {/* Close Button Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              2FA Security Settings
            </h3>
          </div>

          <button
            onClick={closeSecurityModal}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 p-3.5 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-3.5 text-xs text-emerald-700 dark:text-emerald-300 flex items-start gap-2">
            <span>✅</span>
            <span className="font-extrabold">{successMsg}</span>
          </div>
        )}

        {/* Current Status Overview */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Current Status:</span>
            {user.isTwoFactorEnabled ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Active (Protected)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Disabled (Unprotected)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Two-Factor Authentication adds an extra layer of security to your account requiring Google Authenticator.
          </p>
        </div>

        {/* Setup Flow or Main Action Buttons */}
        {isSettingUp ? (
          <form onSubmit={handleVerifySetup} className="space-y-4 animate-fade-in">
            {qrCodeUrl && (
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeUrl} alt="Google Authenticator QR Code" className="h-40 w-40 object-contain rounded-xl" />
                <span className="mt-2 text-[10px] font-black text-slate-500 uppercase">
                  Scan with Google Authenticator
                </span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
                Enter 6-Digit Code to Activate:
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full text-center text-xl font-mono tracking-[0.4em] rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsSettingUp(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || totpCode.length < 6}
                className="flex-1 rounded-xl bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950 py-3 text-xs font-extrabold disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Turn ON"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            {user.isTwoFactorEnabled ? (
              <button
                onClick={handleDisable2FA}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-3.5 shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <span>Turn OFF 2FA (Disable)</span>
              </button>
            ) : (
              <button
                onClick={handleStartSetup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <span>Turn ON 2FA (Enable)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
