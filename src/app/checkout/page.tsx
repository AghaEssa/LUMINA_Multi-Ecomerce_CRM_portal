"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { StockReservationTimer } from "@/components/checkout/StockReservationTimer";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { cartItems, subtotal, clearCart } = useCartContext();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cod">("card");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [user, isAuthLoading, router]);

  const estimatedTax = subtotal * 0.05;
  const shippingFee = subtotal > 100 ? 0 : 9.99;
  const grandTotal = subtotal + estimatedTax + (cartItems.length > 0 ? shippingFee : 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate order placement delay
    setTimeout(() => {
      const generatedOrderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(generatedOrderId);
      setOrderComplete(true);
      setIsSubmitting(false);
      clearCart();
    }, 1500);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Checking Auth Status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Breadcrumb & Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Link href="/" className="hover:text-amber-400 transition">Storefront</Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-amber-400 transition">Cart</Link>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200">Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Secure Order Checkout
            </h1>
          </div>
        </div>

        {orderComplete ? (
          /* Order Confirmation Screen */
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-xl animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
              <Icon name="Check" className="h-10 w-10 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Payment Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Thank You for Your Order!
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Your order <span className="font-extrabold text-slate-900 dark:text-white">{orderId}</span> has been successfully placed. We&apos;ve sent a confirmation email to <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-left">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping To:</span>
                <span className="font-bold text-slate-900 dark:text-white">{fullName}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Address:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{address}, {city}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Total Charged:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-300 dark:text-slate-950 text-white font-extrabold text-xs px-6 py-3.5 shadow transition"
              >
                Back to Storefront
              </Link>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart Alert */
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center max-w-md mx-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your cart is empty</h3>
            <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-slate-950 text-white dark:bg-amber-400 dark:text-slate-950 px-6 py-3 text-xs font-bold shadow"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <StockReservationTimer />

            {/* Main Checkout Form & Order Summary Grid */}
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Shipping & Payment Forms (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Address Box */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                    1
                  </div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Shipping & Delivery Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Street Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main Street, Suite 4B"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="New York"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Postal / ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="10001"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-400 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Box */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                    2
                  </div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Payment Method
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-amber-400 bg-amber-400/10 text-slate-900 dark:text-white shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Icon name="CreditCard" className="h-6 w-6 text-amber-500" />
                    <div>
                      <p className="text-xs font-black">Credit / Debit Card</p>
                      <p className="text-[10px] text-slate-400">Visa, Mastercard, Amex</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                      paymentMethod === "paypal"
                        ? "border-amber-400 bg-amber-400/10 text-slate-900 dark:text-white shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="text-lg">🅿️</span>
                    <div>
                      <p className="text-xs font-black">PayPal Express</p>
                      <p className="text-[10px] text-slate-400">Fast digital wallet</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between space-y-2 cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-amber-400 bg-amber-400/10 text-slate-900 dark:text-white shadow-xs"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Icon name="Truck" className="h-6 w-6 text-emerald-500" />
                    <div>
                      <p className="text-xs font-black">Cash on Delivery</p>
                      <p className="text-[10px] text-slate-400">Pay when delivered</p>
                    </div>
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                    <input
                      type="text"
                      placeholder="Card Number (4532 •••• •••• 8892)"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary Box (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-lg">
                <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                  Order Items ({cartItems.length} {cartItems.length === 1 ? "Product" : "Products"}{cartItems.reduce((acc, i) => acc + i.quantity, 0) > cartItems.length ? ` • ${cartItems.reduce((acc, i) => acc + i.quantity, 0)} Units` : ""})
                </h3>

                {/* Items Summary List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                          {item.image.startsWith("data:") ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                          ) : (
                            <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-extrabold text-slate-900 dark:text-white truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-400">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Calculation Breakdown */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>Estimated Tax (5%)</span>
                    <span className="font-bold text-slate-900 dark:text-white">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-black text-slate-900 dark:text-white">Total Amount</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-amber-300">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full rounded-2xl bg-[#ffb800] hover:bg-[#f5b000] active:scale-[0.99] py-4 px-6 text-center font-extrabold text-slate-950 text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Processing Order...
                    </span>
                  ) : (
                    <>
                      <span>Complete & Pay ${grandTotal.toFixed(2)}</span>
                      <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.2]" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
