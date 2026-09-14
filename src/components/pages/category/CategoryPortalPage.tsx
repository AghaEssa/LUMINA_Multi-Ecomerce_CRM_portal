"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/common/Header";
import { FilterSidebar, type FilterState } from "@/components/pages/category/FilterSidebar";
import { ProductCard } from "@/components/common/ProductCard";
import { SearchModal } from "@/components/common/SearchModal";
import { ProductDetailsModal } from "@/components/common/ProductDetailsModal";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";
import type { CategoryItem } from "@/lib/categories";
import type { ProductItem } from "@/lib/products";
import { useCart } from "@/hooks/useCart";

type CategoryPortalPageProps = {
  category: CategoryItem;
  categories: CategoryItem[];
  products: ProductItem[];
};

type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export function CategoryPortalPage({
  category,
  categories,
  products,
}: CategoryPortalPageProps) {
  const router = useRouter();
  const { cartCount, addToCart } = useCart(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<"storefront" | "sections" | "trending" | "brands">("storefront");
  const [selectedProductModal, setSelectedProductModal] = useState<ProductItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid2" | "scroll" | "grid1">("grid2");

  // Sub-categories list fallback
  const subCategories = useMemo(() => {
    if (category.subCategories && category.subCategories.length > 0) {
      return category.subCategories;
    }
    const extracted = Array.from(
      new Set(products.map((p) => p.subCategory).filter(Boolean) as string[])
    );
    return ["All", ...extracted];
  }, [category, products]);

  // Extract unique brands for filtering
  const allBrands = useMemo(() => {
    const brands = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
    return brands.sort();
  }, [products]);

  // Determine max price available
  const maxAvailablePrice = useMemo(() => {
    if (!products.length) return 600;
    return Math.max(...products.map((p) => p.price)) || 600;
  }, [products]);

  // Initial Filter State
  const initialFilterState: FilterState = useMemo(
    () => ({
      minPrice: 0,
      maxPrice: maxAvailablePrice,
      selectedBrands: [],
      minRating: 0,
      inStockOnly: false,
    }),
    [maxAvailablePrice]
  );

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Handle Top Category Navbar Link Clicks
  const handleNavClick = (key: "storefront" | "sections" | "trending" | "brands") => {
    setActiveNavTab(key);
    if (key === "storefront") {
      setActiveSubCategory("All");
      setSearchQuery("");
      const hero = document.getElementById("category-hero");
      if (hero) hero.scrollIntoView({ behavior: "smooth" });
    } else if (key === "sections") {
      const sections = document.getElementById("sections-bar");
      if (sections) sections.scrollIntoView({ behavior: "smooth" });
    } else if (key === "trending") {
      const grid = document.getElementById("catalog-grid");
      if (grid) grid.scrollIntoView({ behavior: "smooth" });
    } else if (key === "brands") {
      setMobileFilterOpen(true);
      const sidebar = document.getElementById("filter-sidebar");
      if (sidebar) sidebar.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeNavTab === "trending") count++;
    if (activeSubCategory !== "All") count++;
    if (filters.minPrice > 0) count++;
    if (filters.maxPrice < maxAvailablePrice) count++;
    if (filters.selectedBrands.length > 0) count += filters.selectedBrands.length;
    if (filters.minRating > 0) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [filters, maxAvailablePrice, activeSubCategory, searchQuery, activeNavTab]);

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: maxAvailablePrice,
      selectedBrands: [],
      minRating: 0,
      inStockOnly: false,
    });
    setSearchQuery("");
    setActiveSubCategory("All");
    setActiveNavTab("storefront");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((prod) => {
        // Nav tab Trending Filter (when "Trending" is selected in top navbar)
        if (activeNavTab === "trending") {
          const b = prod.badge?.toLowerCase() || "";
          const isTrending =
            b.includes("trending") ||
            b.includes("best seller") ||
            b.includes("popular") ||
            b.includes("luxury") ||
            b.includes("exclusive") ||
            prod.rating >= 4.8;
          if (!isTrending) return false;
        }

        // Subcategory Filter
        if (activeSubCategory !== "All") {
          if (
            !prod.subCategory ||
            prod.subCategory.toLowerCase() !== activeSubCategory.toLowerCase()
          ) {
            return false;
          }
        }
        // Price Filter
        if (prod.price < filters.minPrice || prod.price > filters.maxPrice) return false;
        // Brand Filter
        if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(prod.brand)) {
          return false;
        }
        // Rating Filter
        if (filters.minRating > 0 && prod.rating < filters.minRating) return false;
        // In Stock Filter
        if (filters.inStockOnly && !prod.inStock) return false;

        // Text Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = prod.title.toLowerCase().includes(q);
          const matchesBrand = prod.brand.toLowerCase().includes(q);
          const matchesSub = prod.subCategory?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesBrand && !matchesSub) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === "price-asc") return a.price - b.price;
        if (sortOption === "price-desc") return b.price - a.price;
        if (sortOption === "rating") return b.rating - a.rating;
        return 0;
      });
  }, [products, filters, activeSubCategory, searchQuery, sortOption, activeNavTab]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Dynamic Header for Category Page */}
      <SiteHeader
        cartCount={cartCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        category={category}
        activeNav={activeNavTab}
        onNavClick={handleNavClick}
      />

      {/* Category Hero Header Banner */}
      <section
        id="category-hero"
        className="relative overflow-hidden bg-gradient-to-br from-[#075570] via-[#06465c] to-[#042d3c] dark:from-[#0d1527] dark:via-[#111827] dark:to-[#090d16] text-white py-10 lg:py-14 shadow-xl border-b dark:border-slate-800"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headline & Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-amber-300 shadow-xl backdrop-blur-md ring-2 ring-white/20">
                  <Icon name={category.icon} className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-amber-400 text-ocean-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 shadow-sm">
                  {activeNavTab === "trending" ? `🔥 ${category.name} Trending` : category.badge || "Curated Collection"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                LUMINA <span className="text-amber-300">{category.name}</span> Store
              </h1>

              <p className="text-sm sm:text-base text-ocean-100/90 leading-relaxed max-w-2xl">
                {activeNavTab === "trending"
                  ? `Showing all top-rated, best-selling and trending products in the ${category.name} collection.`
                  : category.bannerTagline || category.description || `Explore our dedicated ${category.name} storefront collection.`}
              </p>

              {/* Micro Features Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-ocean-200">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Icon name="Check" className="h-4 w-4 text-emerald-400" /> 100% Authentic
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Icon name="Check" className="h-4 w-4 text-emerald-400" /> Express 24h Dispatch
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  <Icon name="Check" className="h-4 w-4 text-emerald-400" /> 30-Day Easy Returns
                </span>
              </div>
            </div>

            {/* Right Column: Premium Layered 3D Showcase */}
            <div className="lg:col-span-5 relative group flex justify-center lg:justify-end">
              <div className="absolute -inset-4 rounded-full bg-amber-400/25 blur-3xl opacity-70 " />

              <div className="relative w-full max-w-md lg:max-w-none overflow-hidden rounded-3xl border-2 border-white/30 bg-ocean-950/60 shadow-2xl shadow-black/50">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <NextImage
                    src={category.heroImage || category.image || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop"}
                    alt={`${category.name} Flagship Showcase`}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#042d3c] via-slate-950/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#075570]/60 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <span className="rounded-full bg-slate-950/70 backdrop-blur-md text-amber-300 font-bold text-[10px] uppercase tracking-wider px-3 py-1 border border-white/20 shadow-md">
                      UP TO 40% OFF
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 p-3.5 backdrop-blur-xl border border-white/30 shadow-2xl flex items-center justify-between z-10">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                          {category.name} Premium Edition
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {category.itemCount || 50}+ Curated Flagship Items Active
                      </p>
                    </div>

                    <span className="rounded-xl bg-amber-400 hover:bg-amber-500 px-3.5 py-2 text-[10px] font-black text-ocean-950 uppercase tracking-widest shadow-md transition cursor-pointer shrink-0">
                      EXPLORE
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Sub-Categories Bar */}
      <nav
        id="sections-bar"
        className="sticky top-0 z-30 bg-white/95 dark:bg-[#0b1324]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors duration-300"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
            {subCategories.map((sub) => {
              const isActive = activeSubCategory.toLowerCase() === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  onClick={() => {
                    setActiveSubCategory(sub);
                    if (activeNavTab === "trending") setActiveNavTab("storefront");
                  }}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-all duration-200 ${
                    isActive
                      ? "bg-[#075570] text-white shadow-md shadow-ocean-700/20 scale-105 ring-2 ring-ocean-400"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Top Control Bar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="relative flex-grow max-w-md">
              <Icon name="Search" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search within ${category.name} store...`}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Icon name="X" className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-wrap">
              {/* Mobile View Toggle Buttons */}
              <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode("grid2")}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1 ${
                    viewMode === "grid2"
                      ? "bg-white dark:bg-slate-900 text-ocean-700 dark:text-amber-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                  title="2-Column Grid (Compact View)"
                >
                  <span>田 2 Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("scroll")}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition flex items-center gap-1 ${
                    viewMode === "scroll"
                      ? "bg-white dark:bg-slate-900 text-ocean-700 dark:text-amber-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                  title="Horizontal Scrollable Row"
                >
                  <span>↔️ Swipe</span>
                </button>
              </div>

              <button
                onClick={() => setMobileFilterOpen((prev) => !prev)}
                className="lg:hidden flex items-center gap-2 rounded-2xl bg-[#075570] text-white px-3.5 py-2 text-xs font-bold shadow"
              >
                <Icon name="Filter" className="h-4 w-4" />
                <span>Filter ({activeFilterCount})</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-ocean-500 cursor-pointer"
                >
                  <option value="featured">Featured Selection</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

          </div>

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2 bg-slate-100/80 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Active Selection ({filteredProducts.length} items):
              </span>

              {activeNavTab === "trending" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-ocean-950 px-3 py-1 text-xs font-black">
                  Mode: {category.name} Trending
                  <button onClick={() => setActiveNavTab("storefront")}>
                    <Icon name="X" className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {activeSubCategory !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 dark:bg-ocean-950 px-3 py-1 text-xs font-bold text-ocean-800 dark:text-ocean-200 border border-ocean-200 dark:border-ocean-800">
                  Section: {activeSubCategory}
                  <button onClick={() => setActiveSubCategory("All")}>
                    <Icon name="X" className="h-3.5 w-3.5 text-ocean-600" />
                  </button>
                </span>
              )}

              {filters.maxPrice < maxAvailablePrice && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 dark:bg-ocean-950 px-3 py-1 text-xs font-bold text-ocean-800 dark:text-ocean-200 border border-ocean-200 dark:border-ocean-800">
                  Under ${filters.maxPrice}
                  <button onClick={() => setFilters({ ...filters, maxPrice: maxAvailablePrice })}>
                    <Icon name="X" className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {filters.selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 dark:bg-ocean-950 px-3 py-1 text-xs font-bold text-ocean-800 dark:text-ocean-200 border border-ocean-200 dark:border-ocean-800"
                >
                  {brand}
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        selectedBrands: filters.selectedBrands.filter((b) => b !== brand),
                      })
                    }
                  >
                    <Icon name="X" className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}

              {filters.minRating > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ocean-100 dark:bg-ocean-950 px-3 py-1 text-xs font-bold text-ocean-800 dark:text-ocean-200 border border-ocean-200 dark:border-ocean-800">
                  {filters.minRating}+ Stars
                  <button onClick={() => setFilters({ ...filters, minRating: 0 })}>
                    <Icon name="X" className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-500 hover:underline ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Desktop & Mobile Product Grid */}
          <div id="catalog-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div id="filter-sidebar" className="hidden lg:block lg:col-span-3 sticky top-14 z-20">
              <FilterSidebar
                allBrands={allBrands}
                filters={filters}
                maxAvailablePrice={maxAvailablePrice}
                onChange={setFilters}
                onReset={handleResetFilters}
                activeCount={activeFilterCount}
              />
            </div>

            {mobileFilterOpen && (
              <div className="lg:hidden mb-6">
                <FilterSidebar
                  allBrands={allBrands}
                  filters={filters}
                  maxAvailablePrice={maxAvailablePrice}
                  onChange={setFilters}
                  onReset={handleResetFilters}
                  activeCount={activeFilterCount}
                />
              </div>
            )}

            <div className="lg:col-span-9">
              {filteredProducts.length > 0 ? (
                viewMode === "scroll" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Horizontal browse ({filteredProducts.length} items):
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-500 animate-pulse">
                        ← Swipe Left/Right →
                      </span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 snap-x snap-mandatory scroll-smooth">
                      {filteredProducts.map((prod) => (
                        <div key={prod.slug} className="w-[170px] sm:w-[220px] shrink-0 snap-start">
                          <ProductCard
                            product={prod}
                            onAddToCart={() => addToCart(1)}
                             
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2.5 sm:gap-6">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.slug}
                        product={prod}
                        onAddToCart={() => addToCart(1)}
                        onOpenDetails={(p) => setSelectedProductModal(p)}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ocean-50 text-ocean-600 dark:bg-ocean-950 dark:text-ocean-300">
                    <Icon name="Search" className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                    No products match your active selection
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Try selecting a different section or resetting filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-5 rounded-2xl bg-[#075570] text-white px-6 py-2.5 text-xs font-bold shadow hover:bg-[#06465c] transition"
                  >
                    Reset All Selection & Filters
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categories={categories}
        category={category}
        products={products}
        onSelectSubCategory={(sub) => {
          setActiveSubCategory(sub);
          const grid = document.getElementById("catalog-grid");
          if (grid) grid.scrollIntoView({ behavior: "smooth" });
        }}
        onSelectQuery={(q) => {
          setSearchQuery(q);
          const grid = document.getElementById("catalog-grid");
          if (grid) grid.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
