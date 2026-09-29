"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";
import { ProductCard } from "@/components/common/ProductCard";
import { DEFAULT_PRODUCTS } from "@/lib/products";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartOverviewPage() {
  const router = useRouter();
  const {
    cartItems,
    savedForLaterItems,
    subtotal,
    cartCount,
    productCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    saveForLater,
    moveToCart,
    removeFromSavedForLater,
  } = useCartContext();
  const { user } = useAuth();

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
  const originalSubtotal = Math.round((subtotal * 1.18) * 100) / 100;
  const savings = Math.max(50, Math.round((originalSubtotal - subtotal + discountAmount) * 100) / 100);

  // Free Shipping Threshold ($150 target)
  const FREE_SHIPPING_THRESHOLD = 150;
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Suggested Cross-Sell Items
  const crossSellProducts = DEFAULT_PRODUCTS.filter(
    (p) => !cartItems.some((ci) => ci.productSlug === p.slug)
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060b13] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* Top Navbar Header */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <Link href="/" className="hover:text-amber-500 transition flex items-center gap-1">
            <Icon name="Home" className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
          <span>&gt;</span>
          <span className="text-slate-900 dark:text-slate-200 font-extrabold">Shopping Cart</span>
        </div>

        {/* Page Title with Synchronized Product Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Cart ({productCount})
            </h1>
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500">
              {productCount} {productCount === 1 ? "Product" : "Products"} • {cartCount} {cartCount === 1 ? "Unit" : "Total Units"}
            </span>
          </div>
        </div>

        {/* Main Grid: Cart Items on Left + Bill Details Sticky Column on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.length === 0 ? (
              <div className="p-10 sm:p-14 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 text-center space-y-4 shadow-xs">
                <div className="h-16 w-16 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-400/30">
                  <Icon name="ShoppingCart" className="h-8 w-8 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                    You don&apos;t have any active items in your shopping cart right now.
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-block px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition"
                >
                  Explore Storefront Catalog
                </Link>
              </div>
            ) : (
              cartItems.map((item) => {
                const originalPrice = Math.round(item.price * 1.2 * 100) / 100;
                const discountPercent = Math.round(((originalPrice - item.price) / originalPrice) * 100);
                const itemSavedAmount = Math.round((originalPrice - item.price) * item.quantity * 100) / 100;

                return (
                  <div
                    key={item.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-4 transition hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                      
                      {/* Thumbnail & Quantity Stepper Below Image */}
                      <div className="flex flex-col items-center gap-3 shrink-0">
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800">
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
                              sizes="112px"
                            />
                          )}
                        </div>

                        {/* Quantity Stepper Pill (- 1 + with trash feedback on 1) */}
                        <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 gap-2.5">
                          <button
                            onClick={() => {
                              if (item.quantity === 1) {
                                removeFromCart(item.id);
                              } else {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            className="h-6 w-6 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs cursor-pointer"
                            title={item.quantity === 1 ? "Remove item from cart" : "Decrease quantity"}
                          >
                            {item.quantity === 1 ? (
                              <Icon name="Trash2" className="h-3.5 w-3.5 text-rose-500 hover:scale-110 transition" />
                            ) : (
                              "-"
                            )}
                          </button>
                          <span className="w-4 text-center text-xs font-black text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs cursor-pointer"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Product Details & Action Buttons */}
                      <div className="flex-1 min-w-0 space-y-2.5 w-full">
                        {/* Sold By Vendor Tag */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold">
                          <Icon name="Building2" className="h-3.5 w-3.5" />
                          <span>Sold by {item.vendor || "Health & Beauty Store"}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h3>

                        {/* Pricing Row */}
                        <div className="flex flex-wrap items-baseline gap-2 text-sm">
                          <span className="text-base font-black text-slate-900 dark:text-white">
                            ${item.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-slate-400 line-through font-semibold">
                            ${originalPrice.toFixed(2)}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                            {discountPercent}% off
                          </span>
                        </div>

                        {/* Instant Savings Text */}
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          You saved ${itemSavedAmount.toFixed(2)}
                        </p>

                        {/* Action Buttons Row: Saved for Later + Remove Item */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            onClick={() => saveForLater(item.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-amber-400/10 text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 text-xs font-extrabold border border-slate-200/90 dark:border-slate-700/80 hover:border-amber-300 dark:hover:border-amber-400/30 transition cursor-pointer group"
                          >
                            <Icon name="Bookmark" className="h-3.5 w-3.5 text-amber-500" />
                            <span>Saved for Later</span>
                          </button>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-extrabold border border-slate-200/90 dark:border-slate-700/80 hover:border-rose-200 dark:hover:border-rose-900/40 transition cursor-pointer group"
                          >
                            <Icon name="Trash2" className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                            <span>Remove Item</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Side: Bill Details Summary (4 cols - Sticky Column) */}
          <div className="lg:col-span-4 space-y-6 sticky top-28 self-start">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
              
              {/* Header with Clear Cart */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-base font-black text-slate-900 dark:text-white">Bill Details</h2>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs font-extrabold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
                  >
                    <Icon name="Trash2" className="h-3.5 w-3.5" />
                    <span>Clear Cart</span>
                  </button>
                )}
              </div>

              {/* Dynamic Free Shipping Progress Bar ($150 target) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-900 dark:text-white">
                  <span className="flex items-center gap-1.5">
                    <span>🚚</span>
                    <span>
                      {remainingForFreeShipping === 0
                        ? "Free Express Shipping Unlocked!"
                        : `Add $${remainingForFreeShipping.toFixed(2)} for FREE Shipping`}
                    </span>
                  </span>
                  <span className="text-amber-500 font-extrabold">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Total & Shipping Calculation */}
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Items Total</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-slate-400 line-through text-[11px]">${originalSubtotal.toFixed(2)}</span>
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Shipping Estimate</span>
                  <span className={remainingForFreeShipping === 0 ? "text-emerald-600 dark:text-emerald-400 font-extrabold" : "text-slate-900 dark:text-white font-bold"}>
                    {remainingForFreeShipping === 0 ? "FREE" : "$12.00"}
                  </span>
                </div>
              </div>

              {/* Total Amount Row */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 dark:text-white">Total Amount</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  ${(subtotal + (remainingForFreeShipping === 0 ? 0 : 12)).toFixed(2)}
                </span>
              </div>

              {/* Green Discount Banner */}
              <div className="p-3 rounded-2xl bg-[#ecfdf5] dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-extrabold text-[#059669] dark:text-emerald-400 flex items-center gap-2">
                <Icon name="Tag" className="h-4 w-4 text-[#059669] shrink-0" />
                <span>You saved ${savings.toFixed(2)} on this order!</span>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => {
                  if (user) {
                    router.push("/checkout");
                  } else {
                    router.push("/login?callbackUrl=/checkout");
                  }
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] active:scale-[0.99] text-slate-950 font-black text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.5]" />
              </button>

              {/* Trust Signals & Payment Provider Badges */}
              <div className="pt-2 text-center space-y-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Icon name="Lock" className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">100% Encrypted &amp; Secure Checkout</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 opacity-80">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">VISA</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Mastercard</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">AMEX</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">PayPal</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Apple Pay</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* SECTION 2: Saved for Later Section */}
        <div className="pt-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Icon name="Bookmark" className="h-5 w-5 text-amber-500" />
              <span>Saved for Later</span>
              <span className="text-xs font-bold text-slate-400">({savedForLaterItems.length})</span>
            </h2>
          </div>

          {savedForLaterItems.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs font-bold text-slate-400">No items saved for later</p>
              <p className="text-[11px] text-slate-400">
                You can save items from your cart to buy them in your next order.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {savedForLaterItems.map((sItem) => {
                const orig = Math.round(sItem.price * 1.15 * 100) / 100;
                return (
                  <div
                    key={sItem.id}
                    className="p-4 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3 relative group transition hover:border-slate-300 dark:hover:border-slate-700"
                  >
                    {/* Delete Icon Button on Top Right Corner of Card */}
                    <button
                      onClick={() => removeFromSavedForLater(sItem.id)}
                      className="absolute top-6 right-6 h-7 w-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-rose-500 flex items-center justify-center shadow-md hover:bg-rose-50 dark:hover:bg-rose-950 transition cursor-pointer z-10"
                      title="Remove from Saved for Later"
                    >
                      <Icon name="Trash2" className="h-3.5 w-3.5 text-rose-500" />
                    </button>

                    {/* Image */}
                    <div className="relative aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      {sItem.image.startsWith("data:") ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={sItem.image}
                          alt={sItem.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={sItem.image}
                          alt={sItem.title}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-1 min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 truncate">
                        Sold by {sItem.vendor || "John Enterprise"}
                      </p>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white line-clamp-1">
                        {sItem.title}
                      </h4>
                      {sItem.size && (
                        <p className="text-[10px] font-medium text-slate-400">
                          {sItem.size}
                        </p>
                      )}
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          ${sItem.price.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-slate-400 line-through font-semibold">
                          ${orig.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Move to Cart Full-width Amber Button */}
                    <button
                      onClick={() => moveToCart(sItem.id)}
                      className="w-full py-2.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-extrabold text-xs transition shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="ShoppingCart" className="h-4 w-4 stroke-[2.2]" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 3: Cross-Selling "You Might Also Like" Section */}
        <div className="pt-8 space-y-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span className="text-amber-500">🔥</span>
                <span>You Might Also Like</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Frequently bought together with items in your cart
              </p>
            </div>
            <Link href="/categories" className="text-xs font-bold text-sky-600 dark:text-amber-400 hover:underline">
              Explore All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {crossSellProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>

      </main>

      {/* Main Site Footer */}
      <SiteFooter />
    </div>
  );
}
