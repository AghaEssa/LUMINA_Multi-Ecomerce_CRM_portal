"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { useLanguage } from "@/context/LanguageContext";

export function TechBanner() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-[1440px] px-2 sm:px-4 lg:px-6 py-6 sm:py-10">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-blue-500/20 min-h-[480px] sm:min-h-[540px] flex items-center">
        
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-35 mix-blend-overlay">
          <Image
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop"
            alt="Smart Electronics Tech"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Content Box */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-14 lg:p-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-blue-500 text-white text-xs font-black uppercase tracking-widest shadow-md">
              <Icon name="Zap" className="h-3.5 w-3.5 text-amber-300" />
              <span>{t("Tech Spotlight")}</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase">
              {t("Next-Gen Audio & Smart Devices")} <br />
              <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                {t("Sony WH-1000XM5 & Apple Watch")}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-blue-100/90 max-w-xl font-medium leading-relaxed">
              {t("Experience industry-leading active noise cancellation, OLED retina displays, and fast EV chargers.")}
            </p>

            <div className="pt-2">
              <Link
                href="/category/smart-devices"
                className="inline-flex items-center gap-3 rounded-lg bg-blue-500 hover:bg-blue-400 px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>{t("Explore Tech Essentials")}</span>
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-md sm:max-w-lg rounded-lg overflow-hidden shadow-2xl border-4 border-blue-400/30">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop"
                alt="Sony ANC Headphones"
                fill
                className="object-cover"
                sizes="500px"
              />
              <div className="absolute top-4 right-4 bg-slate-950/90 text-cyan-300 px-3.5 py-1.5 rounded-md text-xs font-black shadow-lg">
                15% {t("off")}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
