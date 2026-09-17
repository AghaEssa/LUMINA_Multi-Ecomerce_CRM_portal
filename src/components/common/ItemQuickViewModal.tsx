"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { useCartContext, type CartItem } from "@/context/CartContext";

interface ItemQuickViewModalProps {
  item: CartItem | null;
  onClose: () => void;
}

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

export function ItemQuickViewModal({ item, onClose }: ItemQuickViewModalProps) {
  const { updateQuantity, removeFromCart } = useCartContext();
  const [selectedSize, setSelectedSize] = useState<string>(item?.size || "M");

  if (!item) return null;

  const currentTotal = item.price * item.quantity;

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-scale-up">
        {/* Close Button Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Item Inspector
            </h3>
          </div>

          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Product Image Box */}
            <div className="sm:col-span-5 relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 group shadow-inner">
              {item.image.startsWith("data:") ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="240px"
                />
              )}
              <div className="absolute top-2 left-2 rounded-lg bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 shadow-sm">
                IN STOCK
              </div>
            </div>

            {/* Product Info */}
            <div className="sm:col-span-7 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-ocean-700 dark:text-amber-400 bg-ocean-50 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-ocean-200 dark:border-amber-400/20">
                  {item.categoryName || "Curated Essential"}
                </span>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Icon name="Building2" className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-semibold">{item.vendor || "Lumina Premium Store"}</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-xl font-black text-slate-900 dark:text-amber-300">
                  ${currentTotal.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  (${item.price.toFixed(2)} / unit)
                </span>
              </div>

              {/* Size Variant Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Selected Size:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-black">{selectedSize}</span>
                </label>
                <div className="flex items-center gap-2">
                  {AVAILABLE_SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-8 min-w-[36px] rounded-xl text-xs font-black transition ${
                        selectedSize === size
                          ? "bg-slate-950 dark:bg-amber-400 text-white dark:text-slate-950 shadow"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-1">
                    <button
                      onClick={handleDecrease}
                      className="grid h-7 w-7 place-items-center rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition shadow-xs text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-black text-slate-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="grid h-7 w-7 place-items-center rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition shadow-xs text-sm"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs text-slate-400">
                    Total: <strong className="text-slate-800 dark:text-slate-200">${currentTotal.toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights & Guarantees */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 p-3.5 grid grid-cols-3 gap-2 text-center">
            <div className="space-y-0.5">
              <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">100% Authentic</div>
              <div className="text-[10px] text-slate-400">Guaranteed Brand</div>
            </div>
            <div className="space-y-0.5 border-x border-slate-200 dark:border-slate-800">
              <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Express 24h</div>
              <div className="text-[10px] text-slate-400">Fast Shipping</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">30-Day Easy</div>
              <div className="text-[10px] text-slate-400">Hassle Free Return</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleRemove}
            className="flex items-center gap-1.5 text-xs font-extrabold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition"
          >
            <Icon name="Trash2" className="h-4 w-4" />
            <span>Remove Item</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2.5 transition flex items-center gap-1"
            >
              <span>Full Cart Page</span>
              <Icon name="ExternalLink" className="h-3.5 w-3.5 text-slate-400" />
            </Link>

            <button
              onClick={onClose}
              className="rounded-xl bg-slate-950 dark:bg-amber-400 hover:bg-slate-800 dark:hover:bg-amber-300 text-white dark:text-slate-950 text-xs font-extrabold px-5 py-2.5 shadow transition"
            >
              Done & Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
