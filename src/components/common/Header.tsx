"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@/components/common/Icons";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { DEFAULT_CATEGORIES, type CategoryItem } from "@/lib/categories";
import { DEFAULT_PRODUCTS, type ProductItem } from "@/lib/products";
import { useCartContext } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LuminaLogo } from "@/components/common/LuminaLogo";

type HeaderProps = {
  cartCount?: number;
  onOpenSearch?: () => void;
  category?: CategoryItem;
  activeNav?: "storefront" | "sections" | "trending" | "brands" | "all";
  onNavClick?: (key: "storefront" | "sections" | "trending" | "brands") => void;
  onReturnToCart?: () => void;
};

export function Header({
  onOpenSearch,
  category,
  activeNav = "storefront",
  onNavClick,
  onReturnToCart,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { productCount, openCart } = useCartContext();
  const { openWishlist, wishlistCount } = useWishlist();

  // Close search suggestions & mega menu on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchFocused(false);
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Live Auto-Complete Suggestions with Product Thumbnails
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return DEFAULT_PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.categorySlug.toLowerCase().includes(q) ||
        p.subCategory?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery]);

  const handleSelectSuggestion = (product: ProductItem) => {
    setSearchQuery("");
    setSearchFocused(false);
    router.push(`/product/${product.slug}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#0ea5e9] dark:from-[#082f49] dark:via-[#0c4a6e] dark:to-[#0f172a] text-white shadow-xl border-b border-white/10 dark:border-slate-800 backdrop-blur-md transition-all duration-300">
      
      {/* Topmost Desktop Utility Bar */}
      <div className="bg-transparent text-white/90 text-[11px] font-medium border-b border-white/10 py-1.5 hidden sm:block">
        <div className="mx-auto flex max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-10">
          {isCheckout ? (
            <div className="mx-auto flex items-center gap-2 text-xs font-bold text-amber-300">
              <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-400 stroke-[2.5]" />
              <span>256-Bit SSL Encryption • Bank-Grade Security • Guaranteed Safe &amp; Secure Checkout</span>
            </div>
          ) : (
            <>
              {/* Left Side: Language Switcher & Phone Support Link */}
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <a
                  href="tel:+923184095736"
                  className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer border border-white/20"
                  title="Call +92 318 4095736"
                >
                  <svg className="h-3 w-3 text-white fill-none stroke-current stroke-[2.2]" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.332-5.123-3.63-6.455-6.455l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="tracking-tight">+92 318 4095736</span>
                </a>
              </div>

              {/* Center: Flash Deal Announcement */}
              <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-amber-300">
                <span className="rounded-full bg-amber-400 text-slate-950 px-2 py-0.5 text-[9px] font-black uppercase">FLASH DEAL</span>
                <span>Get 10% OFF Your First Order with Code: LUMINA10</span>
              </div>

              {/* Right Side: Follow Us & Social Icons */}
              <div className="flex items-center gap-4">
                <span className="text-white/90 font-bold text-[11px]">{t("Follow Us")}</span>
                <div className="flex items-center gap-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="grid h-6 w-6 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition hover:scale-110" title="Facebook">
                    <svg className="h-3.5 w-3.5 text-[#1877F2] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="grid h-6 w-6 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition hover:scale-110" title="Instagram">
                    <svg className="h-3.5 w-3.5 text-[#E4405F] fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Navbar Bar (Spacious Layout for Desktop) */}
      <div className="mx-auto flex h-20 max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-10 gap-6 lg:gap-10">

        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            onClick={(e) => {
              if (isCheckout && onReturnToCart) {
                e.preventDefault();
                onReturnToCart();
              }
            }}
            className="group flex items-center transition hover:opacity-90"
            title="Lumina Main Storefront"
          >
            <LuminaLogo layout="horizontal" size="md" textColor="text-white" />
          </Link>
        </div>

        {/* Dynamic Desktop Header Search Bar or Secure Checkout Lock Badge */}
        {isCheckout ? (
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-extrabold text-xs shadow-inner">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-slate-950 shadow-sm">
              <Icon name="Lock" className="h-3.5 w-3.5 stroke-[3]" />
            </div>
            
          </div>
        ) : (
          <div ref={searchRef} className="hidden md:block flex-1 max-w-md lg:max-w-xl xl:max-w-2xl min-w-[280px] xl:min-w-[420px] relative z-30">
            <div className="relative">
              <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder="Search 8 categories, top brands & items..."
                className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 pl-11 pr-10 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white shadow-md transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <Icon name="X" className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Live Auto-Complete Suggestions Dropdown Panel */}
            {searchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 space-y-1.5 z-50 animate-fade-in min-w-[440px] lg:w-full">
                <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <span>Matching Products ({searchSuggestions.length})</span>
                  <span className="text-amber-500 font-bold">Live Search</span>
                </div>
                {searchSuggestions.map((prod) => (
                  <div
                    key={prod.slug}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectSuggestion(prod);
                    }}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800/90 transition cursor-pointer border border-transparent hover:border-sky-100 dark:hover:border-slate-700 group"
                  >
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs group-hover:scale-105 transition-transform">
                      <Image src={prod.image} alt={prod.title} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-amber-400 transition truncate">
                        {prod.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{prod.brand}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded capitalize">{prod.categorySlug}</span>
                        <span className="text-xs font-black text-amber-500 ml-auto">${prod.price}</span>
                      </div>
                    </div>
                    <Icon name="ChevronRight" className="h-4 w-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Desktop Navigation Links (Well Spaced) + Mega-Menu Trigger */}
        {!isCheckout ? (
          <nav className="hidden lg:flex items-center gap-7 lg:gap-9 text-sm font-extrabold text-white relative">
            <Link href="/" className="relative py-1 transition hover:text-amber-200 group flex items-center gap-1 font-extrabold tracking-wide">
              <span>Home</span>
            </Link>

            {/* Categories Mega-Menu Trigger */}
            <div ref={megaMenuRef} className="relative group">
              <button
                onClick={() => setMegaMenuOpen((prev) => !prev)}
                onMouseEnter={() => setMegaMenuOpen(true)}
                className="relative py-1 transition hover:text-amber-200 flex items-center gap-1.5 font-extrabold tracking-wide cursor-pointer"
              >
                <span>Categories Mega Menu</span>
                <Icon name="ChevronDown" className={`h-4 w-4 transition-transform duration-200 ${megaMenuOpen ? "rotate-180 text-amber-300" : ""}`} />
              </button>

              {/* Mega-Menu Panel for 8 Main Categories */}
              {megaMenuOpen && (
                <div
                  onMouseLeave={() => setMegaMenuOpen(false)}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] rounded-3xl bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-900 dark:text-white z-50 animate-fade-in grid grid-cols-12 gap-6"
                >
                  {/* Left Column: 8 Category Grid */}
                  <div className="col-span-8 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Explore 8 Departments
                      </span>
                      <Link href="/categories" onClick={() => setMegaMenuOpen(false)} className="text-xs font-bold text-sky-600 dark:text-amber-400 hover:underline">
                        View All Categories →
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          onClick={() => setMegaMenuOpen(false)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 transition group/cat"
                        >
                          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0284c7] text-white shadow-sm shrink-0 group-hover/cat:scale-110 transition-transform">
                            <Icon name={cat.icon} className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-slate-900 dark:text-white group-hover/cat:text-sky-600 dark:group-hover/cat:text-amber-400 transition truncate">
                              {cat.name}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400 truncate">
                              {cat.itemCount ? `${cat.itemCount.toLocaleString()} items` : "Collection"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Trending Featured Box */}
                  <div className="col-span-4 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 dark:from-slate-800 dark:to-slate-900 p-4 text-white flex flex-col justify-between relative overflow-hidden border border-white/20">
                    <div className="space-y-2 z-10">
                      <span className="rounded-full bg-amber-400 text-slate-950 px-2.5 py-0.5 text-[9px] font-black uppercase">
                        TRENDING NOW
                      </span>
                      <h4 className="text-sm font-black leading-tight">
                        LUMINA Luxury Collections
                      </h4>
                      <p className="text-[11px] text-sky-100 font-medium">
                        Up to 50% Off Top Brands &amp; Free Express Shipping.
                      </p>
                    </div>

                    <Link
                      href="/category/clothes"
                      onClick={() => setMegaMenuOpen(false)}
                      className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-2 text-xs font-black shadow transition z-10"
                    >
                      <span>Shop Deals</span>
                      <Icon name="ArrowRight" className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                </div>
              )}
            </div>

            <Link href="#trending" className="relative py-1 transition hover:text-amber-200 font-extrabold tracking-wide">
              <span>Trending</span>
            </Link>
            <Link href="#brands" className="relative py-1 transition hover:text-amber-200 font-extrabold tracking-wide">
              <span>Brands</span>
            </Link>
          </nav>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/15">
              Checkout Mode
            </span>
          </div>
        )}

        {/* Action Controls (Generous Spacing): Wishlist, Orders, Account, Cart Drawer */}
        <div className="hidden lg:flex items-center gap-4 lg:gap-6 text-white">
          {!isCheckout && (
            <button
              onClick={openWishlist}
              className="relative flex flex-col items-center justify-center min-w-[54px] px-2 py-1 text-white hover:text-amber-300 transition cursor-pointer group"
              title="My Wishlist"
            >
              <div className="relative">
                <Icon name="Heart" className="h-6 w-6 stroke-[2.2] group-hover:scale-105 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-[10px] leading-none shadow border border-[#0369a1] pointer-events-none">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-extrabold tracking-wide mt-1 text-white">Wishlist</span>
            </button>
          )}

          {!isCheckout && (
            <button
              onClick={() => {
                if (user) {
                  router.push("/account?tab=orders");
                } else {
                  router.push("/login?callbackUrl=/account?tab=orders");
                }
              }}
              className="relative flex flex-col items-center justify-center min-w-[54px] px-2 py-1 text-white hover:text-amber-300 transition cursor-pointer group"
              title="My Orders"
            >
              <div className="relative">
                <Icon name="Package" className="h-6 w-6 stroke-[2.2] group-hover:scale-105 transition-transform" />
              </div>
              <span className="text-[11px] font-extrabold tracking-wide mt-1 text-white">Orders</span>
            </button>
          )}

          <button
            onClick={() => {
              if (isCheckout && onReturnToCart) {
                onReturnToCart();
                return;
              }
              if (user) {
                router.push("/account");
              } else {
                router.push("/login?callbackUrl=/account");
              }
            }}
            className="relative flex flex-col items-center justify-center min-w-[54px] px-2 py-1 text-white hover:text-amber-300 transition cursor-pointer group"
            aria-label="User Profile & Accounts"
            title={user ? `${user.name || user.email} (${user.role})` : "My Account"}
          >
            <div className="relative">
              <Icon name="User" className="h-6 w-6 stroke-[2.2] group-hover:scale-105 transition-transform" />
              {user && (
                <span className="absolute -top-0.5 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-[#0284c7]" />
              )}
            </div>
            <span className="text-[11px] font-extrabold tracking-wide mt-1 truncate max-w-[64px] text-white">
              {user ? (user.name ? user.name.split(" ")[0] : "Account") : "Account"}
            </span>
          </button>

          {/* Cart Button */}
          {isCheckout ? (
            <button
              type="button"
              onClick={() => onReturnToCart ? onReturnToCart() : router.push("/cart")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition cursor-pointer"
              title="Return to Cart"
            >
              <Icon name="ArrowLeft" className="h-4 w-4 stroke-[2.5]" />
              <span>Return to Cart</span>
            </button>
          ) : (
            <button
              onClick={openCart}
              className="relative flex flex-col items-center justify-center min-w-[54px] px-2 py-1 text-white hover:text-amber-300 transition cursor-pointer group"
              aria-label="Shopping Cart"
              title={`Shopping Cart (${productCount} Products)`}
            >
              <div className="relative">
                <Icon name="ShoppingCart" className="h-6 w-6 stroke-[2.2] group-hover:scale-105 transition-transform" />
                <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-[10px] leading-none shadow border border-[#0369a1] pointer-events-none">
                  {productCount}
                </span>
              </div>
              <span className="text-[11px] font-extrabold tracking-wide mt-1 text-white">Cart</span>
            </button>
          )}
        </div>

        {/* Mobile Top Right Utilities matching original screenshot (Language Pill + Phone Button) */}
        <div className="flex lg:hidden items-center gap-2 text-white">
          <LanguageSwitcher />
          <a
            href="tel:+923184095736"
            className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition border border-white/20"
            title="Call Support +92 318 4095736"
          >
            <svg
              className="h-4 w-4 text-white fill-none stroke-current stroke-[2.2]"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.332-5.123-3.63-6.455-6.455l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
          </a>
        </div>

      </div>

      {/* Mobile Prominent Search Bar with Live Auto-Complete (Matching Screenshot 2) */}
      <div className="lg:hidden px-4 pb-3 pt-0.5 relative z-30" ref={searchRef}>
        <div className="relative">
          <Icon name="Search" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchFocused(true);
            }}
            placeholder="Search Storefront, Brands & Items..."
            className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 pl-10 pr-10 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-xs"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Icon name="SlidersHorizontal" className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Live Auto-Complete Suggestions Dropdown Panel on Mobile */}
        {searchFocused && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 space-y-1.5 z-50 animate-fade-in">
            <div className="flex items-center justify-between px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <span>Matching Products ({searchSuggestions.length})</span>
              <span className="text-amber-500 font-bold">Live Search</span>
            </div>
            {searchSuggestions.map((prod) => (
              <div
                key={prod.slug}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectSuggestion(prod);
                }}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 transition cursor-pointer border border-transparent hover:border-sky-100 group"
              >
                <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs">
                  <Image src={prod.image} alt={prod.title} fill className="object-cover" sizes="44px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{prod.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">{prod.brand}</span>
                    <span className="text-[10px] font-black text-amber-500 ml-auto">${prod.price}</span>
                  </div>
                </div>
                <Icon name="ChevronRight" className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        )}
      </div>

    </header>
  );
}

export const SiteHeader = Header;
