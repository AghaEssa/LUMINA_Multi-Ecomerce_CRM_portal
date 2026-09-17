"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icons";
import type { ProductItem } from "@/lib/products";
import { useCartContext } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

type ProductCardProps = {
  product: ProductItem;
  variant?: "grid" | "carousel";
  onAddToCart?: () => void;
  onOpenDetails?: (product: ProductItem) => void;
};

export function ProductCard({
  product,
  variant = "grid",
  onAddToCart,
  onOpenDetails,
}: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCartContext();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { requireAuth } = useAuth();
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);

  const wishlist = isInWishlist(product.slug);

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      requireAuth(() => {
        setAdded(true);
        addToCart({ product, quantity: 1, openDrawer: false });
        if (onAddToCart) onAddToCart();
        setTimeout(() => setAdded(false), 1500);
      }, product);
    },
    [addToCart, product, onAddToCart, requireAuth]
  );

  const handleCardClick = useCallback(() => {
    if (onOpenDetails) {
      onOpenDetails(product);
    } else {
      router.push(`/product/${product.slug}`);
    }
  }, [onOpenDetails, product, router]);

  const isDataUri = product.image?.startsWith("data:");
  const origPrice = product.originalPrice || Math.round(product.price * 1.18 * 100) / 100;
  const discountVal = Math.round(((origPrice - product.price) / origPrice) * 100 * 100) / 100;
  const discountLabel = `${discountVal}% ${t("off")}`;

  const containerClasses =
    variant === "carousel"
      ? "w-[220px] sm:w-[280px] shrink-0"
      : "w-full";

  return (
    <div
      onClick={handleCardClick}
      className={`group flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-2.5 sm:p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ocean-300 dark:hover:border-amber-400/50 hover:shadow-xl dark:border-slate-800/90 dark:bg-[#111827] cursor-pointer ${containerClasses}`}
    >
      {/* Top Image Box Container */}
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80">
          {isDataUri ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 300px"
            />
          )}

          {/* Top Right Floating Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full border shadow-md transition-all duration-200 ${
                wishlist
                  ? "bg-rose-500 text-white border-rose-500 scale-110"
                  : "bg-white/90 text-slate-700 border-slate-200/80 hover:text-rose-500 hover:bg-white dark:bg-slate-900/90 dark:border-slate-700"
              }`}
              title="Wishlist"
            >
              <span className="text-[11px] sm:text-xs">{wishlist ? "❤️" : "🤍"}</span>
            </button>
          </div>
        </div>

        {/* Info Header: Brand & Title */}
        <div className="mt-2 sm:mt-3 space-y-0.5 sm:space-y-1">
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px]">
            <span className="font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 truncate">
              {product.brand}
            </span>
            <span className="hidden sm:flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t("In Stock")}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition">
            {t(product.title)}
          </h3>

          {/* Sub description */}
          {product.description && (
            <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1 font-normal hidden sm:block">
              {t(product.description)}
            </p>
          )}
        </div>
      </div>

      {/* Pricing & Amber CTA */}
      <div className="mt-2 sm:mt-3.5 pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 sm:space-y-2.5">
        {/* Pricing Row */}
        <div className="flex items-baseline justify-between flex-wrap gap-1">
          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-sm sm:text-lg font-black text-slate-900 dark:text-white">
              ${product.price}
            </span>
            {origPrice > product.price && (
              <span className="text-[10px] sm:text-xs font-semibold text-slate-400 line-through hidden sm:inline">
                ${origPrice}
              </span>
            )}
          </div>
          {discountLabel && (
            <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {discountLabel}
            </span>
          )}
        </div>

        {/* Rating Row */}
        <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold text-slate-500">
          <span className="text-amber-400">★</span>
          <span className="text-slate-900 dark:text-white font-extrabold">{product.rating}</span>
        </div>

        {/* Compact CTA Button */}
        <button
          onClick={handleAdd}
          className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            added
              ? "bg-emerald-600 text-white shadow-md"
              : "bg-[#ffb800] hover:bg-[#f5b000] text-[#0f172a] shadow-sm active:scale-[0.98]"
          }`}
        >
          <Icon name={added ? "Check" : "ShoppingCart"} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="truncate">{added ? t("Added") : t("Add to Cart")}</span>
        </button>
      </div>
    </div>
  );
}

export const CategoryProductCard = ProductCard;
