"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import type { CategoryItem } from "@/lib/categories";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

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
  cartCount = 0,
  onOpenSearch,
  category,
  activeNav = "storefront",
  onNavClick,
}: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();
  const { user, logout, openAuthModal } = useAuth();

  const { cartCount: ctxCount, openCart } = useCartContext();
  const displayCartCount = cartCount || ctxCount;

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
      className={`sticky top-0 z-50 bg-[#075570] dark:bg-[#0d1527] text-white shadow-xl border-b border-white/10 dark:border-slate-800 backdrop-blur-md transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none shadow-none"
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
          <Link href="/" className="group flex items-center gap-2 sm:gap-2.5" title="Go to Lumina Main Storefront">
            <div className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-white/15 text-white shadow-inner transition duration-300 group-hover:scale-105 group-hover:bg-white group-hover:text-ocean-700 shrink-0">
              <span className="font-extrabold text-base sm:text-lg tracking-tighter">L</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-black tracking-[0.15em] sm:tracking-[0.2em] text-white transition group-hover:text-ocean-100 flex items-center gap-2">
                LUMINA
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-ocean-200 hidden sm:block">
                Multi-Category Store
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 text-sm font-bold text-white/90 lg:flex">
          {categoryNavItems
            ? categoryNavItems.map((item) => {
              const isActive = activeNav === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNavClick && onNavClick(item.key)}
                  className={`relative py-1 transition duration-200 flex items-center gap-1.5 font-bold ${isActive ? "text-amber-300" : "text-white/90 hover:text-white"
                    }`}
                >
                  <span>{item.name}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-amber-300 transition-all duration-300 ${isActive ? "w-full" : "w-0 hover:w-full"
                      }`}
                  />
                </button>
              );
            })
            : DEFAULT_NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative py-1 transition hover:text-white group flex items-center gap-1.5"
              >
                <span>{t(link.name)}</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme Toggle (Light/Dark Mode) */}
          <ThemeToggle />

          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="nav-icon flex items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            aria-label="Search Categories & Products"
            title="Search Categories & Products"
          >
            <Icon name="Search" className="h-5 w-5 text-white" />
          </button>

          {/* User Profile Popover Button (Visible on Mobile & Desktop) */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => {
                if (user) {
                  setProfileOpen((prev) => !prev);
                } else {
                  openAuthModal("login");
                }
              }}
              className="nav-icon flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 transition relative"
              aria-label="User Profile & Accounts"
              title={user ? `${user.name || user.email} (${user.role})` : "Login / Signup"}
            >
              {user ? (
                /* Decent Dark Green Circle with Bright Green Initial */
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#0b3328] border border-emerald-500/50 text-[#10b981] font-black text-xs sm:text-sm flex items-center justify-center shadow-inner">
                  {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
              ) : (
                /* Empty Profile Silhouette Avatar Icon */
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}

              {user && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#075570] dark:border-[#0d1527]" />
              )}
            </button>

            {/* Profile Dropdown for Logged In User */}
            {profileOpen && user && (
              <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10 text-slate-800 dark:text-slate-100 z-50 animate-fade-in">
                <div className="border-b border-slate-100 pb-3 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-ocean-600 dark:text-ocean-400 uppercase tracking-widest">
                      {user.role} ACCOUNT
                    </span>
                    {user.isTwoFactorEnabled && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        🔒 2FA Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {user.name || "Lumina User"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>

                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      openCart();
                    }}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <span className="flex items-center gap-2">
                      <Icon name="ShoppingCart" className="h-4 w-4 text-ocean-600 dark:text-amber-400" />
                      <span>Shopping Cart ({displayCartCount})</span>
                    </span>
                    <Icon name="ChevronRight" className="h-3.5 w-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
                  >
                    <span>Sign Out</span>
                    <Icon name="X" className="h-3.5 w-3.5 text-rose-500" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon with Dynamic Badge */}
          <button
            onClick={openCart}
            className="nav-icon relative flex items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
            aria-label="Shopping Cart"
            title="Shopping Cart"
          >
            <Icon name="ShoppingCart" className="h-5 w-5 text-white" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-black text-ocean-950 shadow-md">
              {displayCartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle (Hamburger Icon) */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="nav-icon lg:hidden flex items-center justify-center p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition"
            aria-label="Toggle Mobile Navigation Menu"
            title="Navigation Menu"
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} className="h-6 w-6 text-white" />
          </button>
        </div>
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
                    openAuthModal("login");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-ocean-950 text-xs font-extrabold shadow transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal("register");
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

          {/* Footer Controls: Language Switcher & Theme */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <LanguageSwitcher variant="mobile" />
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-ocean-200 font-semibold">Theme:</span>
              <ThemeToggle />
            </div>
          </div>

        </nav>
      )}
    </header>
  );
}

export const SiteHeader = Header;
