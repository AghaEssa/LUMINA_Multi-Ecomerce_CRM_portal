"use client";

import { useState } from "react";
import type { CategoryItem } from "@/lib/categories";
import { DEFAULT_PRODUCTS } from "@/lib/products";
import { SiteHeader } from "@/components/common/Header";
import { HeroSection } from "@/components/pages/home/HeroSection";
import { CategoryGrid } from "@/components/pages/home/CategoryGrid";
import { BrandSlider } from "@/components/pages/home/BrandSlider";
import { BillboardBanner } from "@/components/pages/home/BillboardBanner";
import { TrendingProducts } from "@/components/pages/home/TrendingProducts";
import { ShoesBanner } from "@/components/pages/home/ShoesBanner";
import { CosmeticsAutoBanner } from "@/components/pages/home/CosmeticsAutoBanner";
import { HealthFoodAutoBanner } from "@/components/pages/home/HealthFoodAutoBanner";
import { TechBanner } from "@/components/pages/home/TechBanner";
import { CategoryProductRow } from "@/components/pages/home/CategoryProductRow";
import { AdminPreview } from "@/components/pages/home/AdminPreview";
import { SearchModal } from "@/components/common/SearchModal";
import { SiteFooter } from "@/components/common/Footer";
import { useCartContext } from "@/context/CartContext";

export function LandingPage({ categories }: { categories: CategoryItem[] }) {
  const { cartCount } = useCartContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Filtered product collections for homepage 4x2 grids (8 items each)
  const fashionProducts = DEFAULT_PRODUCTS.filter((p) => p.categorySlug === "clothes").slice(0, 8);
  const shoesProducts = DEFAULT_PRODUCTS.filter((p) => p.categorySlug === "shoes").slice(0, 8);
  const healthProducts = DEFAULT_PRODUCTS.filter((p) => p.categorySlug === "medical").slice(0, 8);
  const techProducts = DEFAULT_PRODUCTS.filter((p) => p.categorySlug === "smart-devices").slice(0, 8);
  const newArrivals = DEFAULT_PRODUCTS.slice(0, 8);
  const recommendedProducts = DEFAULT_PRODUCTS.slice(4, 12);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090d16] transition-colors duration-300">
      
      {/* 1. Site Header Navbar */}
      <SiteHeader
        cartCount={cartCount}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Homepage Sections */}
      <main className="flex-grow">
        
        {/* 1. Welcome Hero Section */}
        <HeroSection onOpenSearch={() => setIsSearchOpen(true)} />

        {/* 2. Explore 8 Main Categories Grid */}
        <CategoryGrid categories={categories} />

        {/* 3. Top Brands Marquee Slider */}
        <BrandSlider />

        {/* 4. CRAZY MEGA LOOT — UP TO 50% OFF Banner */}
        <BillboardBanner />

        {/* 5. Trending Products Across Categories */}
        <TrendingProducts />

        {/* 6. Shoes Brand Promo Banner */}
        <ShoesBanner />

        {/* 7. Top Deals in Fashion */}
        <CategoryProductRow
          title="Top Deals in Fashion"
          subtitle="Curated collection of denim jeans, hoodies, summer sundresses & accessories."
          badge="HOT DEAL"
          badgeColor="rose"
          products={fashionProducts.length > 0 ? fashionProducts : DEFAULT_PRODUCTS.slice(0, 8)}
          categorySlug="clothes"
        />

        {/* 8. Cosmetics Auto-Slider Banner (Men's Perfume & Women's Makeup) */}
        <CosmeticsAutoBanner />

        {/* 9. Footwear Premium Collection */}
        <CategoryProductRow
          title="Footwear Premium Collection"
          subtitle="Nike low-tops, athletic sneakers, and leather running shoes."
          badge="POPULAR"
          badgeColor="amber"
          products={shoesProducts.length > 0 ? shoesProducts : DEFAULT_PRODUCTS.slice(0, 8)}
          categorySlug="clothes"
        />

        {/* 10. Health & Organic Food Auto-Slider Banner */}
        <HealthFoodAutoBanner />

        {/* 11. Health & Wellness Showcase */}
        <CategoryProductRow
          title="Health & Wellness Essentials"
          subtitle="FDA-cleared blood pressure monitors, rehab massage guns & medical gear."
          badge="CLINICAL"
          badgeColor="emerald"
          products={healthProducts.length > 0 ? healthProducts : DEFAULT_PRODUCTS.slice(0, 8)}
          categorySlug="medical"
        />

        {/* 12. Tech & Electronics Spotlight Banner */}
        <TechBanner />

        {/* 13. Tech Essentials */}
        <CategoryProductRow
          title="Tech Essentials"
          subtitle="Sony ANC wireless headphones, Apple Watch Series 9 & smart EV chargers."
          badge="NEW TECH"
          badgeColor="blue"
          products={techProducts.length > 0 ? techProducts : DEFAULT_PRODUCTS.slice(0, 8)}
          categorySlug="smart-devices"
        />

        {/* 14. New Arrivals */}
        <CategoryProductRow
          title="New Arrivals"
          subtitle="Discover the latest additions added to our multi-category storefront."
          badge="NEW"
          badgeColor="purple"
          products={newArrivals}
        />

        {/* 15. Recommended For You */}
        <CategoryProductRow
          title="Recommended For You"
          subtitle="Personalized luxury selections tailored for your everyday style."
          badge="RECOMMENDED"
          badgeColor="amber"
          products={recommendedProducts}
        />

        {/* 16. Admin & CRM Panel Preview */}
        <AdminPreview />

      </main>

      {/* Interactive Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        categories={categories}
      />

      {/* Site Footer */}
      <SiteFooter />
    </div>
  );
}
