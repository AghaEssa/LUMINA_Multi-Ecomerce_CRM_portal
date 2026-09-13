"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { useLanguage } from "@/context/LanguageContext";

const SLIDES = [
  {
    id: "men-perfume",
    tag: "Men's Luxury Cologne",
    title: "Dior Sauvage & Premium Men's Fragrances",
    subtitle: "Artisanal Eau de Parfum infused with Calabrian bergamot, Sichuan pepper & amber woods.",
    badge: "25% OFF",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&auto=format&fit=crop",
    link: "/category/cosmetics",
    buttonText: "Shop Men's Cologne",
  },
  {
    id: "women-makeup",
    tag: "Women's Beauty & Skincare",
    title: "L'Oréal & High-End Women's Cosmetics Edit",
    subtitle: "Hyaluronic Acid hydration serums, silk foundation, & matte lipstick collections.",
    badge: "NEW EDIT",
    image: "https://images.unsplash.com/photo-1608248597266-c896505f6142?w=1400&auto=format&fit=crop",
    link: "/category/cosmetics",
    buttonText: "Explore Women's Beauty",
  },
];

export function CosmeticsAutoBanner() {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="mx-auto max-w-[1440px] px-2 sm:px-4 lg:px-6 py-6 sm:py-10">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-950 via-purple-950 to-slate-950 text-white shadow-xl border border-rose-500/20 min-h-[480px] sm:min-h-[540px] flex items-center">
        
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-45 mix-blend-overlay transition-opacity duration-1000">
          <Image
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center transition-all duration-700 scale-105"
            sizes="100vw"
          />
        </div>

        {/* Content Box */}
        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-14 lg:p-16">
          <div className="lg:col-span-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-md bg-rose-500 text-white text-xs font-black uppercase tracking-widest shadow-md">
                {t(slide.tag)}
              </span>
              <span className="px-3 py-1 rounded-md bg-white/10 text-amber-300 text-xs font-bold border border-white/20">
                {slide.badge}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase">
              {t(slide.title)}
            </h2>

            <p className="text-base sm:text-lg text-rose-100/90 max-w-2xl font-medium leading-relaxed">
              {t(slide.subtitle)}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href={slide.link}
                className="inline-flex items-center gap-3 rounded-lg bg-rose-500 hover:bg-rose-600 px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span>{t(slide.buttonText)}</span>
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Product Preview Box */}
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-md sm:max-w-lg rounded-lg overflow-hidden shadow-2xl border-4 border-rose-300/30">
              <Image
                key={slide.id}
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                sizes="500px"
              />
            </div>
          </div>
        </div>

        {/* Carousel Indicator Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/40 backdrop-blur-md px-4 py-2 rounded-md border border-white/10">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 transition-all duration-300 rounded-md ${
                currentSlide === idx ? "w-8 bg-rose-400" : "w-3 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
