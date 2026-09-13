"use client";

import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#070a12] text-white border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-ocean-600 text-white font-extrabold">
                L
              </div>
              <span className="text-2xl font-black tracking-[0.2em]">LUMINA</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t("The premier enterprise multi-category storefront platform designed for seamless shopping, organic product curation, and full-stack CRM management.")}
            </p>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
              8 {t("Categories")}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/categories" className="hover:text-white transition">{t("Clothing")}</Link></li>
              <li><Link href="/categories" className="hover:text-white transition">{t("Furniture")}</Link></li>
              <li><Link href="/categories" className="hover:text-white transition">{t("Medical")}</Link></li>
              <li><Link href="/categories" className="hover:text-white transition">{t("Cosmetics")}</Link></li>
              <li><Link href="/categories" className="hover:text-white transition">{t("Food")}</Link></li>
              <li><Link href="/categories" className="hover:text-white transition">{t("Electronics")}</Link></li>
              <li><Link href="/categories" className="hover:text-white transition">{t("Auto Accessories")}</Link></li>
            </ul>
          </div>

          {/* Col 3: Policies & Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
              {t("Policies")}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="#" className="hover:text-white transition">{t("Privacy Policy")}</Link></li>
              <li><Link href="#" className="hover:text-white transition">{t("Terms & Conditions")}</Link></li>
              <li><Link href="#" className="hover:text-white transition">{t("Shipping Policy")}</Link></li>
              <li><Link href="#" className="hover:text-white transition">{t("Return & Refund Policy")}</Link></li>
            </ul>
          </div>

          {/* Col 4: Newsletter / Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
              {t("Follow Us")}
            </h4>
            <p className="text-xs text-slate-400">
              {t("Subscribe for new category releases and enterprise updates.")}
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} LUMINA Marketplace Inc. {t("All rights reserved.")}</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-slate-300">{t("Privacy Policy")}</Link>
            <Link href="#" className="hover:text-slate-300">{t("Terms & Conditions")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const SiteFooter = Footer;
