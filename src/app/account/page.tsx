"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCartContext } from "@/context/CartContext";
import { Security2FAModal } from "@/components/common/Security2FAModal";

export default function UserAccountPage() {
  const router = useRouter();
  const { user, isLoading, logout, checkAuth, openSecurityModal } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount, productCount } = useCartContext();

  const [name, setName] = useState(user?.name || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?callbackUrl=/account");
    }
  }, [user, isLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsUpdating(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error?.message || "Failed to update profile name.");
        return;
      }

      await checkAuth();
      setSuccessMsg("Profile display name updated successfully!");
    } catch {
      setErrorMsg("Network connection error. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading Account Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition">Storefront</Link>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200">Account Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Customer Account Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition"
            >
              <Icon name="ArrowLeft" className="h-4 w-4" />
              <span>Back to Storefront</span>
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50 dark:bg-rose-950/30 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition cursor-pointer"
            >
              <Icon name="X" className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* User Banner Header Card */}
        <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[#0b3328] border-2 border-emerald-500/50 text-[#10b981] font-black text-2xl sm:text-3xl flex items-center justify-center shadow-inner shrink-0">
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {user.name || user.email.split("@")[0]}
                </h2>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-0.5 border border-emerald-200 dark:border-emerald-800 uppercase tracking-wider">
                  {user.role} Account
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
              <p className="text-[11px] text-slate-400">
                Member since: <span className="font-bold text-slate-700 dark:text-slate-300">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "2026"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security</p>
              <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <span>🛡️</span>
                <span>{user.isTwoFactorEnabled ? "2FA Active" : "2FA Off"}</span>
              </p>
            </div>

            <div className="flex-1 sm:flex-none p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cart Items</p>
              <p className="text-xs font-black text-amber-500">{productCount} Products ({cartCount})</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Account Details Form & 2FA Security (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Edit Profile Form */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Icon name="User" className="h-5 w-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Personal Information
                </h3>
              </div>

              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-extrabold text-rose-700 dark:text-rose-300">
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Full / Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700 dark:text-slate-300">Email Address (Primary)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-500 dark:text-slate-400 font-medium opacity-80 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-slate-400">Email cannot be changed directly for security reasons.</p>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 text-white font-extrabold text-xs px-6 py-3 shadow transition disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? "Saving..." : "Save Profile Details"}
                </button>
              </form>
            </div>

            {/* Security & 2FA Settings Card */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Icon name="Lock" className="h-5 w-5 text-amber-500" />
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Two-Factor Authentication (2FA)
                  </h3>
                </div>

                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  user.isTwoFactorEnabled
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800"
                    : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                }`}>
                  {user.isTwoFactorEnabled ? "Active" : "Disabled"}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Protect your account with Google Authenticator or 2FA apps. Each login will require a 6-digit verification code.
              </p>

              <button
                onClick={openSecurityModal}
                className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 py-3 px-5 text-xs font-extrabold text-slate-900 dark:text-white shadow-xs transition cursor-pointer flex items-center gap-2"
              >
                <span>⚙️ Manage 2FA Security Settings</span>
              </button>
            </div>

          </div>

          {/* Right Column: Shopping Quick Links & Account Shortcuts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-lg">
              <h3 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                Shopping Shortcuts
              </h3>

              <div className="space-y-3">
                <Link
                  href="/cart"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-slate-950">
                      <Icon name="ShoppingCart" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">Shopping Cart</p>
                      <p className="text-[10px] text-slate-400">{productCount} Products ({cartCount} Items)</p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" className="h-4 w-4 text-slate-400" />
                </Link>

                <Link
                  href="/checkout"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-amber-400 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white">
                      <Icon name="CreditCard" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">Proceed to Checkout</p>
                      <p className="text-[10px] text-slate-400">Complete pending order</p>
                    </div>
                  </div>
                  <Icon name="ChevronRight" className="h-4 w-4 text-slate-400" />
                </Link>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500 text-white">
                      <span className="text-sm">❤️</span>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white">Saved Wishlist</p>
                      <p className="text-[10px] text-slate-400">{wishlistCount} Saved Products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <SiteFooter />
      <Security2FAModal />
    </div>
  );
}
