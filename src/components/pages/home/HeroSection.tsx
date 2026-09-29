"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { useLanguage } from "@/context/LanguageContext";

type HeroSectionProps = {
  onOpenSearch?: () => void;
};

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&auto=format&fit=crop",
    title: "Minimalist Furniture & Living Decor",
    tagline: "Ergonomic oak seating & ambient craft lighting for modern homes",
    ctaText: "Shop Furniture",
    link: "/category/furniture",
  },
  {
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1400&auto=format&fit=crop",
    title: "Next-Gen Smart Devices & Spatial Audio",
    tagline: "Audiophile ANC headphones, OLED watches & EV charging tech",
    ctaText: "Explore Tech",
    link: "/category/smart-devices",
  },
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&auto=format&fit=crop",
    title: "Luxury Apparel & Sustainable Tailoring",
    tagline: "Haute couture denim, biker jackets & summer fashion collection",
    ctaText: "Browse Apparel",
    link: "/category/clothes",
  },
  {
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1400&auto=format&fit=crop",
    title: "Organic Skincare & Botanical Scents",
    tagline: "1.5% Hyaluronic serums, luxury perfumes & natural cosmetics",
    ctaText: "Shop Cosmetics",
    link: "/category/cosmetics",
  },
];

export function HeroSection({ onOpenSearch }: HeroSectionProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const activeSlide = HERO_SLIDES[currentIndex];

  return (
    <div className="flex flex-col">
      <section
        id="hero"
        className="relative overflow-hidden bg-[#eaf4f7] dark:bg-[#090d16] py-12 sm:py-16 lg:py-20 transition-colors duration-500 min-h-[500px] sm:min-h-[540px] flex items-center"
      >
        {/* Automatic Background Photography Slider */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 w-full lg:w-[58%] h-full overflow-hidden z-0">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.image}
                className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center lg:object-right opacity-100 dark:opacity-90"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              </div>
            );
          })}

          {/* Gradient Mask Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#eaf4f7] via-[#eaf4f7]/75 to-transparent dark:from-[#090d16] dark:via-[#090d16]/75 dark:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#eaf4f7]/95 via-transparent to-[#eaf4f7]/30 dark:from-[#090d16]/95 dark:via-transparent dark:to-[#090d16]/30" />
        </div>

        {/* Main Hero Content Area */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-center lg:text-left">
              
              {/* Dynamic Headline */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] font-heading">
                  {t("Everything You Need,")}{" "}
                  <span className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#d97706] bg-clip-text text-transparent dark:from-amber-300 dark:via-amber-400 dark:to-yellow-200 block sm:inline mt-1 sm:mt-0">
                    {activeSlide.title}
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <div>
                <p className="mx-auto lg:mx-0 max-w-2xl text-xs sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {activeSlide.tagline}
                </p>
              </div>

              {/* High Contrast Primary CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
                <Link
                  href={activeSlide.link}
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#ffb800] hover:bg-[#f5b000] text-slate-950 px-8 py-4 text-sm font-black shadow-xl shadow-amber-500/30 transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] cursor-pointer ring-4 ring-amber-400/30"
                >
                  <span>{activeSlide.ctaText}</span>
                  <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.8] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <button
                  onClick={onOpenSearch}
                  className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-[#111827]/90 px-6 py-4 text-sm font-bold text-slate-900 dark:text-slate-100 shadow-xs backdrop-blur-md transition duration-300 hover:bg-white hover:border-amber-400 dark:hover:bg-[#1f293d] cursor-pointer"
                >
                  <Icon name="Search" className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  <span>{t("Search Storefront")}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Trust Banners Strip Positioned Directly Under the Main Billboard */}
      <div className="bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 py-4 shadow-sm z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            
            <div className="flex items-center justify-center gap-3 p-2 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0284c7] text-white shadow-sm shrink-0">
                <Icon name="ShieldCheck" className="h-5 w-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">100% Authentic</p>
                <p className="text-[10px] font-semibold text-slate-400 truncate">Guaranteed Quality</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-2 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0284c7] text-white shadow-sm shrink-0">
                <Icon name="Truck" className="h-5 w-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">24h Express Dispatch</p>
                <p className="text-[10px] font-semibold text-slate-400 truncate">Fast Worldwide Delivery</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-2 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0284c7] text-white shadow-sm shrink-0">
                <Icon name="RefreshCw" className="h-5 w-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">30-Day Easy Returns</p>
                <p className="text-[10px] font-semibold text-slate-400 truncate">No Questions Asked</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 p-2 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700/60">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#0284c7] text-white shadow-sm shrink-0">
                <Icon name="Headphones" className="h-5 w-5" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-black text-slate-900 dark:text-white truncate">24/7 VIP Support</p>
                <p className="text-[10px] font-semibold text-slate-400 truncate">Dedicated Customer Care</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
