"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/common/Icons";
import { LuminaLogo } from "@/components/common/LuminaLogo";

function LoginForm() {
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
    <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl z-10 transition-colors duration-200">
      
      {/* Lumina Heraldic Crest Logo */}
      <div className="text-center pt-2">
        <Link href="/" className="inline-block group" title="Return to Lumina Home">
          <LuminaLogo size="md" showText={true} />
        </Link>
        
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-5 mb-5">
          {require2FA ? "Two-Factor Verification" : "Login"}
        </h1>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
          <span className="font-bold">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {!require2FA ? (
          <>
            {/* Email Field with Left User Icon */}
            <div>
              <div className="relative flex items-center">
                <Icon name="User" className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-[#f8fafc] dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-300 transition"
                />
              </div>
            </div>

            {/* Password Field with Left Lock Icon & Right Toggle */}
            <div>
              <div className="relative flex items-center">
                <Icon name="Lock" className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-[#f8fafc] dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-300 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 text-center">
              6-Digit Authenticator Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full text-center text-xl font-mono tracking-[0.4em] rounded-xl bg-[#f8fafc] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-black transition"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white font-semibold text-sm py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-2 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 border-t-transparent animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <span>{require2FA ? "Verify Code" : "Login"}</span>
              <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.2]" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 pt-3">
        <p className="flex items-center justify-center gap-1.5">
          <span>Don&apos;t have an account?</span>
          <Link
            href="/register"
            className="inline-block border border-slate-900 dark:border-slate-100 px-2 py-0.5 rounded font-bold text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 transition"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-200">
      <Suspense fallback={
        <div className="relative w-full max-w-[420px] rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <div className="h-8 w-8 mx-auto border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loading Sign In...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
