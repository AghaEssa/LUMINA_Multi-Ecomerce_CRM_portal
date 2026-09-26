"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icons";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import type { CategoryItem } from "@/lib/categories";
import { useCartContext } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LuminaLogo } from "@/components/common/LuminaLogo";
import { ProfileModal } from "@/components/common/ProfileModal";
import { Security2FAModal } from "@/components/common/Security2FAModal";
import { WishlistDrawer } from "@/components/common/WishlistDrawer";
import { NotificationsModal } from "@/components/common/NotificationsModal";

type HeaderProps = {
  cartCount?: number;
  onOpenSearch?: () => void;
  category?: CategoryItem;
  activeNav?: "storefront" | "sections" | "trending" | "brands" | "all";
  onNavClick?: (key: "storefront" | "sections" | "trending" | "brands") => void;
};

const DEFAULT_NAV_LINKS = [
  { name: "Storefront", href: "#hero" },
  { name: "Categories", href: "#categories" },
  { name: "Trending", href: "#trending" },
  { name: "Brands", href: "#brands" },
];

export function Header({
  onOpenSearch,
  category,
  activeNav = "storefront",
  onNavClick,
}: HeaderProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();
  const { user, logout, openAuthModal, openProfileModal, openSecurityModal } = useAuth();
  const { cartCount: ctxCount, productCount, openCart } = useCartContext();
  const { openWishlist, wishlistCount } = useWishlist();
  const displayCartCount = productCount;

  // Auto-close profile dropdown when clicking outside, scrolling, or pressing Escape
  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    const handleScroll = () => {
      setProfileOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleScroll, { passive: true });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  // Auto-hiding sticky header logic: Hides when scrolling down, auto-shows when scrolling up
  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Auto close profile popover whenever user scrolls
      setProfileOpen(false);

      // Always show near top of page
      if (currentScrollY < 50) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Scroll Down -> Hide header
      if (currentScrollY > lastScrollY + 8) {
        setIsVisible(false);
      }
      // Scroll Up -> Reveal header
      else if (currentScrollY < lastScrollY - 8) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Category specific nav items
  const categoryNavItems = category
    ? [
      { name: "Storefront", key: "storefront" as const },
      { name: "Sections", key: "sections" as const },
      { name: `${category.name} Trending`, key: "trending" as const },
      { name: "Brands", key: "brands" as const },
    ]
    : null;

  return (
    <header
      className={`sticky top-0 z-50 bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#0ea5e9] dark:from-[#082f49] dark:via-[#0c4a6e] dark:to-[#0f172a] text-white shadow-xl border-b border-white/10 dark:border-slate-800 backdrop-blur-md transition-transform duration-300 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none shadow-none"
        }`}
    >

      {/* Topmost Production Utility Bar */}
      <div className="bg-transparent text-white/90 text-[11px] font-medium border-b border-white/10 py-2 hidden sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Left Side: Language Switcher & Phone Support Link */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <a
              href="tel:+919974692496"
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer border border-white/20"
              title="Call +919974692496"
            >
              <svg
                className="h-3 w-3 text-white fill-none stroke-current stroke-[2.2]"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.332-5.123-3.63-6.455-6.455l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <span className="tracking-tight">+919974692496</span>
            </a>
          </div>

          {/* Right Side: Follow Us & Social Icons */}
          <div className="flex items-center gap-3">
            <span className="text-white/90 font-bold text-[11px]">{t("Follow Us")}</span>
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-6 w-6 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition hover:scale-110"
                title="Facebook"
              >
                <svg className="h-3.5 w-3.5 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-6 w-6 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition hover:scale-110"
                title="Instagram"
              >
                <svg className="h-3.5 w-3.5 text-[#E4405F] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-6 w-6 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition hover:scale-110"
                title="YouTube"
              >
                <svg className="h-3.5 w-3.5 text-[#FF0000] fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="grid h-6 w-6 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition hover:scale-110"
                title="X (Twitter)"
              >
                <svg className="h-3.5 w-3.5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Brand Logo - Clicking takes back to Main Multi-Category Store Homepage */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/" className="group flex items-center transition hover:opacity-90" title="Go to Lumina Main Storefront">
            <LuminaLogo layout="horizontal" size="md" textColor="text-white" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 text-sm font-extrabold text-white lg:flex">
          {categoryNavItems
            ? categoryNavItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavClick && onNavClick(item.key)}
                  className={`relative py-1 transition duration-200 flex items-center gap-1.5 font-extrabold tracking-wide ${isActive ? "text-amber-300 drop-shadow-xs" : "text-white hover:text-amber-200"
                    }`}
                >
                  <span>{item.name}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-1 rounded-full bg-amber-400 shadow-sm transition-all duration-300 ${isActive ? "w-full" : "w-0 hover:w-full"
                      }`}
                  />
                </button>
              );
            })
            : DEFAULT_NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative py-1 transition hover:text-amber-200 group flex items-center gap-1.5 font-extrabold tracking-wide text-white"
              >
                <span>{t(link.name)}</span>
                <span className="absolute bottom-0 left-0 h-1 rounded-full w-0 bg-amber-400 shadow-sm transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
        </nav>

        {/* Action Controls matching template screenshot (Wishlist, Orders, Account, Cart) - Laptop/PC Desktop Only */}
        <div className="hidden lg:flex items-center gap-2 sm:gap-4 text-white">

          {/* 1. Wishlist Button */}
          <button
            onClick={openWishlist}
            className="flex flex-col items-center justify-center min-w-[56px] text-white hover:text-amber-300 transition cursor-pointer relative group px-1 py-0.5"
            title="My Wishlist"
          >
            <div className="relative h-6 w-6 flex items-center justify-center">
              <Icon name="Heart" className="h-5.5 w-5.5 stroke-[2.4] group-hover:scale-110 transition-transform drop-shadow-xs" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-slate-950 shadow-md border border-slate-900/30">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-extrabold tracking-wide mt-1 text-white">Wishlist</span>
          </button>

          {/* 2. Orders Button */}
          <button
            onClick={() => {
              if (user) {
                router.push("/account?tab=orders");
              } else {
                router.push("/login?callbackUrl=/account?tab=orders");
              }
            }}
            className="flex flex-col items-center justify-center min-w-[56px] text-white hover:text-amber-300 transition cursor-pointer group px-1 py-0.5"
            title="My Orders"
          >
            <div className="relative h-6 w-6 flex items-center justify-center">
              <Icon name="Package" className="h-5.5 w-5.5 stroke-[2.4] group-hover:scale-110 transition-transform drop-shadow-xs" />
            </div>
            <span className="text-[11px] font-extrabold tracking-wide mt-1 text-white">Orders</span>
          </button>

          {/* 3. Account Button (Perfectly Aligned Avatar / User Icon) */}
          <button
            onClick={() => {
              if (user) {
                router.push("/account");
              } else {
                router.push("/login?callbackUrl=/account");
              }
            }}
            className="flex flex-col items-center justify-center min-w-[56px] text-white hover:text-amber-300 transition cursor-pointer relative group px-1 py-0.5"
            aria-label="User Profile & Accounts"
            title={user ? `${user.name || user.email} (${user.role})` : "My Account"}
          >
            <div className="relative h-6 w-6 flex items-center justify-center">
              {user ? (
                <div className="h-6 w-6 rounded-full bg-amber-400 text-slate-950 font-black text-[12px] flex items-center justify-center shadow-md ring-2 ring-white/50 group-hover:scale-110 transition-transform">
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
              ) : (
                <Icon name="User" className="h-5.5 w-5.5 stroke-[2.4] group-hover:scale-110 transition-transform drop-shadow-xs" />
              )}
              {user && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0284c7]" />
              )}
            </div>
            <span className="text-[11px] font-extrabold tracking-wide mt-1 truncate max-w-[64px] text-white">
              {user ? (user.name ? user.name.split(" ")[0] : "Agha") : "Account"}
            </span>
          </button>

          {/* 4. Cart Button */}
          <button
            onClick={openCart}
            className="flex flex-col items-center justify-center min-w-[56px] text-white hover:text-amber-300 transition cursor-pointer relative group px-1 py-0.5"
            aria-label="Shopping Cart"
            title={`Shopping Cart (${productCount} Products)`}
          >
            <div className="relative h-6 w-6 flex items-center justify-center">
              <Icon name="ShoppingCart" className="h-5.5 w-5.5 stroke-[2.4] group-hover:scale-110 transition-transform drop-shadow-xs" />
              <span className="absolute -top-1.5 -right-2.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-slate-950 shadow-md border border-slate-900/30">
                {displayCartCount}
              </span>
            </div>
            <span className="text-[11px] font-extrabold tracking-wide mt-1 text-white">Cart</span>
          </button>
        </div>

        {/* Mobile Top Right Utilities: Compact Language Switcher & Phone Support Button */}
        <div className="flex lg:hidden items-center gap-2 text-white">
          <LanguageSwitcher />
          <a
            href="tel:+919974692496"
            className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition border border-white/20"
            title="Call Support +919974692496"
          >
            <svg
              className="h-3.5 w-3.5 text-white fill-none stroke-current stroke-[2.2]"
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

      {/* Mobile Prominent Search Bar (As shown in screenshot 1) */}
      <div className="lg:hidden px-4 pb-3 pt-0.5">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-xs hover:border-amber-400 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 text-xs font-medium truncate">
            <Icon name="Search" className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">Search Storefront, Brands &amp; Items...</span>
          </div>
          <div className="grid h-7 w-7 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
            <Icon name="SlidersHorizontal" className="h-3.5 w-3.5" />
          </div>
        </button>
      </div>

      {/* Mobile Drawer Menu (Adaptive & Fully Responsive) */}
      {mobileMenuOpen && (
        <nav className="border-t border-white/10 dark:border-slate-800 bg-[#06465c] dark:bg-[#0b1324] px-4 py-5 lg:hidden animate-fade-in space-y-4">

          {/* User Profile Card / Auth CTA in Mobile Drawer */}
          <div className="rounded-2xl bg-white/10 dark:bg-slate-900/80 p-3.5 border border-white/10 flex items-center justify-between">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#0b3328] border border-emerald-500/50 text-[#10b981] font-black text-sm shadow-inner">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white truncate max-w-[160px]">{user.name || "Lumina User"}</p>
                  <p className="text-[10px] text-ocean-200 uppercase tracking-wider font-semibold">{user.role} Account</p>
                </div>
              </div>
            ) : (
              <div className="text-xs">
                <p className="font-bold text-white">Guest Visitor</p>
                <p className="text-[10px] text-ocean-200">Login to save cart & profile</p>
              </div>
            )}

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold border border-rose-500/30 transition"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/login?callbackUrl=/account");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-ocean-950 text-xs font-extrabold shadow transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/register?callbackUrl=/account");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition"
                >
                  Signup
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1 text-xs font-bold text-white">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-ocean-300 px-3 pt-1 pb-1">
              Navigation Links
            </p>
            {categoryNavItems
              ? categoryNavItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onNavClick) onNavClick(item.key);
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/10 transition text-left"
                >
                  <span>{item.name}</span>
                  <Icon name="ChevronRight" className="h-4 w-4 text-ocean-200" />
                </button>
              ))
              : DEFAULT_NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/10 transition"
                >
                  <span>{t(link.name)}</span>
                  <Icon name="ChevronRight" className="h-4 w-4 text-ocean-200" />
                </Link>
              ))}
          </div>

          {/* Quick Categories Bar in Mobile Drawer */}
          <div className="pt-2 border-t border-white/10 space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-ocean-300 px-3 pb-1">
              Quick Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-ocean-100">
              <Link href="/category/clothing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition">👕 Clothing</Link>
              <Link href="/category/furniture" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition">🛋️ Furniture</Link>
              <Link href="/category/medical" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition">🩺 Medical</Link>
              <Link href="/category/cosmetics" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition">✨ Cosmetics</Link>
              <Link href="/category/food" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition">🍎 Food</Link>
              <Link href="/category/electronics" onClick={() => setMobileMenuOpen(false)} className="px-3 py-1.5 rounded-lg hover:bg-white/10 transition">📱 Electronics</Link>
            </div>
          </div>

          {/* Footer Controls: Theme & Language Switcher */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <ThemeToggle variant="dropdown-row" className="bg-white/10 text-white hover:bg-white/20 dark:bg-slate-800/80" />
            <div className="flex items-center justify-between text-xs px-1">
              <LanguageSwitcher variant="mobile" />
            </div>
          </div>

        </nav>
      )}

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </header>
  );
}

export const SiteHeader = Header;


