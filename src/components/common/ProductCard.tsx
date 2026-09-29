"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icons";
import type { ProductItem } from "@/lib/products";
import { useCartContext } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
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
  const { t } = useLanguage();
  const [added, setAdded] = useState(false);

  const wishlist = isInWishlist(product.slug);

  const handleAdd = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setAdded(true);
      addToCart({ product, quantity: 1, openDrawer: false });
      if (onAddToCart) onAddToCart();
      setTimeout(() => setAdded(false), 1500);
    },
    [addToCart, product, onAddToCart]
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
      {/* Top Image Box Container (Strict Uniform 3:4 Aspect Ratio) */}
      <div>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80">
          
          {/* Primary Product Image */}
          {isDataUri ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={product.image}
              alt={product.title}
              className={`h-full w-full object-cover transition-all duration-500 ${
                product.secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
              }`}
            />
          ) : (
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-cover transition-all duration-500 ${
                product.secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"
              }`}
              sizes="(max-width: 640px) 50vw, 300px"
            />
          )}

          {/* Secondary Image Reveal on Hover */}
          {product.secondaryImage && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <Image
                src={product.secondaryImage}
                alt={`${product.title} Alternate View`}
                fill
                className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 50vw, 300px"
              />
            </div>
          )}

          {/* Top Left Status Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {product.inStock === false ? (
              <span className="rounded-md bg-rose-600/90 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 shadow-md backdrop-blur-sm">
                Out of Stock
              </span>
            ) : (
              <>
                {product.badge && (
                  <span className="rounded-md bg-slate-900/85 dark:bg-amber-400 text-amber-300 dark:text-slate-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-2 py-0.5 shadow-md backdrop-blur-sm">
                    {product.badge}
                  </span>
                )}
                {discountVal > 0 && (
                  <span className="rounded-md bg-emerald-600/90 text-white font-black text-[9px] sm:text-[10px] tracking-wider px-2 py-0.5 shadow-md backdrop-blur-sm">
                    -{discountVal}%
                  </span>
                )}
              </>
            )}
          </div>

          {/* Top Right Floating Actions (Wishlist & Share) */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 z-10">
            {/* Wishlist Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-sm"
              title={wishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Icon
                name="Heart"
                className={`h-4 w-4 transition-colors duration-200 ${
                  wishlist ? "fill-rose-500 text-rose-500" : "text-slate-400 hover:text-rose-500 stroke-[1.8]"
                }`}
              />
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({
                    title: product.title,
                    url: window.location.origin + `/product/${product.slug}`,
                  }).catch(() => {});
                } else if (typeof navigator !== "undefined") {
                  navigator.clipboard.writeText(window.location.origin + `/product/${product.slug}`);
                }
              }}
              className="grid h-8 w-8 place-items-center rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 shadow-md hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer backdrop-blur-sm"
              title="Share Product"
            >
              <Icon name="Share2" className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 stroke-[1.8]" />
            </button>
          </div>

          {/* Quick-View Available Sizes Overlay on Hover */}
          <div className="absolute inset-x-2 bottom-2 z-10 hidden sm:flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 bg-slate-950/85 backdrop-blur-md rounded-xl py-1.5 px-2 text-[10px] font-bold text-white shadow-xl border border-white/10">
            <span className="text-amber-400 font-extrabold mr-1">Sizes:</span>
            {(product.sizes || ["S", "M", "L", "XL"]).map((sz) => (
              <span
                key={sz}
                className="rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-black uppercase text-slate-100 hover:bg-amber-400 hover:text-slate-950 transition cursor-pointer"
              >
                {sz}
              </span>
            ))}
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
          className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-300 ${added
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
