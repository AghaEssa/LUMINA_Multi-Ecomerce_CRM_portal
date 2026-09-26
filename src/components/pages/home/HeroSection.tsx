import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { useLanguage } from "@/context/LanguageContext";

type HeroSectionProps = {
  onOpenSearch?: () => void;
};

export function HeroSection({ onOpenSearch }: HeroSectionProps) {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative overflow-hidden bg-[#eaf4f7] dark:bg-[#090d16] py-10 sm:py-12 lg:py-16 transition-colors duration-300">
      
      {/* Full-Bleed Right Edge Background Photography */}
      <div className="absolute top-0 bottom-0 right-0 w-full lg:w-[58%] overflow-hidden pointer-events-none z-0">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&auto=format&fit=crop"
          alt="Lumina Storefront Lifestyle Background"
          fill
          priority
          className="object-cover object-center lg:object-right opacity-100 dark:opacity-90"
          sizes="(max-width: 1024px) 100vw, 58vw"
        />

        {/* Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#eaf4f7] via-[#eaf4f7]/70 to-transparent dark:from-[#090d16] dark:via-[#090d16]/70 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#eaf4f7]/90 via-transparent to-[#eaf4f7]/30 dark:from-[#090d16]/90 dark:via-transparent dark:to-[#090d16]/30" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-12 text-center lg:text-left">
            
            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              {t("Find What Elevates")}{" "}
              <span className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#d97706] bg-clip-text text-transparent dark:from-amber-300 dark:via-amber-400 dark:to-yellow-200">
                {t("Your Everyday Life.")}
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="mx-auto lg:mx-0 max-w-2xl text-xs sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t("Explore LUMINA's curated luxury collection")} — {t("from high fashion apparel and ergonomic furniture to culinary utensils, clinical medical gear, cosmetics, food, smart electronics, and vehicle accessories.")}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <Link
                href="#categories"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 px-7 py-3.5 text-sm font-black shadow-lg shadow-amber-500/20 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{t("Explore 8 Categories")}</span>
                <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <button
                onClick={onOpenSearch}
                className="inline-flex items-center gap-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-[#111827]/90 px-6 py-3.5 text-sm font-bold text-slate-900 dark:text-slate-100 shadow-xs backdrop-blur-md transition duration-300 hover:bg-white hover:border-amber-400 dark:hover:bg-[#1f293d] cursor-pointer"
              >
                <Icon name="Search" className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                <span>{t("Search Storefront")}</span>
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300/80 dark:border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white">8</p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t("Main Categories")}</p>
              </div>
              <div>
                <p className="text-xl font-black text-[#d97706] dark:text-amber-400">100%</p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t("Authentic Products")}</p>
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white">24/7</p>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t("Customer Support")}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
