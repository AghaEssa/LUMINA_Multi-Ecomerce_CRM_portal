"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/common/Icons";
import type { CategoryItem } from "@/lib/categories";
import type { ProductItem } from "@/lib/products";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  category?: CategoryItem;
  products?: ProductItem[];
  onSelectSubCategory?: (subCategory: string) => void;
  onSelectQuery?: (query: string) => void;
};

export function SearchModal({
  isOpen,
  onClose,
  categories,
  category,
  products = [],
  onSelectSubCategory,
  onSelectQuery,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [scopeMode, setScopeMode] = useState<"category" | "global">(
    category ? "category" : "global"
  );

  // Sync scopeMode when category changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setScopeMode(category ? "category" : "global");
      setQuery("");
    }
  }, [isOpen, category]);

  // Filter Products for current Category Scope
  const scopedProducts = useMemo(() => {
    if (!products || !products.length) return [];
    if (!query.trim()) return products.slice(0, 6);

    const q = query.toLowerCase();
    return products.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchSub = p.subCategory?.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      return matchTitle || matchBrand || matchSub || matchDesc;
    });
  }, [products, query]);

  // Filter Categories for Global Scope
  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;
    const q = query.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
    );
  }, [categories, query]);

  if (!isOpen) return null;

  // Filter Sub-Categories for current category
  const subCategories = category?.subCategories || [];

  // Handle Sub-Category chip click
  const handleChipClick = (sub: string) => {
    if (onSelectSubCategory) {
      onSelectSubCategory(sub);
    }
    onClose();
  };

  // Handle Product item click
  const handleProductClick = (prod: ProductItem) => {
    if (onSelectQuery) {
      onSelectQuery(prod.title);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-slate-950/75 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* Scope Indicator & Mode Switcher */}
        {category && (
          <div className="bg-[#06465c] dark:bg-[#0b1324] px-6 py-2 text-xs text-white flex items-center justify-between border-b border-white/10 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-bold"><span className="text-amber-300 uppercase font-extrabold">{category.name} Store</span>
              </span>
            </div>
          </div>
        )}

        {/* Search Input Box */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <Icon name="Search" className="h-6 w-6 text-ocean-600 dark:text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              category && scopeMode === "category"
                ? `Search ${category.name} items (e.g. jackets, shirts, Men's, Women's)...`
                : "Search all 8 categories & products..."
            }
            autoFocus
            className="w-full bg-transparent text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold mr-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white shrink-0"
          >
            <Icon name="X" className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Sub-Category Section Chips (When in Category Mode) */}
        {category && scopeMode === "category" && subCategories.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/40 px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">
              {category.name} Sections:
            </span>
            {subCategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleChipClick(sub)}
                className="shrink-0 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-ocean-700 hover:text-white transition shadow-sm"
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          
          {/* CATEGORY SCOPED SEARCH RESULTS */}
          {category && scopeMode === "category" ? (
            scopedProducts.length > 0 ? (
              <div className="space-y-2">
                <div className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{category.name} Products ({scopedProducts.length})</span>
                  <span>Click product to filter</span>
                </div>
                {scopedProducts.map((prod) => {
                  const isDataUri = prod.image?.startsWith("data:");
                  return (
                    <div
                      key={prod.slug}
                      onClick={() => handleProductClick(prod)}
                      className="flex items-center justify-between rounded-2xl p-3 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 p-1 shrink-0 border border-slate-200 dark:border-slate-700">
                          {isDataUri ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={prod.image}
                              alt={prod.title}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Image
                              src={prod.image}
                              alt={prod.title}
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase text-ocean-600 dark:text-ocean-400">
                              {prod.brand}
                            </span>
                            {prod.subCategory && (
                              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
                                {prod.subCategory}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-ocean-600 dark:group-hover:text-ocean-400">
                            {prod.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white">
                            ${prod.price}
                          </p>
                          <p className="text-[10px] font-bold text-amber-500 flex items-center justify-end gap-1">
                            ★ {prod.rating}
                          </p>
                        </div>
                        <Icon name="ChevronRight" className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-500">
                  No {category.name} items found matching &quot;{query}&quot;.
                </p>
                <button
                  onClick={() => setQuery("")}
                  className="mt-3 text-xs font-bold text-ocean-600 hover:underline"
                >
                  View all {category.name} items
                </button>
              </div>
            )
          ) : (
            /* GLOBAL CATEGORIES SEARCH RESULTS */
            filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-2xl p-3.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-ocean-50 dark:bg-ocean-900/60 text-ocean-600 dark:text-ocean-300">
                      <Icon name={cat.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-ocean-600 dark:group-hover:text-ocean-400">
                        {cat.name} Store
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {cat.description || "Curated multi-category collection"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-ocean-600 dark:text-ocean-400">
                    <span>{cat.badge || "Category"}</span>
                    <Icon name="ChevronRight" className="h-4 w-4" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-500">No categories found matching &quot;{query}&quot;.</p>
              </div>
            )
          )}

        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-3 text-xs text-slate-400 flex justify-between items-center">
          <span>Press ESC or click close to dismiss</span>
          <span className="font-semibold text-ocean-600 dark:text-ocean-400">
            {category && scopeMode === "category"
              ? `${category.name} Store Engine`
              : "LUMINA Multi-Category Engine"}
          </span>
        </div>

      </div>
    </div>
  );
}
