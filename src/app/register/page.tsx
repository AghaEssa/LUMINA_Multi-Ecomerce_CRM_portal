"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 2FA Setup Flow States
  const [is2FASetupStep, setIs2FASetupStep] = useState(false);
  const [setupSubStep, setSetupSubStep] = useState<"scan" | "verify">("scan");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [setupSuccess, setSetupSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleVerify2FASetup = async (e: React.FormEvent) => {
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
        setError(data.error?.message || "Invalid 6-digit code. Please check Google Authenticator.");
        setLoading(false);
        return;
      }

      setSetupSuccess(true);
      await checkAuth();
      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch {
      setError("Connection error verifying 2FA code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (is2FASetupStep) {
      return handleVerify2FASetup(e);
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.error?.details) {
          setFieldErrors(data.error.details);
        }
        setError(data.error?.message || "Signup failed. Please check your inputs.");
        setLoading(false);
        return;
      }

      // DO NOT call checkAuth() here so user profile badge isn't shown in header until 2FA is verified!

      // Initiate 2FA Setup Flow with Google Authenticator QR Code
      try {
        const setupRes = await fetch("/api/auth/2fa/setup", { method: "POST" });
        const setupData = await setupRes.json();
        if (setupRes.ok && setupData.success) {
          setQrCodeUrl(setupData.qrCodeUrl);
          setSecretKey(setupData.secret);
          setIs2FASetupStep(true);
          setError(null);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback
      }

      router.push("/");
    } catch {
      setError("An unexpected connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#070a12] p-4 sm:p-6 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-ocean-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl z-10 transition-colors duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-5">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-ocean-950 font-black text-xl shadow-md group-hover:scale-105 transition">
              L
            </div>
            <span className="text-2xl font-black tracking-[0.2em] text-slate-900 dark:text-white">LUMINA</span>
          </Link>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {is2FASetupStep ? "Scan & Verify 2FA" : "Create Your Account"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            {is2FASetupStep
              ? "Scan QR code with Google Authenticator on your phone & enter the 6-digit code"
              : "Signup for Lumina to save cart items, manage orders & access features"}
          </p>
        </div>

        {/* Success Alert Banner for 2FA */}
        {setupSuccess && (
          <div className="mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 p-3.5 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span className="font-extrabold">2FA Enabled Successfully! Redirecting...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 dark:bg-rose-500/20 border border-rose-200 dark:border-rose-500/40 p-3.5 text-xs text-rose-700 dark:text-rose-200 flex items-start gap-2.5">
            <span className="font-bold text-sm">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {is2FASetupStep ? (
          <div className="space-y-4 animate-fade-in">
            {/* QR Code Image */}
            {qrCodeUrl && (
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="Google Authenticator QR Code"
                  className="h-40 w-40 object-contain rounded-xl"
                />
                <span className="mt-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Google Authenticator QR
                </span>
              </div>
            )}

            {/* Direct 6-Digit Verification Form */}
            <form onSubmit={handleVerify2FASetup} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300 mb-1 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-amber-500 dark:border-amber-400/50 px-4 py-3 text-slate-900 dark:text-amber-200 placeholder-slate-400 focus:border-amber-400 focus:outline-none transition shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading || totpCode.length < 6}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-xs tracking-wider py-3.5 shadow-lg active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify"
                )}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Agha Essa"
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-300 dark:border-white/20 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none transition"
              />
              {fieldErrors.name && (
                <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">{fieldErrors.name[0]}</p>
              )}
            </div>

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
              {fieldErrors.email && (
                <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">{fieldErrors.email[0]}</p>
              )}
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
              {fieldErrors.password && (
                <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">{fieldErrors.password[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ffb800] hover:bg-[#f5b000] text-[#0f172a] font-black uppercase text-xs tracking-wider py-3.5 shadow-lg active:scale-[0.98] transition disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                  Signing up...
                </span>
              ) : (
                "Signup & Setup 2FA"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-xs text-slate-500 dark:text-slate-300 pt-5 border-t border-slate-200 dark:border-white/10">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-ocean-700 dark:text-amber-300 hover:underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
