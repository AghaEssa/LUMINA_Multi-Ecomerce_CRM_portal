"use client";

import Link from "next/link";
import { ProductCard } from "@/components/common/ProductCard";
import type { ProductItem } from "@/lib/products";
import { useLanguage } from "@/context/LanguageContext";
import { Icon } from "@/components/common/Icons";

type CategoryProductRowProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: "amber" | "emerald" | "rose" | "blue" | "purple";
  products: ProductItem[];
  categorySlug?: string;
  onAddToCart?: () => void;
  onOpenDetails?: (product: ProductItem) => void;
};

export function CategoryProductRow({
  title,
  subtitle,
  badge = "FEATURED",
  badgeColor = "amber",
  products,
  categorySlug,
  onAddToCart,
  onOpenDetails,
}: CategoryProductRowProps) {
  const { t } = useLanguage();

  const badgeColorClasses = {
    amber: "bg-amber-400/10 text-amber-600 dark:text-amber-400 border-amber-400/30",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badgeColorClasses[badgeColor]}`}
            >
              <Icon name="Sparkles" className="h-3 w-3" />
              {t(badge)}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t(title)}
          </h2>

          {subtitle && (
            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
              {t(subtitle)}
            </p>
          )}
        </div>

        {categorySlug && (
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-700 dark:text-amber-400 hover:underline group shrink-0"
          >
            <span>{t("View All Products")}</span>
            <Icon name="ArrowRight" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* 4-Column Responsive Product Grid (4 items per row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-1">
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            onAddToCart={onAddToCart}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>

    </section>
  );
}
