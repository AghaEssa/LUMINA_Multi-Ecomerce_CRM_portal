"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { useLanguage } from "@/context/LanguageContext";

export function ShoesBanner() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-[1440px] px-2 sm:px-4 lg:px-6 py-6 sm:py-10">
      {/* Clean Non-Rounded Stretched Container */}
      <div className="relative overflow-hidden rounded-xl bg-[#ede7dd] dark:bg-[#0f172a] text-slate-900 dark:text-white shadow-xl border border-amber-900/10 dark:border-white/10 min-h-[480px] sm:min-h-[540px] flex items-center">
        
        {/* Background Image / Texture */}
        <div className="absolute inset-0 z-0 opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&auto=format&fit=crop"
            alt="Shoes & Footwear Collection"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Banner Content Grid */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-14 lg:p-16">
          
          {/* Left Text Box */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#b8860b] text-white text-xs font-black uppercase tracking-widest shadow-sm">
                <Icon name="Sparkles" className="h-3.5 w-3.5" />
                {t("Footwear Edition")}
              </span>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-widest">
                Nike • Adidas • Puma • Converse
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] uppercase">
                {t("Shoe Collection")}
              </h2>
              <p className="text-lg sm:text-xl font-bold text-amber-900/80 dark:text-amber-200">
                {t("Premium styles for every season")}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl font-medium leading-relaxed">
              {t("Explore performance running sneakers, casual leather low-tops, water beach shoes, and winter boots with up to 40% discount.")}
            </p>

            <div className="pt-3">
              <Link
                href="/category/clothes"
                className="inline-flex items-center gap-3 rounded-lg bg-[#b8860b] hover:bg-[#a07409] text-white px-8 py-4 text-sm font-black uppercase tracking-wider shadow-lg shadow-amber-900/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>{t("Step Into Style")}</span>
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual Image & Product Hotspots */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-md sm:max-w-lg rounded-lg overflow-hidden shadow-2xl border-4 border-white/60 dark:border-slate-800/80 group">
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop"
                alt="Shoe Collection Showcase"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 500px"
              />

              {/* Price Badges overlay */}
              <div className="absolute top-4 right-4 bg-slate-900/90 text-amber-300 px-3.5 py-1.5 rounded-md text-xs font-black shadow-lg backdrop-blur-md">
                40% {t("off")}
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white px-4 py-2 rounded-md text-xs font-extrabold shadow-lg backdrop-blur-md flex items-center gap-2">
                <span>Track Spikes & Boots</span>
                <span className="text-[#b8860b] font-black">$49.99</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
