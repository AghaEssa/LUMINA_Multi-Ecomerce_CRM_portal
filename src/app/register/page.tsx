"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/common/Icons";
import { LuminaLogo } from "@/components/common/LuminaLogo";

export default function RegisterPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 2FA Setup Flow States
  const [is2FASetupStep, setIs2FASetupStep] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || email.split("@")[0], email, password }),
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

      try {
        const setupRes = await fetch("/api/auth/2fa/setup", { method: "POST" });
        const setupData = await setupRes.json();
        if (setupRes.ok && setupData.success) {
          setQrCodeUrl(setupData.qrCodeUrl);
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
    <main className="min-h-screen flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-6 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-200">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl z-10 transition-colors duration-200">
        
        {/* Lumina Heraldic Crest Logo */}
        <div className="text-center pt-2">
          <Link href="/" className="inline-block group" title="Return to Lumina Home">
            <LuminaLogo size="md" showText={true} />
          </Link>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-5 mb-5">
            {is2FASetupStep ? "Scan & Verify 2FA" : "Create Account"}
          </h1>
        </div>

        {/* 2FA Success Banner */}
        {setupSuccess && (
          <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span className="font-extrabold">2FA Enabled Successfully! Redirecting...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {is2FASetupStep ? (
          <div className="space-y-4 animate-fade-in">
            {qrCodeUrl && (
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeUrl}
                  alt="Google Authenticator QR Code"
                  className="h-36 w-36 object-contain rounded-xl"
                />
                <span className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Google Authenticator QR
                </span>
              </div>
            )}

            <form onSubmit={handleVerify2FASetup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1 text-center">
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
                  className="w-full text-center text-xl font-mono tracking-[0.4em] rounded-xl bg-[#f8fafc] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-black transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading || totpCode.length < 6}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-semibold text-sm py-3.5 shadow-md active:scale-[0.99] transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code →"}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Field with Left User Icon */}
            <div>
              <div className="relative flex items-center">
                <Icon name="User" className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                <input
                  id="register-email"
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
              {fieldErrors.email && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.email[0]}</p>
              )}
            </div>

            {/* Password Field with Left Lock Icon */}
            <div>
              <div className="relative flex items-center">
                <Icon name="Lock" className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
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
              {fieldErrors.password && (
                <p className="mt-1 text-[11px] text-rose-500 font-medium">{fieldErrors.password[0]}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <div className="relative flex items-center">
                <Icon name="Lock" className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full bg-[#f8fafc] dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-slate-300 transition"
                />
              </div>
            </div>

            {/* Solid Black Primary CTA Button with Arrow Right */}
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
                  <span>Sign up</span>
                  <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.2]" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 pt-3">
          <p className="flex items-center justify-center gap-1.5">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="inline-block border border-slate-900 dark:border-slate-100 px-2 py-0.5 rounded font-bold text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 transition"
            >
              Login
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
