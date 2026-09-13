"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";

export function BillboardBanner() {
  return (
    <section id="billboard-promo" className="mx-auto max-w-[1440px] px-2 sm:px-4 lg:px-6 py-6 sm:py-10">
      
      {/* Clean Stretched Banner Container */}
      <div className="relative w-full overflow-hidden rounded-xl bg-slate-950 text-white shadow-xl border border-amber-400/20 min-h-[420px] sm:min-h-[480px] flex items-center">
        
        {/* Background Image - Full Width */}
        <Image
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&auto=format&fit=crop"
          alt="Lumina Flash Loot Sale Banner"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/50" />

        {/* Content Inside */}
        <div className="relative z-10 w-full p-8 sm:p-14 lg:p-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            
            {/* Left Column: Loot Deal Details */}
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="rounded-md bg-amber-400 text-slate-950 px-3.5 py-1 text-xs font-black uppercase tracking-widest shadow-md flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                  FLASH LOOT DEAL
                </span>
                <span className="rounded-md bg-white/15 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-amber-300 border border-white/20">
                  ⏰ ENDS IN: 04h : 18m : 32s
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase">
                CRAZY MEGA LOOT — <span className="text-amber-300">UP TO 50% OFF</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                Limited time loot prices across Clothes, Furniture, Utensils, Medical, Cosmetics & Smart Tech. Stock selling fast!
              </p>

              {/* Selling Point Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Icon name="Check" className="h-4 w-4" /> 24h Express Shipping
                </span>
                <span className="flex items-center gap-1.5 text-sky-300">
                  <Icon name="Check" className="h-4 w-4" /> 100% Authentic Guarantee
                </span>
              </div>
            </div>

            {/* Right Column: CTA Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <Link
                href="/category/clothes"
                className="inline-flex items-center justify-center gap-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 px-8 py-4 text-sm font-black uppercase tracking-wider shadow-lg transition-all duration-200 active:scale-95 text-center"
              >
                <span>SHOP LOOT DEALS NOW</span>
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}
