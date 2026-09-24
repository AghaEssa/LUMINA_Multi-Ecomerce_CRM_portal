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
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
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
      window.location.href = callbackUrl;
    } catch {
      setError("An unexpected connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-9 text-slate-900 dark:text-white shadow-2xl backdrop-blur-xl z-10 transition-all duration-300">
      
      {/* Lumina Heraldic Crest Logo */}
      <div className="text-center pt-1">
        <Link href="/" className="inline-block group" title="Return to Lumina Home">
          <LuminaLogo size="md" showText={true} />
        </Link>
        
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-5 mb-2">
          {require2FA ? "Two-Factor Verification" : "Welcome Back"}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6">
          {require2FA ? "Enter your 6-digit authenticator code" : "Sign in to access your saved cart & profile"}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3.5 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 shadow-xs">
          <span className="font-bold text-sm">⚠️</span>
          <span className="font-semibold leading-relaxed">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!require2FA ? (
          <>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
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
                  placeholder="name@company.com"
                  className="w-full bg-[#f8fafc] dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-ocean-600 dark:focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
              </div>
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
                  placeholder="••••••••"
                  className="w-full bg-[#f8fafc] dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-ocean-600 dark:focus:border-amber-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 text-center">
              6-Digit Authenticator Code
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="w-full text-center text-xl font-mono tracking-[0.4em] rounded-xl bg-[#f8fafc] dark:bg-slate-950 border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400 transition"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#075570] hover:bg-[#053d52] dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-950 text-white font-black text-sm py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-3 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-white dark:border-slate-950 border-t-transparent animate-spin" />
              Verifying...
            </span>
          ) : (
            <>
              <span>{require2FA ? "Verify Code" : "Sign In to Account"}</span>
              <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.2]" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
        <p className="flex items-center justify-center gap-1.5">
          <span>Don&apos;t have an account?</span>
          <Link
            href={callbackUrl !== "/account" ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register"}
            className="inline-block border border-slate-900 dark:border-amber-400 px-2.5 py-0.5 rounded-lg font-bold text-slate-900 dark:text-amber-400 hover:bg-slate-900 hover:text-white dark:hover:bg-amber-400 dark:hover:text-slate-950 transition"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden font-sans">
      
      {/* Left Branded Showcase Panel (Hidden on Mobile, Visible on Desktop) */}
      <div className="lg:col-span-6 xl:col-span-7 hidden lg:flex flex-col justify-between p-12 lg:p-16 relative bg-gradient-to-br from-[#052b39] via-[#075570] to-[#041d27] text-white overflow-hidden">
        {/* Subtle Background Pattern & Ambient Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" title="Go to Lumina Storefront">
            <LuminaLogo size="md" textColor="text-white" />
          </Link>
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-white/15 backdrop-blur-md">
            ENTERPRISE STORE
          </span>
        </div>

        {/* Center Showcase Content */}
        <div className="relative z-10 max-w-xl space-y-8 my-auto py-12">
          <div className="space-y-4">
             
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Elevate Your Lifestyle with <span className="text-amber-300">LUMINA</span>
            </h2>
            <p className="text-sm text-ocean-100/90 leading-relaxed font-normal">
              Seamless shopping across high-fashion clothing, luxury ergonomic furniture, clinical medical gear, organic foods & smart electronics.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="text-lg">🛡️</span>
              <p className="text-xs font-bold text-white">2FA Security</p>
              <p className="text-[10px] text-ocean-200">Google Authenticator protection</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="text-lg">🛍️</span>
              <p className="text-xs font-bold text-white">Unified Cart</p>
              <p className="text-[10px] text-ocean-200">Guest to account cart merging</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1">
              <span className="text-lg">⚡</span>
              <p className="text-xs font-bold text-white">Express Delivery</p>
              <p className="text-[10px] text-ocean-200">Real-time order tracking</p>
            </div>
          </div>
        </div>

        {/* Footer Stats Row */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-6 text-xs text-ocean-200">
          <div className="flex items-center gap-6 font-semibold">
            <div><span className="font-extrabold text-white text-sm">50K+</span> Products</div>
            <div><span className="font-extrabold text-white text-sm">99.9%</span> Security</div>
            <div><span className="font-extrabold text-white text-sm">24/7</span> Support</div>
          </div>
          <p className="text-[11px] text-ocean-300 font-medium">© 2026 Lumina Storefront</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between p-6 sm:p-12 bg-slate-50 dark:bg-[#070c18] relative min-h-screen lg:min-h-0">
        
        {/* Top Back Link */}
        <div className="flex justify-between items-center w-full max-w-[440px] mx-auto pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition group"
          >
            <Icon name="ArrowLeft" className="h-4 w-4 transition group-hover:-translate-x-1" />
            <span>Back to Storefront</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-auto flex items-center justify-center w-full">
          <Suspense fallback={
            <div className="relative w-full max-w-[440px] rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
              <div className="h-8 w-8 mx-auto border-4 border-[#075570] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Loading Sign In...</p>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>

        {/* Bottom Helper text for mobile */}
        <div className="pt-6 text-center text-[11px] text-slate-400 dark:text-slate-600">
          Protected by Lumina Enterprise Security • Terms & Privacy Policy
        </div>

      </div>

    </main>
  );
}
