"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import { DEFAULT_PRODUCTS, type ProductItem } from "@/lib/products";
import { DEFAULT_CATEGORIES, type CategoryItem } from "@/lib/categories";
import { ProductCard } from "@/components/common/ProductCard";
import { useCartContext } from "@/context/CartContext";

type ProductDetailsModalProps = {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
};

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailsModalProps) {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [similarPage, setSimilarPage] = useState(1);
  const SIMILAR_PER_PAGE = 4;

  // Synchronize when product changes
  useEffect(() => {
    if (product) {
      setActiveProduct(product);
      setSelectedImage(product.image);
      setQuantity(1);
      setAdded(false);
    }
  }, [product]);

  if (!isOpen || !activeProduct) return null;

  const category = DEFAULT_CATEGORIES.find((c: CategoryItem) => c.slug === activeProduct.categorySlug);
  const categoryName = category?.name || activeProduct.subCategory || "Storefront";

  const origPrice = activeProduct.originalPrice || Math.round(activeProduct.price * 1.18 * 100) / 100;
  const discountVal = Math.round(((origPrice - activeProduct.price) / origPrice) * 100 * 100) / 100;
  const discountLabel = activeProduct.discountPercent || `${discountVal}%`;

  const skuCode = `SKU: ${activeProduct.slug.slice(0, 3).toUpperCase()}-${selectedSize}`;

  // Gallery thumbnails (main image + variation previews)
  const thumbnails = [
    activeProduct.image,
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop",
  ];

  // Similar Products from same category
  const similarProducts = DEFAULT_PRODUCTS.filter(
    (p) => p.categorySlug === activeProduct.categorySlug && p.slug !== activeProduct.slug
  );
  const totalSimilarPages = Math.ceil(similarProducts.length / SIMILAR_PER_PAGE);
  const paginatedSimilar = similarProducts.slice(
    (similarPage - 1) * SIMILAR_PER_PAGE,
    similarPage * SIMILAR_PER_PAGE
  );

  const { addToCart } = useCartContext();

  const handleAdd = () => {
    if (activeProduct) {
      setAdded(true);
      addToCart({
        product: activeProduct,
        quantity: quantity,
        size: selectedSize,
        openDrawer: false,
      });
      if (onAddToCart) onAddToCart();
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleSelectProduct = (newProd: ProductItem) => {
    setActiveProduct(newProd);
    setSelectedImage(newProd.image);
    setQuantity(1);
    setAdded(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      
      {/* Dark Blur Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Card */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 md:p-9 max-h-[92vh] overflow-y-auto transition-all">
        
        {/* Top Header & Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          
          {/* Breadcrumb Trail */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium overflow-x-auto no-scrollbar">
            <Link href="#" className="hover:text-ocean-600 dark:hover:text-ocean-400 transition">
              Home
            </Link>
            <span>&gt;</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">
              {categoryName}
            </span>
            <span>&gt;</span>
            <span className="text-slate-900 dark:text-white font-extrabold truncate max-w-[200px] sm:max-w-xs">
              {activeProduct.title}
            </span>
          </nav>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Close modal"
          >
            ✕
          </button>
        </div>

        {/* 2-Column Product Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          
          {/* Left Column: Main Image + Thumbnail Gallery */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Featured Image Box */}
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f4f5f8] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800">
              {selectedImage.startsWith("data:") ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={selectedImage}
                  alt={activeProduct.title}
                  className="h-full w-full object-cover transition-transform duration-500"
                />
              ) : (
                <Image
                  src={selectedImage || activeProduct.image}
                  alt={activeProduct.title}
                  fill
                  className="object-cover transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}

              {/* Floating Dual Action Buttons on Top Right */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 shadow-md hover:scale-105 transition"
                  title="Share"
                >
                  🔗
                </button>
                <button
                  onClick={() => setWishlist((prev) => !prev)}
                  className={`grid h-9 w-9 place-items-center rounded-full border shadow-md transition-all ${
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
            <div className="grid grid-cols-4 gap-3">
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
                      sizes="100px"
                    />
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Product Metadata, Options & Dual CTAs */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Category / Department */}
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {categoryName}
              </span>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {activeProduct.title}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {activeProduct.description || `${activeProduct.title} — a quality demo product.`}
              </p>
            </div>

            {/* Shoppers Pill */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
              <span>🛒</span>
              <span>Added by 6 shoppers</span>
            </div>

            {/* Pricing Section */}
            <div className="space-y-1 pt-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  ${activeProduct.price}
                </span>
                {origPrice > activeProduct.price && (
                  <span className="text-base font-semibold text-slate-400 line-through">
                    ${origPrice}
                  </span>
                )}
                {discountLabel && (
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {discountLabel}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                ( Include all taxes )
              </p>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Options & SKU Row */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white">
                  Select Options
                </span>
                <span className="font-semibold text-slate-400">
                  {skuCode}
                </span>
              </div>

              {/* Size Selector */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Size: {selectedSize}
                </span>
                <div className="flex items-center gap-2.5">
                  {["S", "M", "L", "XL"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`h-9 w-9 rounded-xl text-xs font-extrabold transition-all ${
                        selectedSize === sz
                          ? "bg-amber-400 text-slate-950 shadow-sm"
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
                    className="h-7 w-7 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold shadow-sm hover:bg-slate-100 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-7 w-7 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold shadow-sm hover:bg-slate-100 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAdd}
                className={`flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-3.5 px-4 text-xs font-black text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 transition active:scale-[0.98] ${
                  added ? "border-emerald-500 text-emerald-600" : ""
                }`}
              >
                <Icon name={added ? "Check" : "ShoppingCart"} className="h-4 w-4" />
                <span>{added ? "Added to Bucket!" : "Add to Bucket"}</span>
              </button>

              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#ffb800] hover:bg-[#f5b000] py-3.5 px-4 text-xs font-black text-slate-950 shadow-md transition active:scale-[0.98]"
              >
                <span>⚡ Buy Now</span>
              </button>
            </div>

            {/* Trust Badges Strip */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="block text-sm">🔄</span>
                <span>7 Days Return</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="block text-sm">💵</span>
                <span>Cash On Delivery</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                <span className="block text-sm">🛡️</span>
                <span>Safe &amp; Secure</span>
              </div>
            </div>

          </div>

        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Similar Products
              </h3>
              {totalSimilarPages > 1 && (
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                  Page {similarPage} of {totalSimilarPages}
                </span>
              )}
            </div>
            
            {/* 2 Products Per Line Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {paginatedSimilar.map((simProd) => (
                <div key={simProd.slug} onClick={() => handleSelectProduct(simProd)}>
                  <ProductCard product={simProd} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalSimilarPages > 1 && (
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Showing {(similarPage - 1) * SIMILAR_PER_PAGE + 1}–{Math.min(similarPage * SIMILAR_PER_PAGE, similarProducts.length)} of {similarProducts.length}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSimilarPage((p) => Math.max(1, p - 1))}
                    disabled={similarPage === 1}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalSimilarPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setSimilarPage(pageNum)}
                      className={`h-7 w-7 rounded-lg text-[11px] font-extrabold transition ${
                        similarPage === pageNum
                          ? "bg-amber-400 text-slate-950 shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setSimilarPage((p) => Math.min(totalSimilarPages, p + 1))}
                    disabled={similarPage === totalSimilarPages}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
