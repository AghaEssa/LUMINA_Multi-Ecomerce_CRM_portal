"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { checkAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload: { email: string; password: string; totpCode?: string } = { email, password };
      if (require2FA && totpCode) {
        payload.totpCode = totpCode;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Invalid credentials. Please check your email and password.");
        setLoading(false);
        return;
      }

      if (data.requireTwoFactor) {
        setRequire2FA(true);
        setError(null);
        setLoading(false);
        return;
      }

      await checkAuth();
      router.push(callbackUrl);
    } catch {
      setError("An unexpected connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#070a12] p-4 sm:p-6 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-ocean-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl z-10 transition-colors duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-ocean-950 font-black text-xl shadow-md group-hover:scale-105 transition">
              L
            </div>
            <span className="text-2xl font-black tracking-[0.2em] text-slate-900 dark:text-white">LUMINA</span>
          </Link>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {require2FA ? "Two-Factor Verification" : "Login to Your Account"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            {require2FA
              ? "Enter 6-digit code from Google Authenticator / Authy app"
              : "Enter your email & password to access your cart & profile"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/40 p-3.5 text-xs text-rose-700 dark:text-rose-200 flex items-start gap-2.5">
            <span className="font-bold text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!require2FA ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/20 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/20 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 mb-1.5">
                6-Digit Authenticator Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-amber-500 dark:border-amber-400 px-4 py-3 text-slate-900 dark:text-amber-300 placeholder-slate-400 focus:outline-none transition"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ffb800] hover:bg-[#f5b000] text-[#0f172a] font-black uppercase text-xs tracking-wider py-3.5 shadow-lg active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                Logging in...
              </span>
            ) : require2FA ? (
              "Verify Code"
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-300 pt-5 border-t border-slate-200 dark:border-white/10">
          <p>
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="font-bold text-ocean-700 dark:text-amber-300 hover:underline">
              Signup Now
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
