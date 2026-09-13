"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { Icon } from "@/components/common/Icons";

export function AuthModal() {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    pendingProduct,
    pendingAction,
    checkAuth,
    logout,
  } = useAuth();

  const { addToCart } = useCartContext();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);

  // 2FA Setup Flow States (QR Code Google Authenticator)
  const [is2FASetupStep, setIs2FASetupStep] = useState(false);
  const [setupSubStep, setSetupSubStep] = useState<"scan" | "verify">("scan");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [setupSuccess, setSetupSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Lock body scrolling when modal is open to prevent background scrolling
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setTotpCode("");
    setRequire2FA(false);
    setIs2FASetupStep(false);
    setSetupSubStep("scan");
    setQrCodeUrl("");
    setSecretKey("");
    setSetupSuccess(false);
    setError(null);
    setFieldErrors({});
  };

  const handleCancelOrClose = async () => {
    if (is2FASetupStep) {
      // If closing/canceling while unverified in 2FA setup, log out unverified session
      await logout();
    }
    resetForm();
    closeAuthModal();
  };

  const handleModeSwitch = (mode: "login" | "register") => {
    resetForm();
    setAuthModalMode(mode);
  };

  const handleSuccessAuth = async () => {
    await checkAuth();

    // If there was a pending product add-to-cart attempt
    if (pendingProduct) {
      addToCart({ product: pendingProduct, openDrawer: true });
    } else if (pendingAction) {
      pendingAction();
    }

    resetForm();
    closeAuthModal();
  };

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
      setTimeout(async () => {
        await handleSuccessAuth();
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
      if (authModalMode === "login") {
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
          if (data.error?.details) {
            setFieldErrors(data.error.details);
          }
          setError(data.error?.message || "Login failed. Please verify your credentials.");
          setLoading(false);
          return;
        }

        if (data.requireTwoFactor) {
          setRequire2FA(true);
          setError(null);
          setLoading(false);
          return;
        }

        await handleSuccessAuth();
      } else if (authModalMode === "register") {
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
          setError(data.error?.message || "Signup failed. Please check input requirements.");
          setLoading(false);
          return;
        }

        // DO NOT call checkAuth() here so user profile badge isn't shown in header until 2FA is verified!

        // Initiate 2FA Setup Flow with Google Authenticator QR Code right after signup!
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
          // If setup call fails, complete registration cleanly
        }

        await handleSuccessAuth();
      }
    } catch {
      setError("An unexpected connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      {/* Backdrop (Disabled click-to-close during 2FA setup to prevent accidental unverified login) */}
      <div
        onClick={() => {
          if (!is2FASetupStep && !loading) {
            handleCancelOrClose();
          }
        }}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity cursor-default"
      />

      {/* Dynamic Theme Modal Container (Supports Light & Dark Modes) */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1527] p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl z-10 transition-colors duration-300">
        
        {/* Close Button */}
        <button
          onClick={handleCancelOrClose}
          className="absolute top-4 right-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20 hover:text-slate-900 dark:hover:text-white transition z-20"
        >
          <Icon name="X" className="h-4 w-4" />
        </button>

        {/* Pending Add to Cart Alert Banner */}
        {pendingProduct && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3.5 text-amber-900 dark:text-amber-300">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
              <Image src={pendingProduct.image} alt={pendingProduct.title} fill className="object-cover" />
            </div>
            <div className="text-xs">
              <p className="font-extrabold text-amber-950 dark:text-amber-200">Login to Add to Cart</p>
              <p className="line-clamp-1 text-slate-600 dark:text-slate-300">
                Please login or signup to add <span className="font-semibold text-slate-900 dark:text-white">{pendingProduct.title}</span> to your cart.
              </p>
            </div>
          </div>
        )}

        {/* Brand Logo & Header */}
        <div className="text-center space-y-2 mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean-50 dark:bg-ocean-500/20 border border-ocean-200 dark:border-ocean-400/30 text-ocean-700 dark:text-ocean-300 text-xs font-bold uppercase tracking-widest">
            <span className="h-2 w-2 rounded-full bg-ocean-500 dark:bg-ocean-400 animate-pulse" />
            LUMINA Security
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {is2FASetupStep
              ? "Scan & Verify 2FA"
              : require2FA
              ? "Two-Factor Verification"
              : authModalMode === "login"
              ? "Welcome Back"
              : "Create Lumina Account"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {is2FASetupStep
              ? "Scan QR code with Google Authenticator on your phone & enter the 6-digit code"
              : require2FA
              ? "Enter 6-digit code from your authenticator app"
              : authModalMode === "login"
              ? "Login to access your cart & account features"
              : "Signup to explore curated luxury collections"}
          </p>
        </div>

        {/* Mode Tabs (Login / Signup) */}
        {!require2FA && !is2FASetupStep && (
          <div className="mb-6 flex rounded-xl bg-slate-100 dark:bg-slate-900/80 p-1 border border-slate-200 dark:border-white/5">
            <button
              onClick={() => handleModeSwitch("login")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                authModalMode === "login"
                  ? "bg-[#075570] dark:bg-ocean-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleModeSwitch("register")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                authModalMode === "register"
                  ? "bg-[#075570] dark:bg-ocean-600 text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Signup
            </button>
          </div>
        )}

        {/* Success Alert Banner for 2FA */}
        {setupSuccess && (
          <div className="mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/40 p-3.5 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span className="font-extrabold">2FA Enabled Successfully! Logging in...</span>
          </div>
        )}

        {/* Main Error Alert */}
        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* 1-Screen 2FA Flow (QR Code + Code Input Box Together) */}
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
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 mb-1 text-center">
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
                  className="w-full text-center text-2xl font-mono tracking-[0.5em] rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-amber-500 dark:border-amber-400/50 px-4 py-3 text-slate-900 dark:text-amber-200 placeholder-slate-400 focus:border-amber-500 focus:outline-none transition shadow-inner"
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
          /* Form Inputs */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Register: Full Name */}
            {authModalMode === "register" && !require2FA && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Agha Essa"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-ocean-600 dark:focus:border-ocean-400 focus:outline-none transition"
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">{fieldErrors.name[0]}</p>
                )}
              </div>
            )}

            {/* Email Address */}
            {!require2FA && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-ocean-600 dark:focus:border-ocean-400 focus:outline-none transition"
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-rose-500 dark:text-rose-400 font-medium">{fieldErrors.email[0]}</p>
                )}
              </div>
            )}

            {/* Password Input */}
            {!require2FA && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700/80 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-ocean-600 dark:focus:border-ocean-400 focus:outline-none transition pr-10"
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
            )}

            {/* 2FA TOTP Code Step */}
            {require2FA && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300 mb-1">
                  6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center text-xl font-mono tracking-[0.5em] rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-amber-500 dark:border-amber-400/50 px-4 py-3 text-slate-900 dark:text-amber-200 placeholder-slate-400 focus:border-amber-500 focus:outline-none transition"
                />
                <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 text-center">
                  Open Google Authenticator or Authy app on your phone
                </p>
              </div>
            )}

            {/* Vibrant Submit CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ffb800] hover:bg-[#f5b000] text-[#0f172a] font-black uppercase text-xs tracking-wider py-3.5 shadow-lg active:scale-[0.98] transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                  Processing...
                </span>
              ) : require2FA ? (
                "Verify 2FA Code"
              ) : authModalMode === "login" ? (
                "Login"
              ) : (
                "Signup"
              )}
            </button>
          </form>
        )}

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-white/5">
          {authModalMode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => handleModeSwitch("register")}
                className="font-bold text-ocean-700 dark:text-amber-400 hover:underline"
              >
                Signup Now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => handleModeSwitch("login")}
                className="font-bold text-ocean-700 dark:text-amber-400 hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
