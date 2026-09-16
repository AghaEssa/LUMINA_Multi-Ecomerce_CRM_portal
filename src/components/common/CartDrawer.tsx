"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Icon } from "@/components/common/Icons";
import { useCartContext } from "@/context/CartContext";

export function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    subtotal,
    removeFromCart,
    updateQuantity,
  } = useCartContext();

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Blurred Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={closeCart}
      />

      {/* Slide-over Right Side Panel Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
        <div className="w-screen max-w-md bg-white dark:bg-[#111827] shadow-2xl flex flex-col h-full border-l border-slate-200/80 dark:border-slate-800 animate-slide-left">
          
          {/* Cart Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800/80">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Cart
            </h2>
            <button
              onClick={closeCart}
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition"
              aria-label="Close cart drawer"
            >
              <Icon name="X" className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Content - Scrollable Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Icon name="ShoppingCart" className="h-10 w-10 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                    Looks like you haven&apos;t added any items to your cart yet.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-2 rounded-xl bg-[#075570] hover:bg-[#06465c] text-white px-6 py-2.5 text-xs font-bold shadow transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800/90 p-4 bg-white dark:bg-slate-900/90 shadow-sm space-y-3.5 transition hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Top Item Row: Image, Title, Vendor, Variant, Trash button */}
                  <div className="flex items-start gap-3.5">
                    
                    {/* Thumbnail Image */}
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0">
                      {item.image.startsWith("data:") ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>

                    {/* Product Metadata */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.title}
                        </h4>
                        
                        {/* Red Trash Delete Icon */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1 rounded-lg transition shrink-0"
                          title="Remove item"
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Store / Vendor Label */}
                      <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                        <Icon name="Building2" className="h-3 w-3" />
                        <span>{item.vendor || "John Enterprise"}</span>
                      </div>

                      {/* Option / Variant */}
                      {item.size && (
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Size: <span className="font-extrabold text-slate-800 dark:text-slate-200">{item.size}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Display */}
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Bottom Row: Quantity Stepper & Golden Customize Link */}
                  <div className="flex items-center justify-between pt-1">
                    
                    {/* Stepper Controls: - 1 + */}
                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-5 w-5 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                      >
                        -
                      </button>
                      <span className="w-5 text-center text-xs font-black text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-5 w-5 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Golden "Customize >" Action Link */}
                    <button className="text-xs font-extrabold text-amber-500 hover:text-amber-600 flex items-center gap-0.5 transition hover:underline">
                      <span>Customize</span>
                      <Icon name="ChevronRight" className="h-3.5 w-3.5" />
                    </button>

                  </div>

                </div>
              ))
            )}
          </div>

          {/* Cart Footer Section */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 p-6 space-y-4 bg-white dark:bg-[#111827]">
              
              {/* Subtotal Display Row */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Subtotal
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Yellow Full-Width Checkout Button */}
              <button
                className="w-full rounded-2xl bg-[#ffb800] hover:bg-[#f5b000] active:scale-[0.99] py-3.5 px-4 text-center font-extrabold text-slate-950 text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Login to checkout</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
