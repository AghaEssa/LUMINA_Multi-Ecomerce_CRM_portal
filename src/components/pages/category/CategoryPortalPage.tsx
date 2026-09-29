"use client";

import { useState, useMemo, useEffect } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/common/Header";
import { FilterSidebar, type FilterState } from "@/components/pages/category/FilterSidebar";
import { ProductCard } from "@/components/common/ProductCard";
import { SearchModal } from "@/components/common/SearchModal";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";
import type { CategoryItem } from "@/lib/categories";
import type { ProductItem } from "@/lib/products";
import { useCart } from "@/hooks/useCart";

const CATEGORY_SLIDES: Record<string, string[]> = {
  clothing: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop",
  ],
  clothes: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1000&auto=format&fit=crop",
  ],
  furniture: [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000&auto=format&fit=crop",
  ],
  electronics: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1000&auto=format&fit=crop",
  ],
  "smart-devices": [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1000&auto=format&fit=crop",
  ],
  cosmetics: [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1000&auto=format&fit=crop",
  ],
  medical: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631815588090-d4bfec5b1cdb?w=1000&auto=format&fit=crop",
  ],
  food: [
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506617420156-8e4536971650?w=1000&auto=format&fit=crop",
  ],
  vehicles: [
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&auto=format&fit=crop",
  ],
  utensils: [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514986888952-8cd320577b68?w=1000&auto=format&fit=crop",
  ],
};

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
  const [viewMode, setViewMode] = useState<"grid2" | "scroll" | "grid1">("grid2");
  const [heroImageIdx, setHeroImageIdx] = useState(0);

  // Pagination "Load More" state
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const categorySlides = useMemo(() => {
    const slug = category.slug.toLowerCase();
    if (CATEGORY_SLIDES[slug]) return CATEGORY_SLIDES[slug];
    if (category.heroImage || category.image) {
      return [category.heroImage || category.image!];
    }
    return ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop"];
  }, [category]);

  useEffect(() => {
    if (categorySlides.length <= 1) return;
    const timer = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % categorySlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [categorySlides]);

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
      selectedColors: [],
      selectedSizes: [],
      minRating: 0,
      inStockOnly: false,
    }),
    [maxAvailablePrice]
  );

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Reset pagination when filters, subcategories, or search change
  useEffect(() => {
    setVisibleCount(12);
  }, [filters, activeSubCategory, searchQuery, sortOption, activeNavTab]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeNavTab === "trending") count++;
    if (activeSubCategory !== "All") count++;
    if (filters.minPrice > 0) count++;
    if (filters.maxPrice < maxAvailablePrice) count++;
    if (filters.selectedBrands.length > 0) count += filters.selectedBrands.length;
    if (filters.selectedColors?.length > 0) count += filters.selectedColors.length;
    if (filters.selectedSizes?.length > 0) count += filters.selectedSizes.length;
    if (filters.minRating > 0) count++;
    if (filters.inStockOnly) count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [filters, maxAvailablePrice, activeSubCategory, searchQuery, activeNavTab]);

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: maxAvailablePrice,
      selectedBrands: [],
      selectedColors: [],
      selectedSizes: [],
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
        // Nav tab Trending Filter
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

        // Color Filter
        if (filters.selectedColors && filters.selectedColors.length > 0) {
          const prodColors = (prod.colors || []).map((c) => c.name.toLowerCase());
          const prodTags = (prod.tags || []).map((t) => t.toLowerCase());
          const prodTitle = prod.title.toLowerCase();
          const matchesColor = filters.selectedColors.some((sc) => {
            const scLower = sc.toLowerCase();
            return (
              prodColors.includes(scLower) ||
              prodTags.includes(scLower) ||
              prodTitle.includes(scLower)
            );
          });
          if (!matchesColor) return false;
        }

        // Size Filter
        if (filters.selectedSizes && filters.selectedSizes.length > 0) {
          const prodSizes = (prod.sizes || ["S", "M", "L", "XL"]).map((s) => s.toUpperCase());
          const prodTags = (prod.tags || []).map((t) => t.toUpperCase());
          const matchesSize = filters.selectedSizes.some((ss) => {
            const ssUpper = ss.toUpperCase();
            return prodSizes.includes(ssUpper) || prodTags.includes(ssUpper);
          });
          if (!matchesSize) return false;
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

  // Displayed products based on "Load More" pagination
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 12);
      setIsLoadingMore(false);
    }, 400);
  };

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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Site Header */}
      <SiteHeader
        cartCount={cartCount}
        onOpenSearch={() => setIsSearchOpen(true)}
        category={category}
        activeNav={activeNavTab}
        onNavClick={handleNavClick}
      />

      {/* Dynamic Category Banner with Breadcrumbs inside top left */}
      <section
        id="category-hero"
        className="relative overflow-hidden bg-gradient-to-br from-[#0369a1] via-[#0284c7] to-[#0ea5e9] dark:from-[#082f49] dark:via-[#0c4a6e] dark:to-[#0f172a] text-white py-8 lg:py-12 shadow-xl border-b dark:border-slate-800"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-400/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Breadcrumb Trail positioned inside top left of Hero Banner */}
          <div>
            <Breadcrumbs
              variant="hero"
              items={[
                { label: "Categories", href: "/categories" },
                { label: category.name },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headline & Details */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-amber-300 shadow-xl backdrop-blur-md ring-2 ring-white/20">
                  <Icon name={category.icon} className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 shadow-sm">
                  {activeNavTab === "trending" ? `${category.name} Trending` : category.badge || "Curated Store"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                LUMINA <span className="text-amber-300">{category.name}</span> Collection
              </h1>

              <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed max-w-2xl">
                {activeNavTab === "trending"
                  ? `Discover top-rated, best-selling and trending products in the ${category.name} catalog.`
                  : category.bannerTagline || category.description || `Explore our flagship ${category.name} collection.`}
              </p>

              {/* Micro Features Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold text-sky-100">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  <Icon name="Check" className="h-4 w-4 text-emerald-400" /> 100% Authentic
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  <Icon name="Check" className="h-4 w-4 text-emerald-400" /> Express 24h Dispatch
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                  <Icon name="Check" className="h-4 w-4 text-emerald-400" /> 30-Day Easy Returns
                </span>
              </div>
            </div>

            {/* Right Column: Layered Showcase Banner */}
            <div className="lg:col-span-5 relative group flex justify-center lg:justify-end">
              <div className="absolute -inset-4 rounded-full bg-amber-400/25 blur-3xl opacity-70" />

              <div className="relative w-full max-w-md lg:max-w-none overflow-hidden rounded-3xl border-2 border-white/30 bg-slate-950/60 shadow-2xl shadow-black/50">
                <div className="relative aspect-[4/3] sm:aspect-[4/4] w-full overflow-hidden">
                  {categorySlides.map((imgSrc, idx) => {
                    const isActive = idx === heroImageIdx;
                    return (
                      <div
                        key={imgSrc}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                          isActive ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                        }`}
                      >
                        <NextImage
                          src={imgSrc}
                          alt={`${category.name} Banner ${idx + 1}`}
                          fill
                          priority={idx === 0}
                          className="object-cover transition-transform duration-700 group-hover:scale-108"
                          sizes="(max-width: 1024px) 100vw, 42vw"
                        />
                      </div>
                    );
                  })}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                  <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                    <span className="rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 font-bold text-[10px] uppercase tracking-wider px-3 py-1 border border-white/20 shadow-md">
                      UP TO 40% OFF
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white font-bold bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                    <span>{category.name} Inventory</span>
                    <span className="text-amber-400 font-black">
                      {category.itemCount ? `${category.itemCount.toLocaleString()} items` : `${products.length} Items`}
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
            {subCategories.map((sub) => {
              const isActive = activeSubCategory.toLowerCase() === sub.toLowerCase();
              return (
                <button
                  key={sub}
                  onClick={() => {
                    setActiveSubCategory(sub);
                    if (activeNavTab === "trending") setActiveNavTab("storefront");
                  }}
                  className={`shrink-0 rounded-full px-5 py-2 text-xs font-black transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#0284c7] text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-300 dark:ring-sky-400 scale-[1.02]"
                      : "bg-slate-100/90 hover:bg-slate-200/90 text-slate-700 dark:bg-slate-800/90 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Catalog Content */}
      <main className="flex-grow py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header Row Above Grid: Inventory Count & Search Bar */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            
            {/* Inventory Item Count Display strictly above grid */}
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                Showing 1–{displayedProducts.length} of {filteredProducts.length} items
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {category.itemCount ? `Total ${category.itemCount.toLocaleString()} items in ${category.name}` : `Catalog results`}
              </span>
            </div>

            {/* Controls Right */}
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-wrap">
              {/* Search input */}
              <div className="relative max-w-xs w-full sm:w-64">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${category.name}...`}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-9 pr-8 py-2 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <Icon name="X" className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setViewMode("grid2")}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition ${
                    viewMode === "grid2"
                      ? "bg-white dark:bg-slate-900 text-[#0284c7] dark:text-amber-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                  title="Grid View"
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("scroll")}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold transition ${
                    viewMode === "scroll"
                      ? "bg-white dark:bg-slate-900 text-[#0284c7] dark:text-amber-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                  title="Swipe View"
                >
                  Swipe
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFilterOpen((prev) => !prev)}
                className="lg:hidden flex items-center gap-2 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white px-3.5 py-2 text-xs font-bold shadow transition cursor-pointer"
              >
                <Icon name="Filter" className="h-4 w-4" />
                <span>Filter ({activeFilterCount})</span>
              </button>

              {/* Sort Dropdown Strictly Top Right */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                >
                  <option value="featured">Newest Selection</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Best Sellers</option>
                </select>
              </div>

            </div>

          </div>

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2 bg-slate-100/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Active Selection ({filteredProducts.length} items):
              </span>

              {activeNavTab === "trending" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-3 py-1 text-xs font-black">
                  Mode: Trending
                  <button onClick={() => setActiveNavTab("storefront")}>
                    <Icon name="X" className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {activeSubCategory !== "All" && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 dark:bg-sky-950 px-3 py-1 text-xs font-bold text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800">
                  Section: {activeSubCategory}
                  <button onClick={() => setActiveSubCategory("All")}>
                    <Icon name="X" className="h-3.5 w-3.5 text-sky-600" />
                  </button>
                </span>
              )}

              {filters.maxPrice < maxAvailablePrice && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 dark:bg-sky-950 px-3 py-1 text-xs font-bold text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800">
                  Under ${filters.maxPrice}
                  <button onClick={() => setFilters({ ...filters, maxPrice: maxAvailablePrice })}>
                    <Icon name="X" className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}

              {filters.selectedColors?.map((col) => (
                <span
                  key={col}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 dark:bg-sky-950 px-3 py-1 text-xs font-bold text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800"
                >
                  Color: {col}
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        selectedColors: filters.selectedColors.filter((c) => c !== col),
                      })
                    }
                  >
                    <Icon name="X" className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}

              {filters.selectedSizes?.map((sz) => (
                <span
                  key={sz}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 dark:bg-sky-950 px-3 py-1 text-xs font-bold text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800"
                >
                  Size: {sz}
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        selectedSizes: filters.selectedSizes.filter((s) => s !== sz),
                      })
                    }
                  >
                    <Icon name="X" className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}

              {filters.selectedBrands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 dark:bg-sky-950 px-3 py-1 text-xs font-bold text-sky-800 dark:text-sky-200 border border-sky-200 dark:border-sky-800"
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

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-rose-500 hover:underline ml-2 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Desktop & Mobile Catalog Grid */}
          <div id="catalog-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sticky Desktop Filter Sidebar */}
            <div id="filter-sidebar" className="hidden lg:block lg:col-span-3 sticky top-16 z-20">
              <FilterSidebar
                allBrands={allBrands}
                filters={filters}
                maxAvailablePrice={maxAvailablePrice}
                onChange={setFilters}
                onReset={handleResetFilters}
                activeCount={activeFilterCount}
              />
            </div>

            {/* Mobile Filter Drawer */}
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

            {/* Main Products Grid */}
            <div className="lg:col-span-9 space-y-8">
              {displayedProducts.length > 0 ? (
                viewMode === "scroll" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        Horizontal browse ({displayedProducts.length} items):
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-500 animate-pulse">
                        ← Swipe Left/Right →
                      </span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 snap-x snap-mandatory scroll-smooth">
                      {displayedProducts.map((prod) => (
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
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6">
                    {displayedProducts.map((prod) => (
                      <ProductCard
                        key={prod.slug}
                        product={prod}
                        onAddToCart={() => addToCart(1)}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
                    <Icon name="Search" className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                    No products match your active selection
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Try selecting a different category section or clearing active filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white px-6 py-2.5 text-xs font-bold shadow transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {/* Skeleton Loading State during Load More */}
              {isLoadingMore && (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-3 space-y-3 animate-pulse"
                    >
                      <div className="aspect-[3/4] w-full rounded-xl sm:rounded-2xl bg-slate-200 dark:bg-slate-800" />
                      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="h-8 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                  ))}
                </div>
              )}

              {/* "Load More" Continuous Shopping Flow Button */}
              {visibleCount < filteredProducts.length && (
                <div className="pt-6 flex flex-col items-center justify-center space-y-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="w-full max-w-md space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <span>Showing {displayedProducts.length} of {filteredProducts.length} products</span>
                      <span>{Math.round((displayedProducts.length / filteredProducts.length) * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0284c7] transition-all duration-300"
                        style={{ width: `${(displayedProducts.length / filteredProducts.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white px-8 py-3.5 text-xs font-black uppercase tracking-wider shadow-lg shadow-sky-500/25 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <>
                        <Icon name="RefreshCw" className="h-4 w-4 animate-spin text-white" />
                        <span>Loading Products...</span>
                      </>
                    ) : (
                      <>
                        <Icon name="ChevronDown" className="h-4 w-4 text-white" />
                        <span>Load More Products ({filteredProducts.length - visibleCount} remaining)</span>
                      </>
                    )}
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

      {/* Site Footer */}
      <SiteFooter />
    </div>
  );
}
