"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Icon } from "@/components/common/Icons";
import { useCartContext, type ToastItem } from "@/context/CartContext";

function ToastCard({
  toast,
  onDismiss,
  onOpenCart,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
  onOpenCart: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0d1527]/95 dark:bg-[#0d1527]/95 text-white p-3.5 shadow-2xl border border-emerald-500/30 backdrop-blur-xl flex items-center justify-between gap-3 animate-slide-left transition-all duration-300 pointer-events-auto hover:border-emerald-400/50">
      {/* Left Section: Checkmark & Thumbnail */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
          <Icon name="Check" className="h-5 w-5 text-emerald-400 stroke-[2.5]" />
        </div>

        {/* Product Thumbnail */}
        {toast.itemImage && (
          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-white/10 hidden sm:block">
            {toast.itemImage.startsWith("data:") ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={toast.itemImage}
                alt={toast.itemTitle}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={toast.itemImage}
                alt={toast.itemTitle}
                fill
                className="object-cover"
                sizes="40px"
              />
            )}
          </div>
        )}

        {/* Message Text */}
        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
              Cart Updated
            </span>
          </div>
          <p className="text-xs font-bold text-slate-100 truncate max-w-[150px] sm:max-w-[180px]">
            {toast.itemTitle}
          </p>
        </div>
      </div>

      {/* Right Section: View Cart Button & Dismiss X */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenCart}
          className="rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1.5 text-[11px] font-black tracking-wide shadow transition flex items-center gap-1 active:scale-95"
        >
          <span>View Cart</span>
          <Icon name="ChevronRight" className="h-3 w-3" />
        </button>

        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white p-1 transition rounded-lg hover:bg-white/10"
          aria-label="Close notification"
        >
          <Icon name="X" className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom Progress Bar Animation */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500/20">
        <div className="h-full bg-emerald-400 animate-pulse" />
      </div>
    </div>
  );
}

export function CartToast() {
  const { toasts, hideToast, openCart } = useCartContext();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-24 sm:top-28 right-4 sm:right-6 z-[60] max-w-sm w-full flex flex-col gap-2.5 pointer-events-none transition-all duration-300">
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          toast={toast}
          onDismiss={hideToast}
          onOpenCart={() => {
            hideToast();
            openCart();
          }}
        />
      ))}
    </div>
  );
}
