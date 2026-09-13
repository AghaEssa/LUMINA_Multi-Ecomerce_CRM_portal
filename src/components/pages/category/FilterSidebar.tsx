"use client";

import { Icon } from "@/components/common/Icons";

export type FilterState = {
  minPrice: number;
  maxPrice: number;
  selectedBrands: string[];
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

  const handleRatingChange = (rating: number) => {
    onChange({ ...filters, minRating: rating });
  };

  return (
    <aside className="w-full space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900/90 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-ocean-50 text-ocean-600 dark:bg-ocean-950/60 dark:text-ocean-300">
            <Icon name="Filter" className="h-4 w-4" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Filters</h3>
          {activeCount > 0 && (
            <span className="rounded-full bg-ocean-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300 transition"
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
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
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
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
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
          className="w-full accent-ocean-600 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-semibold text-slate-400">
          <span>${filters.minPrice}</span>
          <span className="font-bold text-ocean-700 dark:text-ocean-300">Max: ${filters.maxPrice}</span>
        </div>
      </div>

      {/* Filter Section 2: Brand Selection */}
      {allBrands.length > 0 && (
        <div className="space-y-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Brands ({allBrands.length})
          </label>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {allBrands.map((brand) => {
              const isSelected = filters.selectedBrands.includes(brand);
              return (
                <label
                  key={brand}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition ${
                    isSelected
                      ? "bg-ocean-50 text-ocean-700 font-bold border border-ocean-200 dark:bg-ocean-950/80 dark:text-ocean-300 dark:border-ocean-800"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleBrand(brand)}
                      className="rounded text-ocean-600 focus:ring-ocean-500 h-4 w-4 accent-ocean-600"
                    />
                    <span>{brand}</span>
                  </div>
                  {isSelected && <Icon name="Check" className="h-3.5 w-3.5 text-ocean-600" />}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Section 3: Rating */}
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
                className={`flex items-center justify-center gap-1 rounded-xl py-2 px-2 text-xs font-bold transition border ${
                  isSelected
                    ? "bg-ocean-700 text-white border-ocean-700 shadow-md shadow-ocean-700/20"
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

    </aside>
  );
}
