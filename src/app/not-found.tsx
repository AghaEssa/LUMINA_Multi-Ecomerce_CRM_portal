import Link from "next/link";
import { SiteHeader } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";

const QUICK_CATEGORIES = [
  { name: "Clothing", href: "/category/clothing", icon: "Shirt" },
  { name: "Furniture", href: "/category/furniture", icon: "Home" },
  { name: "Medical", href: "/category/medical", icon: "Activity" },
  { name: "Cosmetics", href: "/category/cosmetics", icon: "Sparkles" },
  { name: "Food & Grocery", href: "/category/food", icon: "Utensils" },
  { name: "Electronics", href: "/category/electronics", icon: "Smartphone" },
  { name: "Shoes & Footwear", href: "/category/shoes", icon: "Footprints" },
  { name: "Kitchen Utensils", href: "/category/utensils", icon: "CookingPot" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#060b13]">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="text-center max-w-xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black tracking-widest uppercase shadow-sm">
            <span>HTTP 404</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              The page or product specification you requested could not be located. Browse one of our popular categories below or return home.
            </p>
          </div>

          {/* Quick Categories Recovery Grid */}
          <div className="pt-2 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Popular Storefront Categories
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
              {QUICK_CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-[#0284c7] hover:text-[#0284c7] dark:hover:border-amber-400 dark:hover:text-amber-400 transition shadow-sm"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white px-6 py-3 text-xs font-bold shadow-md transition"
            >
              <Icon name="ArrowRight" className="h-4 w-4 rotate-180" />
              <span>Return to Homepage</span>
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-6 py-3 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <span>Explore All Categories</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
