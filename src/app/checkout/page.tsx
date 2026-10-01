"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { StockReservationTimer, resetStockReservationStorage } from "@/components/checkout/StockReservationTimer";

// Removed hardcoded SAMPLE_ADDRESSES

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { cartItems, subtotal, clearCart } = useCartContext();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cod">("card");
  
  // Form Field States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country] = useState("United States");

  // Track touched fields for real-time visual validation feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [isLocating, setIsLocating] = useState(false);

  // Processing & Modal States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderError, setOrderError] = useState<string | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);

  // Clean up stock reservation when user navigates away using browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      resetStockReservationStorage();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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

  const fetchAddressFromCoordinates = async (lat: number, lon: number) => {
    setIsLocating(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
        headers: { "Accept-Language": "en" }
      });
      const data = await res.json();
      
      if (data && data.address) {
        const road = data.address.road || data.address.pedestrian || "";
        const houseNumber = data.address.house_number || "";
        const suburb = data.address.suburb || data.address.neighbourhood || "";
        
        let streetAddress = "";
        if (road) streetAddress += road;
        if (houseNumber) streetAddress = `${houseNumber} ${streetAddress}`;
        if (suburb && !streetAddress) streetAddress = suburb;
        else if (suburb) streetAddress += `, ${suburb}`;

        const fetchedCity = data.address.city || data.address.town || data.address.village || "";
        const fetchedPostal = data.address.postcode || "";

        if (streetAddress) {
          setAddress(streetAddress);
          setTouched((prev) => ({ ...prev, address: true }));
        } else if (data.display_name) {
          setAddress(data.display_name.split(",")[0]);
          setTouched((prev) => ({ ...prev, address: true }));
        }
        
        if (fetchedCity) {
          setCity(fetchedCity);
          setTouched((prev) => ({ ...prev, city: true }));
        }
        if (fetchedPostal) {
          setPostalCode(fetchedPostal);
          setTouched((prev) => ({ ...prev, postalCode: true }));
        }
      }
    } catch (error) {
      console.error("Reverse geocoding failed", error);
    } finally {
      setIsLocating(false);
    }
  };

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation error:", error.message);
          setIsLocating(false);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      console.warn("Geolocation is not supported by your browser.");
    }
  };



  const handleAddressChange = (val: string) => {
    setAddress(val);
    setTouched((prev) => ({ ...prev, address: true }));
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Form Field Validation Logic
  const errors = {
    fullName: !fullName.trim()
      ? "Full name is required"
      : fullName.trim().length < 2
      ? "Name must be at least 2 characters"
      : null,
    email: !email.trim()
      ? "Email address is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ? "Please enter a valid email address (e.g. user@example.com)"
      : null,
    phone: !phone.trim()
      ? "Phone number is required"
      : phone.trim().length < 7
      ? "Please enter a valid phone number"
      : null,
    address: !address.trim()
      ? "Street address is required"
      : address.trim().length < 5
      ? "Please enter a complete street address"
      : null,
    city: !city.trim()
      ? "City is required"
      : city.trim().length < 2
      ? "Please enter a valid city"
      : null,
    postalCode: !postalCode.trim()
      ? "Postal / ZIP code is required"
      : postalCode.trim().length < 3
      ? "Please enter a valid ZIP/Postal code"
      : null,
  };

  const isFormValid = !Object.values(errors).some((err) => err !== null);

  const estimatedTax = subtotal * 0.05;
  const shippingFee = subtotal > 100 ? 0 : 9.99;
  const grandTotal = subtotal + estimatedTax + (cartItems.length > 0 ? shippingFee : 0);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    // Mark all fields as touched to display errors if any
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      postalCode: true,
    });

    if (!isFormValid) {
      setOrderError("Please fix the errors in your shipping details before completing payment.");
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      const payload = {
        fullName,
        email,
        phone,
        address,
        city,
        postalCode,
        country,
        paymentMethod,
        items: cartItems,
        subtotal,
        estimatedTax,
        shippingFee,
        grandTotal,
        userId: user?.email || null,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.orderId) {
        setOrderId(data.orderId);
        setOrderComplete(true);
        resetStockReservationStorage();
        clearCart();
      } else {
        setOrderError(data.error?.message || "Order creation failed on backend server. Please try again.");
      }
    } catch (err) {
      console.error("Order processing error:", err);
      setOrderError("Network connection error. Please verify your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmReturnToCart = () => {
    resetStockReservationStorage();
    router.push("/cart");
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
      <Header onReturnToCart={() => setShowReturnModal(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Distraction-Free Header Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <button
                type="button"
                onClick={() => setShowReturnModal(true)}
                className="hover:text-amber-400 transition underline cursor-pointer"
              >
                Shopping Cart
              </button>
              <span>/</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">Secure Express Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span> Order Checkout</span>
            </h1>
          </div>
        </div>

        {orderError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2 shadow-xs animate-shake">
            <Icon name="AlertCircle" className="h-5 w-5 shrink-0 text-rose-500" />
            <span>{orderError}</span>
          </div>
        )}

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
            {/* Real-time Inventory Reservation Lock Timer */}
            <StockReservationTimer onExpire={() => setShowExpiredModal(true)} />

            {/* Main Checkout Form & Order Summary Grid */}
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Shipping & Payment Forms (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Address Box with Real-Time Validation & Autocomplete */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                    1
                  </div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    Shipping &amp; Delivery Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Full Name */}
                  <div className="sm:col-span-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                      {touched.fullName && !errors.fullName && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Icon name="Check" className="h-3 w-3 stroke-[3]" /> Valid
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onBlur={() => markTouched("fullName")}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          markTouched("fullName");
                        }}
                        placeholder="John Doe"
                        className={`w-full rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden font-medium transition ${
                          touched.fullName
                            ? errors.fullName
                              ? "border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500"
                              : "border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 focus:border-emerald-500"
                            : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {touched.fullName && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {errors.fullName ? (
                            <Icon name="AlertCircle" className="h-4 w-4 text-rose-500" />
                          ) : (
                            <Icon name="Check" className="h-4 w-4 text-emerald-500 stroke-[3]" />
                          )}
                        </div>
                      )}
                    </div>
                    {touched.fullName && errors.fullName && (
                      <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 pt-0.5">
                        <Icon name="AlertCircle" className="h-3 w-3" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onBlur={() => markTouched("email")}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          markTouched("email");
                        }}
                        placeholder="john@example.com"
                        className={`w-full rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden font-medium transition ${
                          touched.email
                            ? errors.email
                              ? "border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500"
                              : "border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 focus:border-emerald-500"
                            : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {touched.email && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {errors.email ? (
                            <Icon name="AlertCircle" className="h-4 w-4 text-rose-500" />
                          ) : (
                            <Icon name="Check" className="h-4 w-4 text-emerald-500 stroke-[3]" />
                          )}
                        </div>
                      )}
                    </div>
                    {touched.email && errors.email && (
                      <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 pt-0.5">
                        <Icon name="AlertCircle" className="h-3 w-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">Phone Number</label>
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onBlur={() => markTouched("phone")}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          markTouched("phone");
                        }}
                        placeholder="+1 (555) 000-0000"
                        className={`w-full rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden font-medium transition ${
                          touched.phone
                            ? errors.phone
                              ? "border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500"
                              : "border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 focus:border-emerald-500"
                            : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {touched.phone && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {errors.phone ? (
                            <Icon name="AlertCircle" className="h-4 w-4 text-rose-500" />
                          ) : (
                            <Icon name="Check" className="h-4 w-4 text-emerald-500 stroke-[3]" />
                          )}
                        </div>
                      )}
                    </div>
                    {touched.phone && errors.phone && (
                      <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 pt-0.5">
                        <Icon name="AlertCircle" className="h-3 w-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Street Address with Location Fetch */}
                  <div className="sm:col-span-2 space-y-1 relative">
                    <div className="flex justify-between items-center">
                      <label className="block font-bold text-slate-700 dark:text-slate-300">Street Address</label>
                      <button 
                        type="button" 
                        onClick={requestLocation}
                        disabled={isLocating}
                        className="text-[10px] bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1 px-2 py-1 rounded cursor-pointer transition disabled:opacity-50"
                      >
                        {isLocating ? (
                          <>
                            <div className="h-3 w-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                            Locating...
                          </>
                        ) : (
                          <>
                            <Icon name="MapPin" className="h-3 w-3" />
                            Use Current Location
                          </>
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={address}
                        onBlur={() => markTouched("address")}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        placeholder="Start typing your street address..."
                        className={`w-full rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden font-medium transition ${
                          touched.address
                            ? errors.address
                              ? "border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500"
                              : "border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 focus:border-emerald-500"
                            : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {touched.address && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {errors.address ? (
                            <Icon name="AlertCircle" className="h-4 w-4 text-rose-500" />
                          ) : (
                            <Icon name="Check" className="h-4 w-4 text-emerald-500 stroke-[3]" />
                          )}
                        </div>
                      )}
                    </div>

                    {touched.address && errors.address && (
                      <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 pt-0.5">
                        <Icon name="AlertCircle" className="h-3 w-3" /> {errors.address}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">City</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={city}
                        onBlur={() => markTouched("city")}
                        onChange={(e) => {
                          setCity(e.target.value);
                          markTouched("city");
                        }}
                        placeholder="New York"
                        className={`w-full rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden font-medium transition ${
                          touched.city
                            ? errors.city
                              ? "border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500"
                              : "border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 focus:border-emerald-500"
                            : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {touched.city && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {errors.city ? (
                            <Icon name="AlertCircle" className="h-4 w-4 text-rose-500" />
                          ) : (
                            <Icon name="Check" className="h-4 w-4 text-emerald-500 stroke-[3]" />
                          )}
                        </div>
                      )}
                    </div>
                    {touched.city && errors.city && (
                      <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 pt-0.5">
                        <Icon name="AlertCircle" className="h-3 w-3" /> {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Postal / ZIP Code */}
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700 dark:text-slate-300">Postal / ZIP Code</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onBlur={() => markTouched("postalCode")}
                        onChange={(e) => {
                          setPostalCode(e.target.value);
                          markTouched("postalCode");
                        }}
                        placeholder="10001"
                        className={`w-full rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-hidden font-medium transition ${
                          touched.postalCode
                            ? errors.postalCode
                              ? "border-2 border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 focus:border-rose-500"
                              : "border-2 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 focus:border-emerald-500"
                            : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-400"
                        }`}
                      />
                      {touched.postalCode && (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                          {errors.postalCode ? (
                            <Icon name="AlertCircle" className="h-4 w-4 text-rose-500" />
                          ) : (
                            <Icon name="Check" className="h-4 w-4 text-emerald-500 stroke-[3]" />
                          )}
                        </div>
                      )}
                    </div>
                    {touched.postalCode && errors.postalCode && (
                      <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1 pt-0.5">
                        <Icon name="AlertCircle" className="h-3 w-3" /> {errors.postalCode}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* Payment Method Box with Dramatic Active Selection Highlights */}
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                      2
                    </div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                      Payment Method
                    </h2>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Icon name="ShieldCheck" className="h-3.5 w-3.5 stroke-[2.5]" /> Encrypted Payment
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Credit Card Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`relative p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between space-y-3 cursor-pointer ${
                      paymentMethod === "card"
                        ? "border-amber-400 dark:border-amber-400 bg-amber-400/10 dark:bg-amber-400/15 text-slate-900 dark:text-white shadow-md scale-[1.02]"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {paymentMethod === "card" && (
                      <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
                        <Icon name="Check" className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                    <Icon name="CreditCard" className="h-6 w-6 text-amber-500" />
                    <div>
                      <p className="text-xs font-black">Credit / Debit Card</p>
                      <p className="text-[10px] text-slate-400 font-medium">Visa, Mastercard, Amex</p>
                    </div>
                  </button>

                  {/* PayPal Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`relative p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between space-y-3 cursor-pointer ${
                      paymentMethod === "paypal"
                        ? "border-amber-400 dark:border-amber-400 bg-amber-400/10 dark:bg-amber-400/15 text-slate-900 dark:text-white shadow-md scale-[1.02]"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {paymentMethod === "paypal" && (
                      <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
                        <Icon name="Check" className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                    <span className="text-xl">🅿️</span>
                    <div>
                      <p className="text-xs font-black">PayPal Express</p>
                      <p className="text-[10px] text-slate-400 font-medium">Fast digital wallet</p>
                    </div>
                  </button>

                  {/* Cash on Delivery Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`relative p-4 rounded-2xl border-2 text-left transition flex flex-col justify-between space-y-3 cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-amber-400 dark:border-amber-400 bg-amber-400/10 dark:bg-amber-400/15 text-slate-900 dark:text-white shadow-md scale-[1.02]"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {paymentMethod === "cod" && (
                      <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
                        <Icon name="Check" className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                    <Icon name="Truck" className="h-6 w-6 text-emerald-500" />
                    <div>
                      <p className="text-xs font-black">Cash on Delivery</p>
                      <p className="text-[10px] text-slate-400 font-medium">Pay when delivered</p>
                    </div>
                  </button>
                </div>

                {paymentMethod === "card" && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 text-xs animate-fade-in">
                    <input
                      type="text"
                      placeholder="Card Number (4532 •••• •••• 8892)"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-hidden font-medium"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-hidden font-medium"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-hidden font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Sticky Order Summary Box (5 cols, Sticky Pinning top-28) */}
            <div className="lg:col-span-5 sticky top-28 self-start space-y-6">
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
                <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                  Order Items ({cartItems.length} {cartItems.length === 1 ? "Product" : "Products"}{cartItems.reduce((acc, i) => acc + i.quantity, 0) > cartItems.length ? ` • ${cartItems.reduce((acc, i) => acc + i.quantity, 0)} Units` : ""})
                </h3>

                {/* Items Summary List */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
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

                {/* Submit Order Button with Loading Spinner & Double-Charge Protection */}
                <button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="w-full rounded-2xl bg-[#ffb800] hover:bg-[#f5b000] active:scale-[0.99] py-4 px-6 text-center font-extrabold text-slate-950 text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Processing Payment &amp; Locking Order...</span>
                    </span>
                  ) : (
                    <>
                      <span>Complete &amp; Pay ${grandTotal.toFixed(2)}</span>
                      <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.2]" />
                    </>
                  )}
                </button>

                {/* Trust Badges under CTA */}
                <div className="pt-2 text-center space-y-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-slate-500 dark:text-slate-400">
                    <Icon name="Lock" className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
                    <span>Guaranteed 100% Encrypted &amp; Safe Checkout</span>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>
        )}

        {/* Return to Cart Confirmation Warning Modal */}
        {showReturnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Icon name="AlertTriangle" className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Leave Checkout?
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Your progress will be saved</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Leaving checkout will release your inventory lock. High demand items may run out of stock.
              </p>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-extrabold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Stay on Checkout
                </button>
                <button
                  type="button"
                  onClick={confirmReturnToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow transition cursor-pointer"
                >
                  Leave &amp; Return
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Session Inventory Lock Expired Pop-Up Modal */}
        {showExpiredModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#111827] rounded-3xl border border-rose-200 dark:border-rose-900/60 p-6 sm:p-8 max-w-md w-full text-center space-y-5 shadow-2xl">
              <div className="h-16 w-16 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-500 flex items-center justify-center mx-auto">
                <Icon name="Clock" className="h-8 w-8 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Inventory Lock Expired
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Your 15-minute stock reservation timer reached 00:00. Cart items have been released to ensure fair availability for all customers.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={confirmReturnToCart}
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition cursor-pointer"
                >
                  Return to Shopping Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
