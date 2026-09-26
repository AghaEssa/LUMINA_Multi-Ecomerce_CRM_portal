"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Icon } from "@/components/common/Icons";
import { useWishlist } from "@/context/WishlistContext";
import { useCartContext } from "@/context/CartContext";

export function WishlistDrawer() {
  const { wishlistItems, isWishlistOpen, closeWishlist, removeFromWishlist } =
    useWishlist();
  const { addToCart } = useCartContext();

  // Lock background scroll when open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isWishlistOpen]);

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Blur Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeWishlist}
      />

      {/* Slide-over Right Panel Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10 z-50">
        <div className="w-screen max-w-md sm:max-w-lg bg-white dark:bg-[#111827] shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800 animate-slide-left">
          
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">❤️</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                My Wishlist
              </h2>
              <span className="rounded-full bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 shadow-xs">
                {wishlistItems.length} Items
              </span>
            </div>

            <button
              onClick={closeWishlist}
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition"
              aria-label="Close wishlist drawer"
            >
              <Icon name="X" className="h-5 w-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Content List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="h-20 w-20 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 text-3xl">
                  ❤️
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Your Wishlist is Empty
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                    Save items you love by clicking the heart icon on any product.
                  </p>
                </div>
                <button
                  onClick={closeWishlist}
                  className="mt-2 rounded-xl bg-slate-950 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 px-6 py-3 text-xs font-extrabold shadow transition"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlistItems.map((product) => (
                  <div
                    key={product.slug}
                    className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0">
                      {product.image.startsWith("data:") ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <span className="text-[9px] font-black uppercase text-slate-400">
                        {product.brand}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {product.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 dark:text-amber-300">
                          ${product.price}
                        </span>
                        <span className="text-[10px] text-amber-500 font-bold">
                          ★ {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          addToCart({ product, quantity: 1, openDrawer: true });
                          removeFromWishlist(product.slug);
                        }}
                        className="rounded-xl bg-[#ffb800] hover:bg-[#f5b000] text-slate-950 font-black text-[11px] px-3 py-2 shadow-xs transition flex items-center gap-1"
                        title="Move to cart"
                      >
                        <Icon name="ShoppingCart" className="h-3.5 w-3.5" />
                        <span>Move</span>
                      </button>

                      <button
                        onClick={() => removeFromWishlist(product.slug)}
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-2 rounded-xl transition"
                        title="Remove from wishlist"
                      >
                        <Icon name="Trash2" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
