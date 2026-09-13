"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/common/Header";
import { ProductCard } from "@/components/common/ProductCard";
import { SearchModal } from "@/components/common/SearchModal";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";
import type { ProductItem } from "@/lib/products";
import type { CategoryItem } from "@/lib/categories";
import { useCart } from "@/hooks/useCart";
import { useCartContext } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

type ProductPageClientProps = {
  product: ProductItem;
  similarProducts: ProductItem[];
  categoryName: string;
  categories: CategoryItem[];
};

export function ProductPageClient({
  product,
  similarProducts,
  categoryName,
  categories,
}: ProductPageClientProps) {
  const router = useRouter();
  const { cartCount, addToCart } = useCart(0);
  const { requireAuth } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const origPrice = product.originalPrice || Math.round(product.price * 1.18 * 100) / 100;
  const discountVal = Math.round(((origPrice - product.price) / origPrice) * 100 * 100) / 100;
  const discountLabel = product.discountPercent || `${discountVal}%`;

  const skuCode = `SKU: ${product.slug.slice(0, 3).toUpperCase()}-${selectedSize}`;

  // Gallery thumbnails (main image + variation previews)
  const thumbnails = [
    product.image,
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop",
  ];

  const { addToCart: addToCartContext } = useCartContext();

  const handleAdd = () => {
    requireAuth(() => {
      setAdded(true);
      addToCart(quantity);
      addToCartContext({
        product,
        quantity,
        size: selectedSize,
        openDrawer: false,
      });
      setTimeout(() => setAdded(false), 2000);
    }, product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090d16] transition-colors duration-300">
      
      {/* Top Site Header Navbar */}
      <SiteHeader
        cartCount={cartCount}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Full Page Product Detail View */}
      <main className="flex-grow py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Breadcrumb Trail */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            <Link href="/" className="hover:text-ocean-600 dark:hover:text-amber-400 transition">
              Home
            </Link>
            <span>&gt;</span>
            <Link
              href={`/category/${product.categorySlug}`}
              className="hover:text-ocean-600 dark:hover:text-amber-400 transition font-semibold"
            >
              {categoryName}
            </Link>
            <span>&gt;</span>
            <span className="text-slate-900 dark:text-white font-extrabold truncate">
              {product.title}
            </span>
          </nav>

          {/* 2-Column Product Detail Section */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Left Column: Image Showcase + Thumbnails */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Main Large Image Box */}
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f4f5f8] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800">
                  {selectedImage.startsWith("data:") ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={selectedImage}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500"
                    />
                  ) : (
                    <Image
                      src={selectedImage || product.image}
                      alt={product.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}

                  {/* Top Right Dual Action Floating Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 shadow-md hover:scale-105 transition"
                      title="Share"
                    >
                      🔗
                    </button>
                    <button
                      onClick={() => setWishlist((prev) => !prev)}
                      className={`grid h-10 w-10 place-items-center rounded-full border shadow-md transition-all ${
                        wishlist
                          ? "bg-rose-500 text-white border-rose-500 scale-110"
                          : "bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border-slate-200/80 hover:text-rose-500"
                      }`}
                      title="Wishlist"
                    >
                      {wishlist ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>

                {/* 4 Thumbnails Row */}
                <div className="grid grid-cols-4 gap-3.5">
                  {thumbnails.map((thumbUrl, idx) => {
                    const isActive = selectedImage === thumbUrl;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(thumbUrl)}
                        className={`relative aspect-square rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80 overflow-hidden transition-all duration-200 ${
                          isActive
                            ? "border-2 border-amber-400 shadow-md scale-105"
                            : "border border-slate-200/80 dark:border-slate-800 opacity-75 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={thumbUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Right Column: Information, Pricing, Options & CTAs */}
              <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
                
                <div className="space-y-4">
                  {/* Category / Sub-Category */}
                  <div>
                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {categoryName}
                    </span>
                    <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                      {product.title}
                    </h1>
                    <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {product.description || `${product.title} — a quality demo product.`}
                    </p>
                  </div>

                  {/* Shoppers Pill */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-3.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
                    <span>🛒</span>
                    <span>Added by 6 shoppers</span>
                  </div>

                  {/* Pricing Display */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                        ${product.price}
                      </span>
                      {origPrice > product.price && (
                        <span className="text-lg font-semibold text-slate-400 line-through">
                          ${origPrice}
                        </span>
                      )}
                      {discountLabel && (
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {discountLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      ( Include all taxes )
                    </p>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Options & SKU */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                        Select Options
                      </span>
                      <span className="font-semibold text-slate-400">
                        {skuCode}
                      </span>
                    </div>

                    {/* Size Selector */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Size: {selectedSize}
                      </span>
                      <div className="flex items-center gap-2.5">
                        {["S", "M", "L", "XL"].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => setSelectedSize(sz)}
                            className={`h-10 w-10 rounded-xl text-xs font-extrabold transition-all ${
                              selectedSize === sz
                                ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Counter */}
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Quantity:
                      </span>
                      <div className="flex items-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold shadow-sm hover:bg-slate-100 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm font-black text-slate-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold shadow-sm hover:bg-slate-100 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dual Action CTAs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
                    <button
                      onClick={handleAdd}
                      className={`flex items-center justify-center gap-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-4 px-5 text-xs sm:text-sm font-black text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 transition active:scale-[0.98] ${
                        added ? "border-emerald-500 text-emerald-600" : ""
                      }`}
                    >
                      <Icon name={added ? "Check" : "ShoppingCart"} className="h-4 w-4" />
                      <span>{added ? "Added to Bucket!" : "Add to Bucket"}</span>
                    </button>

                    <button
                      onClick={handleAdd}
                      className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#ffb800] hover:bg-[#f5b000] py-4 px-5 text-xs sm:text-sm font-black text-slate-950 shadow-md transition active:scale-[0.98]"
                    >
                      <span>⚡ Buy Now</span>
                    </button>
                  </div>
                </div>

                {/* Trust Badges Strip */}
                <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
                  <div className="p-3 rounded-2xl bg-[#f8fafc] dark:bg-slate-900/60">
                    <span className="block text-base mb-1">🔄</span>
                    <span>7 Days Return</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#f8fafc] dark:bg-slate-900/60">
                    <span className="block text-base mb-1">💵</span>
                    <span>Cash On Delivery</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#f8fafc] dark:bg-slate-900/60">
                    <span className="block text-base mb-1">🛡️</span>
                    <span>Safe &amp; Secure</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="pt-8 space-y-6">
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Similar Products
              </h3>
              
              <div className="flex items-center gap-5 overflow-x-auto no-scrollbar pb-4 pt-1">
                {similarProducts.map((simProd) => (
                  <ProductCard
                    key={simProd.slug}
                    product={simProd}
                    onOpenDetails={(p) => router.push(`/product/${p.slug}`)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Interactive Category-Scoped Search Modal */}
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
