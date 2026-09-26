"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/common/Icons";
import { useCartContext, type CartItem } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ItemQuickViewModal } from "@/components/common/ItemQuickViewModal";

const CATEGORY_META: Record<string, { name: string; icon: string }> = {
  clothes: { name: "Clothes", icon: "Shirt" },
  furniture: { name: "Furniture", icon: "Armchair" },
  utensils: { name: "Utensils", icon: "Utensils" },
  medical: { name: "Medical", icon: "Stethoscope" },
  cosmetics: { name: "Cosmetics", icon: "Sparkles" },
  food: { name: "Food & Pantry", icon: "Apple" },
  "smart-devices": { name: "Smart Devices", icon: "Smartphone" },
  vehicles: { name: "Vehicles & Tech", icon: "Car" },
  shoes: { name: "Footwear", icon: "Shirt" },
};

export function CartDrawer() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    subtotal,
    removeFromCart,
    updateQuantity,
    saveForLater,
  } = useCartContext();

  const [viewLayout, setViewLayout] = useState<"grid" | "stack">("grid");
  const [inspectingItem, setInspectingItem] = useState<CartItem | null>(null);

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

  // Group items dynamically by Category
  const groupedCart = useMemo(() => {
    const groups: Record<
      string,
      {
        slug: string;
        name: string;
        icon: string;
        items: CartItem[];
        groupSubtotal: number;
        groupCount: number;
      }
    > = {};

    cartItems.forEach((item) => {
      const slug = item.categorySlug || "general";
      const meta = CATEGORY_META[slug] || {
        name: item.categoryName || "General",
        icon: "Package",
      };

      if (!groups[slug]) {
        groups[slug] = {
          slug,
          name: meta.name,
          icon: meta.icon,
          items: [],
          groupSubtotal: 0,
          groupCount: 0,
        };
      }

      groups[slug].items.push(item);
      groups[slug].groupSubtotal += item.price * item.quantity;
      groups[slug].groupCount += item.quantity;
    });

    return Object.values(groups);
  }, [cartItems]);

  if (!isCartOpen) return null;

  const isMultiCategory = groupedCart.length > 1;
  const categoryCount = groupedCart.length;

  // Determine grid column layout based on number of categories
  let gridColClass = "grid-cols-1";
  if (viewLayout === "grid" && isMultiCategory) {
    if (categoryCount >= 5) {
      gridColClass = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    } else {
      gridColClass = "grid-cols-1 sm:grid-cols-2";
    }
  }

  // Determine drawer container width dynamically
  let drawerWidthClass = "max-w-xl sm:max-w-[580px]";
  if (viewLayout === "grid" && isMultiCategory) {
    if (categoryCount >= 5) {
      drawerWidthClass = "max-w-2xl sm:max-w-3xl lg:max-w-4xl";
    } else {
      drawerWidthClass = "max-w-2xl sm:max-w-3xl";
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Blurred Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={closeCart}
      />

      {/* Slide-over Right Side Panel Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10 z-50">
        <div className={`w-screen ${drawerWidthClass} bg-white dark:bg-[#111827] shadow-2xl flex flex-col h-full border-l border-slate-200/80 dark:border-slate-800 transition-all duration-300 animate-slide-left`}>
          
          {/* Cart Drawer Top Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight shrink-0">
                Shopping Cart
              </h2>
              <span className="rounded-full bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 shadow-xs whitespace-nowrap shrink-0">
                {cartItems.length} {cartItems.length === 1 ? "Product" : "Products"}
              </span>
              {isMultiCategory && (
                <span className="text-[11px] font-bold text-sky-700 dark:text-amber-300 bg-sky-50 dark:bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-amber-400/20 whitespace-nowrap hidden sm:inline-flex items-center gap-1 shrink-0">
                  <span>📁</span>
                  <span>{categoryCount} {categoryCount === 1 ? "Category" : "Categories"}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Layout Switcher (Grid vs Stack) */}
              {isMultiCategory && (
                <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setViewLayout("grid")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black transition whitespace-nowrap ${
                      viewLayout === "grid"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-400 shadow-xs"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                    title="view"
                  >
                    <Icon name="Grid" className="h-3 w-3" />
                    <span>Grid</span>
                  </button>
                  <button
                    onClick={() => setViewLayout("stack")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black transition whitespace-nowrap ${
                      viewLayout === "stack"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-amber-400 shadow-xs"
                        : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                    title="view"
                  >
                    <Icon name="List" className="h-3 w-3" />
                    <span>List</span>
                  </button>
                </div>
              )}

              <button
                onClick={closeCart}
                className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition shrink-0"
                aria-label="Close cart drawer"
              >
                <Icon name="X" className="h-5 w-5 stroke-[2.2]" />
              </button>
            </div>
          </div>

          {/* Cart Scrollable Content with Masonry Categorized Container Cards */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                    Explore products across 8 curated categories and add them to your bucket.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white px-6 py-3 text-xs font-extrabold shadow transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              /* True Masonry Dense Column Layout for Categories */
              <div
                className={
                  viewLayout === "grid" && isMultiCategory
                    ? categoryCount >= 5
                      ? "columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
                      : "columns-1 sm:columns-2 gap-4 space-y-4"
                    : "space-y-4"
                }
              >
                {groupedCart.map((group) => (
                  /* Category Group Box Container Card (break-inside-avoid prevents split cards across columns) */
                  <div
                    key={group.slug}
                    className="break-inside-avoid inline-block w-full rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-4 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    {/* Category Header inside Box */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="grid h-7 w-7 place-items-center rounded-xl bg-[#0284c7] text-white shadow-sm shrink-0">
                          <Icon name={group.icon} className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white truncate">
                            {group.name}
                          </h3>
                          <p className="text-[10px] text-slate-400 font-semibold">
                            {group.items.length} {group.items.length === 1 ? "product" : "products"}
                            {group.groupCount > group.items.length ? ` • ${group.groupCount} units` : ""}
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-black text-slate-900 dark:text-amber-300 bg-white dark:bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs shrink-0 ml-2">
                        ${group.groupSubtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Items inside this Category Box */}
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 bg-white dark:bg-slate-900/90 shadow-sm space-y-2.5 transition hover:border-slate-300 dark:hover:border-slate-700 group/card"
                        >
                          {/* Top Item Row: Image, Title, Brand, Quick View & Remove */}
                          <div className="flex items-start gap-3">
                            {/* Clickable Thumbnail Image (Triggers Quick-View Modal) */}
                            <button
                              onClick={() => setInspectingItem(item)}
                              className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shrink-0 group/img cursor-pointer"
                              title="Click to view details"
                            >
                              {item.image.startsWith("data:") ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="h-full w-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover group-hover/img:scale-110 transition-transform duration-300"
                                  sizes="56px"
                                />
                              )}
                              <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Icon name="Eye" className="h-4 w-4 drop-shadow" />
                              </div>
                            </button>

                            {/* Product Title & Vendor */}
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-start justify-between gap-1">
                                <button
                                  onClick={() => setInspectingItem(item)}
                                  className="text-left text-xs font-bold text-slate-900 dark:text-white hover:text-ocean-700 dark:hover:text-amber-400 line-clamp-1 transition cursor-pointer"
                                  title="Click to inspect item"
                                >
                                  {item.title}
                                </button>

                                {/* Action Buttons: Quick View Eye + Save for Later Bookmark + Red Delete Trash */}
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => setInspectingItem(item)}
                                    className="text-slate-400 hover:text-ocean-700 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-1 rounded-lg transition"
                                    title="Quick item inspector detail"
                                  >
                                    <Icon name="Eye" className="h-3.5 w-3.5" />
                                  </button>

                                  <button
                                    onClick={() => saveForLater(item.id)}
                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 p-1 rounded-lg transition"
                                    title="Save for later"
                                  >
                                    <Icon name="Bookmark" className="h-3.5 w-3.5" />
                                  </button>

                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 p-1 rounded-lg transition"
                                    title="Remove item"
                                  >
                                    <Icon name="Trash2" className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Vendor / Brand Label */}
                              <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                                <Icon name="Building2" className="h-3 w-3" />
                                <span className="truncate">{item.vendor || "John Enterprise"}</span>
                              </div>

                              {/* Size Variant Label */}
                              {item.size && (
                                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                  Size: <span className="font-bold text-slate-800 dark:text-slate-200">{item.size}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Pricing Display & Quantity Stepper */}
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                            <div className="text-xs font-black text-slate-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                              {item.quantity > 1 && (
                                <span className="text-[9px] text-slate-400 font-semibold ml-1">
                                  (${item.price.toFixed(2)})
                                </span>
                              )}
                            </div>

                            {/* Quantity Stepper Controls (- 1 +) */}
                            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-4 w-4 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs"
                                title="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="w-3 text-center text-xs font-black text-slate-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-4 w-4 rounded flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition text-xs"
                                title="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer Section */}
          {cartItems.length > 0 && (
            <div className="border-t border-slate-100 dark:border-slate-800 p-5 sm:p-6 space-y-4 bg-white dark:bg-[#111827]">
              
              {/* Subtotal Display Row */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    Grand Subtotal
                  </span>
                  <p className="text-[10px] text-slate-400">Taxes & shipping calculated at checkout</p>
                </div>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons: Full Cart Page & Checkout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200 text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Full Cart Overview</span>
                  <Icon name="ExternalLink" className="h-3.5 w-3.5 text-slate-400" />
                </Link>

                <button
                  onClick={() => {
                    closeCart();
                    if (user) {
                      router.push("/checkout");
                    } else {
                      router.push("/login?callbackUrl=/checkout");
                    }
                  }}
                  className="rounded-2xl bg-[#ffb800] hover:bg-[#f5b000] active:scale-[0.99] py-3.5 px-4 text-center font-extrabold text-slate-950 text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{user ? "Proceed to Checkout" : "Login to Checkout"}</span>
                  <Icon name="ArrowRight" className="h-4 w-4 stroke-[2.2]" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Item Inline Quick-View Modal */}
      {inspectingItem && (
        <ItemQuickViewModal
          item={inspectingItem}
          onClose={() => setInspectingItem(null)}
        />
      )}
    </div>
  );
}
