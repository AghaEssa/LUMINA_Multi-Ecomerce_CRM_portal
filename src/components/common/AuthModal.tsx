"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { Icon } from "@/components/common/Icons";
import { LuminaLogo } from "@/components/common/LuminaLogo";

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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [require2FA, setRequire2FA] = useState(false);

  // 2FA Setup Flow States (QR Code Google Authenticator)
  const [is2FASetupStep, setIs2FASetupStep] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [setupSuccess, setSetupSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Lock body scrolling when modal is open
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
    setConfirmPassword("");
    setName("");
    setTotpCode("");
    setRequire2FA(false);
    setIs2FASetupStep(false);
    setQrCodeUrl("");
    setSetupSuccess(false);
    setError(null);
    setFieldErrors({});
  };

  const handleCancelOrClose = async () => {
    if (is2FASetupStep) {
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

    // Validate Confirm Password on signup
    if (authModalMode === "register" && password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

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
          setError(data.error?.message || "Login failed. Please check your credentials.");
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
          body: JSON.stringify({ name: name || email.split("@")[0], email, password }),
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

        // Setup 2FA optionally or handle direct login
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
          // Fallback if 2FA endpoint is unavailable
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
      {/* Dark Overlay Backdrop */}
      <div
        onClick={() => {
          if (!is2FASetupStep && !loading) {
            handleCancelOrClose();
          }
        }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity cursor-default"
      />

      {/* Clean White Card Modal Container matching exact Template design */}
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 sm:p-8 text-slate-900 dark:text-white shadow-2xl z-10 transition-colors duration-200">
        
        {/* Top-Right Close (X) Icon */}
        <button
          onClick={handleCancelOrClose}
          type="button"
          aria-label="Close modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
        >
          <Icon name="X" className="h-5 w-5 stroke-[2.5]" />
        </button>

        {/* Pending Add-to-Cart Alert Banner */}
        {pendingProduct && (
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3 text-amber-900 dark:text-amber-300">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-800">
              <Image src={pendingProduct.image} alt={pendingProduct.title} fill className="object-cover" />
            </div>
            <div className="text-xs">
              <p className="font-extrabold">Login to add item</p>
              <p className="line-clamp-1 text-slate-600 dark:text-slate-300">
                <span className="font-semibold">{pendingProduct.title}</span>
              </p>
            </div>
          </div>
        )}

        {/* Lumina Heraldic Crest Logo */}
        <div className="text-center pt-2">
          <LuminaLogo size="md" showText={true} />
          
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-5 mb-5">
            {is2FASetupStep
              ? "Scan & Verify 2FA"
              : require2FA
              ? "Two-Factor Verification"
              : authModalMode === "login"
              ? "Login"
              : "Create Account"}
          </h2>
        </div>

        {/* 2FA Success Alert */}
        {setupSuccess && (
          <div className="mb-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span className="font-extrabold">2FA Verification Successful!</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 p-3 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* 2FA Verification Flow */}
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
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="w-full text-center text-xl font-mono tracking-[0.4em] rounded-xl bg-[#f8fafc] dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-black dark:focus:border-white transition"
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
          /* Main Form matching Template Screenshot */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email Field with Left Icon */}
            {!require2FA && (
              <div>
                <div className="relative flex items-center">
                  <Icon name="User" className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                  <input
                    id="modal-email"
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
            )}

            {/* Password Field with Left Icon & Right Toggle */}
            {!require2FA && (
              <div>
                <div className="relative flex items-center">
                  <Icon name="Lock" className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                  <input
                    id="modal-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete={authModalMode === "login" ? "current-password" : "new-password"}
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
            )}

            {/* Confirm Password Field (Only in Create Account / Signup Mode) */}
            {authModalMode === "register" && !require2FA && (
              <div>
                <div className="relative flex items-center">
                  <Icon name="Lock" className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                  <input
                    id="modal-confirm-password"
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
            )}

            {/* 2FA Input Step */}
            {require2FA && (
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
                  <span>
                    {require2FA
                      ? "Verify 2FA"
                      : authModalMode === "login"
                      ? "Login"
                      : "Sign up"}
                  </span>
                  <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.2]" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Bottom Toggle Line matching exact Screenshot border box styling */}
        <div className="mt-6 text-center text-xs text-slate-600 dark:text-slate-400 pt-3">
          {authModalMode === "login" ? (
            <p className="flex items-center justify-center gap-1.5">
              <span>Don&apos;t have an account?</span>
              <button
                type="button"
                onClick={() => handleModeSwitch("register")}
                className="inline-block border border-slate-900 dark:border-slate-100 px-2 py-0.5 rounded font-bold text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 transition"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="flex items-center justify-center gap-1.5">
              <span>Already have an account?</span>
              <button
                type="button"
                onClick={() => handleModeSwitch("login")}
                className="inline-block border border-slate-900 dark:border-slate-100 px-2 py-0.5 rounded font-bold text-slate-900 dark:text-white hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 transition"
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
