"use client";

import { useRef } from "react";
import { Icon } from "@/components/common/Icons";
import { ProductCard } from "@/components/common/ProductCard";
import type { ProductItem } from "@/lib/products";

type TrendingProductsProps = {
  onAddToCart?: () => void;
  onOpenDetails?: (product: ProductItem) => void;
};

export const FEATURED_TRENDING_ITEMS: ProductItem[] = [
  {
    title: "High-Waist Yoga Leggings",
    slug: "hm-high-waist-yoga-leggings",
    categorySlug: "clothes",
    subCategory: "Women's Activewear",
    price: 29.99,
    originalPrice: 34.99,
    discountPercent: "14.29% off",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop",
    brand: "H&M",
    rating: 5.0,
    description: "High-Waist Yoga Leggings — premium stretch performance fabric.",
    inStock: true,
    tags: ["S", "leggings", "yoga"],
  },
  {
    title: "Premium Cotton Hoodie",
    slug: "north-face-cotton-zip-hoodie",
    categorySlug: "clothes",
    subCategory: "Outerwear & Hoodies",
    price: 39.99,
    originalPrice: 44.99,
    discountPercent: "11.11% off",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop",
    brand: "THE NORTH FACE",
    rating: 4.9,
    description: "Fleece lined ultra soft heavyweight casual daily hoodie.",
    inStock: true,
    tags: ["M", "hoodie", "cotton"],
  },
  {
    title: "Women's Floral Summer Dress",
    slug: "zara-womens-floral-sundress",
    categorySlug: "clothes",
    subCategory: "Dresses & Skirts",
    price: 39.99,
    originalPrice: 45.99,
    discountPercent: "13.05% off",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop",
    brand: "ZARA",
    rating: 4.8,
    description: "Lightweight breathable linen blend printed summer dress.",
    inStock: true,
    tags: ["S", "dress", "floral"],
  },
  {
    title: "Slim Fit Stretch Jeans",
    slug: "levis-511-slim-fit-jeans",
    categorySlug: "clothes",
    subCategory: "Bottoms & Pants",
    price: 49.99,
    originalPrice: 59.99,
    discountPercent: "16.67% off",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop",
    brand: "LEVI'S",
    rating: 4.9,
    description: "Classic 5-pocket denim stretch jeans with modern slim fit cut.",
    inStock: true,
    tags: ["Blue", "32", "jeans"],
  },
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    slug: "sony-wh1000xm5-headphones",
    categorySlug: "smart-devices",
    subCategory: "Audiophile Sound",
    price: 348.00,
    originalPrice: 399.00,
    discountPercent: "12.7% off",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
    brand: "SONY",
    rating: 4.95,
    description: "Active noise canceling over-ear headphones with 30-hour battery.",
    inStock: true,
    tags: ["ANC", "30h", "black"],
  },
  {
    title: "Herman Miller Aeron Ergonomic Mesh Chair",
    slug: "herman-miller-aeron-chair",
    categorySlug: "furniture",
    subCategory: "Ergonomic Seating",
    price: 495.00,
    originalPrice: 590.00,
    discountPercent: "16.1% off",
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop",
    brand: "HERMAN MILLER",
    rating: 4.95,
    description: "Pellicle 8Z breathable mesh executive office chair.",
    inStock: true,
    tags: ["mesh", "office"],
  },
  {
    title: "L'Oréal Revitalift Hyaluronic Serum 30ml",
    slug: "loreal-hyaluronic-serum",
    categorySlug: "cosmetics",
    subCategory: "Skincare Essentials",
    price: 28.99,
    originalPrice: 34.99,
    discountPercent: "17.1% off",
    image: "https://images.unsplash.com/photo-1608248597266-c896505f6142?w=600&auto=format&fit=crop",
    brand: "L'ORÉAL",
    rating: 4.9,
    description: "1.5% pure Hyaluronic Acid serum for intense skin hydration.",
    inStock: true,
    tags: ["30ml", "serum"],
  },
];

export function TrendingProducts({ onAddToCart, onOpenDetails }: TrendingProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section id="trending" className="py-16 bg-slate-50 dark:bg-[#090d16] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Carousel Navigation */}
        <div className="mb-8 flex items-end justify-between border-b border-slate-200/80 pb-6 dark:border-slate-800/80">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-ocean-600 dark:text-amber-400">
              CURATED SELECTION
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Trending Products Across Categories
            </h2>
          </div>

          {/* Carousel Arrow Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              title="Scroll Left"
            >
              ←
            </button>
            <button
              onClick={() => scroll("right")}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              title="Scroll Right"
            >
              →
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-5 overflow-x-auto no-scrollbar pb-4 pt-1 scroll-smooth"
        >
          {FEATURED_TRENDING_ITEMS.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              variant="carousel"
              onAddToCart={onAddToCart}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
