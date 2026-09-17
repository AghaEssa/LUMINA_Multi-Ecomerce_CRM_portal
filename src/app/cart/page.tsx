"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/common/AuthModal";

export default function CartOverviewPage() {
  const { cartItems, subtotal, removeFromCart, updateQuantity, clearCart } =
    useCartContext();
  const { openAuthModal } = useAuth();

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percentage: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const code = couponCode.trim().toUpperCase();
    if (code === "LUMINA10") {
      setAppliedDiscount({ code: "LUMINA10", percentage: 10 });
    } else if (code === "SUMMER20") {
      setAppliedDiscount({ code: "SUMMER20", percentage: 20 });
    } else {
      setCouponError("Invalid coupon code. Try LUMINA10 or SUMMER20");
    }
  };

  const discountAmount = appliedDiscount
    ? (subtotal * appliedDiscount.percentage) / 100
    : 0;
  const estimatedTax = (subtotal - discountAmount) * 0.05;
  const finalTotal = Math.max(0, subtotal - discountAmount + estimatedTax);

  // Group items by category for full overview
  const categories = Array.from(
    new Set(cartItems.map((i) => i.categoryName || "General"))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Main Navbar Header */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb & Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Link href="/" className="hover:text-ocean-700 dark:hover:text-amber-400 transition">
                Storefront
              </Link>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200">Full Cart Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Shopping Cart Details
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs transition"
            >
              <Icon name="ArrowLeft" className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Link>

            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-rose-50 dark:bg-rose-950/30 px-3.5 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition"
              >
                <Icon name="Trash2" className="h-3.5 w-3.5" />
                <span>Clear Cart</span>
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-12 text-center max-w-md mx-auto space-y-5 shadow-sm">
            <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <Icon name="ShoppingCart" className="h-12 w-12 text-slate-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You haven&apos;t added any items to your shopping cart yet. Browse our curated multi-category catalog!
              </p>
            </div>
            <Link
              href="/"
              className="inline-block rounded-xl bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950 px-8 py-3 text-xs font-extrabold shadow-md hover:bg-slate-800 dark:hover:bg-amber-300 transition"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          /* Active Cart Grid System & Order Summary */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Categorized Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-xs font-extrabold text-slate-400 shrink-0">Filter:</span>
                <span className="bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
                  All ({cartItems.length})
                </span>
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold px-3 py-1 rounded-full"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Items Card Table */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-6 space-y-4">
                  {cartItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition ${
                        idx !== 0 ? "mt-3" : ""
                      }`}
                    >
                      {/* Left: Image & Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shrink-0">
                          {item.image.startsWith("data:") ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          )}
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-ocean-700 dark:text-amber-400 bg-ocean-50 dark:bg-amber-400/10 px-2 py-0.5 rounded-md border border-ocean-200 dark:border-amber-400/20">
                            {item.categoryName || "General"}
                          </span>
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 font-semibold">
                              <Icon name="Building2" className="h-3 w-3" />
                              {item.vendor || "John Enterprise"}
                            </span>
                            {item.size && (
                              <span className="font-bold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                                Size: {item.size}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Price & Stepper */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                        {/* Unit & Subtotal */}
                        <div className="text-left sm:text-right">
                          <div className="text-base font-black text-slate-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-[10px] font-semibold text-slate-400">
                            ${item.price.toFixed(2)} / item
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-black text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-2 rounded-xl transition"
                          title="Remove item"
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guarantees Footer Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <Icon name="ShieldCheck" className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">100% Authentic</h4>
                    <p className="text-[10px] text-slate-400">Direct from official vendors</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    <Icon name="Truck" className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">Express 24h Dispatch</h4>
                    <p className="text-[10px] text-slate-400">Tracked priority delivery</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
                    <Icon name="RotateCcw" className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">30-Day Easy Returns</h4>
                    <p className="text-[10px] text-slate-400">No questions asked policy</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Coupon Code & Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Promo Coupon Card */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Tag" className="h-4 w-4 text-amber-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                    Apply Promo Code
                  </h3>
                </div>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Try LUMINA10"
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white uppercase placeholder:normal-case focus:outline-hidden focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 transition"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <p className="text-[11px] font-bold text-rose-500">{couponError}</p>
                )}

                {appliedDiscount && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                      🎉 {appliedDiscount.code} ({appliedDiscount.percentage}% OFF)
                    </span>
                    <button
                      onClick={() => setAppliedDiscount(null)}
                      className="text-emerald-700 dark:text-emerald-400 font-black hover:underline text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5 shadow-md">
                <h3 className="text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-extrabold">
                      <span>Discount ({appliedDiscount.percentage}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE Express</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-semibold">
                    <span>Estimated Tax (5%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">${estimatedTax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-black text-slate-900 dark:text-white">Grand Total</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-amber-300">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openAuthModal("login")}
                  className="w-full rounded-2xl bg-[#ffb800] hover:bg-[#f5b000] active:scale-[0.99] py-4 px-6 text-center font-extrabold text-slate-950 text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Login to Checkout</span>
                  <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.2]" />
                </button>
              </div>

            </div>

          </div>
        )}
      </main>

      {/* Site Main Footer */}
      <SiteFooter />

      {/* Auth Modal for Login to Checkout */}
      <AuthModal />
    </div>
  );
}

