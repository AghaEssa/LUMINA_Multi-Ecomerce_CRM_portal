"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { useLanguage } from "@/context/LanguageContext";
import { LuminaLogo } from "@/components/common/LuminaLogo";

export function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 3000);
  };

  return (
    <footer className="bg-[#090d16] dark:bg-[#05080e] text-slate-100 border-t border-slate-800/90 relative overflow-hidden font-sans pb-20 md:pb-0">
      {/* Top Accent Gradient Line */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-600 via-sky-400 to-amber-400" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Verified Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block transition hover:opacity-90">
              <LuminaLogo layout="horizontal" size="md" textColor="text-white" />
            </Link>
            
            <p className="text-xs sm:text-sm text-sky-100 font-semibold max-w-sm leading-relaxed">
              {t("The premier enterprise multi-category storefront platform designed for seamless shopping, organic product curation, and full-stack CRM management.")}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-black tracking-wide">
              <Icon name="ShieldCheck" className="h-4 w-4 text-emerald-400 stroke-[2.5]" />
              <span>100% Authentic Enterprise Marketplace</span>
            </div>

            {/* Newsletter Signup Form offering 10% Discount Incentive */}
            <div className="pt-3 space-y-2 max-w-md">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                <span>🎁 Subscribe &amp; Get 10% OFF Your First Order!</span>
              </div>

              {subscribed ? (
                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fade-in flex items-center gap-2">
                  <Icon name="Check" className="h-4 w-4 text-emerald-400" />
                  <span>Check your inbox! Your code <strong className="text-white bg-emerald-950 px-1.5 py-0.5 rounded">LUMINA10</strong> is ready.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="flex-1 rounded-2xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-xs font-semibold text-white placeholder-sky-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-4 py-2.5 text-xs font-black shadow transition cursor-pointer shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-300 flex items-center gap-2">
              <Icon name="Grid" className="h-4 w-4 text-amber-300 stroke-[2.4]" />
              <span>8 {t("Categories")}</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-sky-100">
              <li>
                <Link href="/category/clothing" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="Shirt" className="h-3.5 w-3.5 text-amber-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Clothing")}</span>
                </Link>
              </li>
              <li>
                <Link href="/category/furniture" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="Armchair" className="h-3.5 w-3.5 text-amber-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Furniture")}</span>
                </Link>
              </li>
              <li>
                <Link href="/category/medical" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="Stethoscope" className="h-3.5 w-3.5 text-amber-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Medical")}</span>
                </Link>
              </li>
              <li>
                <Link href="/category/cosmetics" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="Sparkles" className="h-3.5 w-3.5 text-amber-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Cosmetics")}</span>
                </Link>
              </li>
              <li>
                <Link href="/category/food" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="Apple" className="h-3.5 w-3.5 text-amber-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Food")}</span>
                </Link>
              </li>
              <li>
                <Link href="/category/electronics" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="Smartphone" className="h-3.5 w-3.5 text-amber-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Electronics")}</span>
                </Link>
              </li>
              <li>
                <Link href="/category/vehicles" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="Car" className="h-3.5 w-3.5 text-amber-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Auto Accessories")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies & Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-300 flex items-center gap-2">
              <Icon name="FileText" className="h-4 w-4 text-amber-300 stroke-[2.4]" />
              <span>{t("Policies")}</span>
            </h4>
            <ul className="space-y-2.5 text-xs font-bold text-sky-100">
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="ShieldCheck" className="h-3.5 w-3.5 text-sky-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Privacy Policy")}</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="FileText" className="h-3.5 w-3.5 text-sky-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Terms & Conditions")}</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="Truck" className="h-3.5 w-3.5 text-sky-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Shipping Policy")}</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 hover:text-amber-300 transition group">
                  <Icon name="RefreshCw" className="h-3.5 w-3.5 text-sky-400 stroke-[2.2] group-hover:scale-110 transition-transform" />
                  <span>{t("Return & Refund Policy")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Icons & Payment Methods */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-300 flex items-center gap-2">
              <Icon name="Share2" className="h-4 w-4 text-amber-300 stroke-[2.4]" />
              <span>{t("Follow Us")}</span>
            </h4>

            {/* Social Media Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 hover:bg-white/20 transition hover:scale-110 border border-white/15" title="Facebook">
                <svg className="h-4 w-4 text-[#1877F2] fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 hover:bg-white/20 transition hover:scale-110 border border-white/15" title="Instagram">
                <svg className="h-4 w-4 text-[#E4405F] fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 hover:bg-white/20 transition hover:scale-110 border border-white/15" title="YouTube">
                <svg className="h-4 w-4 text-[#FF0000] fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>

            {/* Universally Recognized Payment Method Badges */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Accepted Payment Methods</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-1 rounded bg-white text-slate-900 font-black text-[10px] shadow-sm">VISA</span>
                <span className="px-2 py-1 rounded bg-[#eb001b] text-white font-black text-[10px] shadow-sm">MC</span>
                <span className="px-2 py-1 rounded bg-[#0070ba] text-white font-black text-[10px] shadow-sm">PayPal</span>
                <span className="px-2 py-1 rounded bg-slate-900 text-white font-black text-[10px] border border-white/20 shadow-sm">ApplePay</span>
                <span className="px-2 py-1 rounded bg-[#4285F4] text-white font-black text-[10px] shadow-sm">GPay</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-sky-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-100 font-bold">
          <p>© {new Date().getFullYear()} LUMINA Marketplace Inc. {t("All rights reserved.")}</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-amber-300 transition">{t("Privacy Policy")}</Link>
            <Link href="#" className="hover:text-amber-300 transition">{t("Terms & Conditions")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const SiteFooter = Footer;
