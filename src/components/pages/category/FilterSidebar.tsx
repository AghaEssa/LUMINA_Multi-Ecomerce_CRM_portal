"use client";

import { Icon } from "@/components/common/Icons";

export type FilterState = {
  minPrice: number;
  maxPrice: number;
  selectedBrands: string[];
  selectedColors: string[];
  selectedSizes: string[];
  minRating: number;
  inStockOnly: boolean;
};

type FilterSidebarProps = {
  allBrands: string[];
  filters: FilterState;
  maxAvailablePrice: number;
  onChange: (updatedFilters: FilterState) => void;
  onReset: () => void;
  activeCount: number;
};

const COLOR_SWATCHES = [
  { name: "Black", hex: "#0f172a" },
  { name: "White", hex: "#ffffff", border: true },
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Red", hex: "#dc2626" },
  { name: "Emerald", hex: "#059669" },
  { name: "Beige", hex: "#d97706" },
  { name: "Slate", hex: "#475569" },
  { name: "Rose", hex: "#db2777" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"];

export function FilterSidebar({
  allBrands,
  filters,
  maxAvailablePrice,
  onChange,
  onReset,
  activeCount,
}: FilterSidebarProps) {
  const handlePriceChange = (min: number, max: number) => {
    onChange({ ...filters, minPrice: min, maxPrice: max });
  };

  const toggleBrand = (brand: string) => {
    const nextBrands = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter((b) => b !== brand)
      : [...filters.selectedBrands, brand];
    onChange({ ...filters, selectedBrands: nextBrands });
  };

  const toggleColor = (colorName: string) => {
    const nextColors = (filters.selectedColors || []).includes(colorName)
      ? (filters.selectedColors || []).filter((c) => c !== colorName)
      : [...(filters.selectedColors || []), colorName];
    onChange({ ...filters, selectedColors: nextColors });
  };

  const toggleSize = (sizeName: string) => {
    const nextSizes = (filters.selectedSizes || []).includes(sizeName)
      ? (filters.selectedSizes || []).filter((s) => s !== sizeName)
      : [...(filters.selectedSizes || []), sizeName];
    onChange({ ...filters, selectedSizes: nextSizes });
  };

  const handleRatingChange = (rating: number) => {
    onChange({ ...filters, minRating: rating });
  };

  return (
    <aside className="w-full space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/90 transition-colors duration-300">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300">
            <Icon name="Filter" className="h-4 w-4" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Filters</h3>
          {activeCount > 0 && (
            <span className="rounded-full bg-[#0284c7] px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Section 1: Price Range */}
      <div className="space-y-3">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Price Range
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] font-semibold text-slate-400">Min ($)</span>
            <input
              type="number"
              min={0}
              max={filters.maxPrice}
              value={filters.minPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value) || 0, filters.maxPrice)}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400">Max ($)</span>
            <input
              type="number"
              min={filters.minPrice}
              max={maxAvailablePrice || 1000}
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange(filters.minPrice, Number(e.target.value) || 1000)}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={maxAvailablePrice || 600}
          value={filters.maxPrice}
          onChange={(e) => handlePriceChange(filters.minPrice, Number(e.target.value))}
          className="w-full accent-[#0284c7] h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-semibold text-slate-400">
          <span>${filters.minPrice}</span>
          <span className="font-bold text-sky-700 dark:text-sky-300">Max: ${filters.maxPrice}</span>
        </div>
      </div>

      {/* Filter Section 2: Visual Color Swatches */}
      <div className="space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Colors
          </label>
          {filters.selectedColors?.length > 0 && (
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
              {filters.selectedColors.length} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {COLOR_SWATCHES.map((col) => {
            const isSelected = (filters.selectedColors || []).includes(col.name);
            return (
              <button
                key={col.name}
                type="button"
                onClick={() => toggleColor(col.name)}
                className={`group relative grid h-8 w-8 place-items-center rounded-full transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900 scale-110 shadow-md"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              >
                {col.border && (
                  <span className="absolute inset-0 rounded-full border border-slate-300 dark:border-slate-600 pointer-events-none" />
                )}
                {isSelected && (
                  <Icon
                    name="Check"
                    className={`h-4 w-4 stroke-[3] ${
                      col.name === "White" ? "text-slate-900" : "text-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Section 3: Boxed Size Indicators */}
      <div className="space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Sizes
          </label>
          {filters.selectedSizes?.length > 0 && (
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
              {filters.selectedSizes.length} selected
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {SIZE_OPTIONS.map((sz) => {
            const isSelected = (filters.selectedSizes || []).includes(sz);
            return (
              <button
                key={sz}
                type="button"
                onClick={() => toggleSize(sz)}
                className={`h-9 rounded-xl text-xs font-black transition border cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? "bg-[#0284c7] text-white border-[#0284c7] shadow-md shadow-sky-500/25 scale-[1.02]"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-sky-400"
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Section 4: Brand Selection */}
      {allBrands.length > 0 && (
        <div className="space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Brands ({allBrands.length})
          </label>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 no-scrollbar">
            {allBrands.map((brand) => {
              const isSelected = filters.selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition ${
                    isSelected
                      ? "bg-sky-50 text-sky-700 font-bold border border-sky-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleBrand(brand)}
                      className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4 accent-[#0284c7]"
                    />
                    <span>{brand}</span>
                  </div>
                  {isSelected && <Icon name="Check" className="h-3.5 w-3.5 text-sky-600" />}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Section 5: Rating */}
      <div className="space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Minimum Rating
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[0, 4.5, 4.8].map((rating) => {
            const isSelected = filters.minRating === rating;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingChange(rating)}
                className={`flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-xs font-bold transition border cursor-pointer ${
                  isSelected
                    ? "bg-[#0284c7] text-white border-[#0284c7] shadow-md shadow-sky-500/20"
                    : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span>{rating === 0 ? "All" : `${rating}+`}</span>
                {rating > 0 && <Icon name="Star" className="h-3 w-3 fill-amber-400 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Section 6: In Stock Toggle */}
      <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="h-4 w-4 rounded accent-[#0284c7]"
          />
        </label>
      </div>

    </aside>
  );
}
