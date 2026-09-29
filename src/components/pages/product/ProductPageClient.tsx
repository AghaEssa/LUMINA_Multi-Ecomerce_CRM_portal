"use client";

import { useState, useRef } from "react";
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

type ProductPageClientProps = {
  product: ProductItem;
  similarProducts: ProductItem[];
  categoryName: string;
  categories: CategoryItem[];
};

// Color Swatch Definitions
const COLOR_VARIANTS = [
  { name: "Navy Blue", hex: "#1e3a8a", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop" },
  { name: "Champagne Gold", hex: "#d97706", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop" },
  { name: "Emerald Green", hex: "#047857", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop" },
  { name: "Midnight Black", hex: "#0f172a", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop" },
];

// Sample Frequently Bought Together Add-on
const COMPLEMENTARY_ITEM = {
  title: "Matching Silk Gloves & Care Kit",
  price: 24.99,
  image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop",
};

// Mock Customer Reviews
const CUSTOMER_REVIEWS = [
  {
    id: 1,
    author: "Sarah Jenkins",
    rating: 5,
    date: "2 days ago",
    verified: true,
    title: "Absolutely divine fabric and feel!",
    comment: "The silk texture is incredibly soft and smooth. It drapes so nicely and the color matches the photos 100%. Highly recommend!",
    photo: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    author: "Michael Vance",
    rating: 5,
    date: "1 week ago",
    verified: true,
    title: "Exceptional quality and fast shipping",
    comment: "Ordered this as a gift for my wife and she loves it! Came beautifully packaged in a luxury box.",
    photo: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    author: "Elena Rostova",
    rating: 4,
    date: "2 weeks ago",
    verified: true,
    title: "Very classy apparel piece",
    comment: "Great stitching and premium material. Looks very luxurious when paired with formal coats.",
    photo: null,
  },
];

export function ProductPageClient({
  product,
  similarProducts,
  categoryName,
  categories,
}: ProductPageClientProps) {
  const router = useRouter();
  const { cartCount, addToCart } = useCart(0);
  const { addToCart: addToCartContext } = useCartContext();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState(COLOR_VARIANTS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  // Interactive Magnifying Zoom State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Frequently Bought Together Bundle State
  const [includeBundle, setIncludeBundle] = useState(true);
  const [bundleAdded, setBundleAdded] = useState(false);

  // Collapsible Accordions State
  const [openAccordion, setOpenAccordion] = useState<string | null>("fabric");

  // Reviews Filter State
  const [reviewFilter, setReviewFilter] = useState<"all" | "photos">("all");

  // Similar Products Pagination
  const [similarPage, setSimilarPage] = useState(1);
  const SIMILAR_PER_PAGE = 4;
  const totalSimilarPages = Math.ceil(similarProducts.length / SIMILAR_PER_PAGE);
  const paginatedSimilar = similarProducts.slice(
    (similarPage - 1) * SIMILAR_PER_PAGE,
    similarPage * SIMILAR_PER_PAGE
  );

  const origPrice = product.originalPrice || Math.round(product.price * 1.18 * 100) / 100;
  const discountVal = Math.round(((origPrice - product.price) / origPrice) * 100 * 100) / 100;
  const discountLabel = product.discountPercent || `${discountVal}% OFF`;
  const skuCode = `SKU: ${product.slug.slice(0, 3).toUpperCase()}-${selectedColor.name.slice(0, 2).toUpperCase()}-${selectedSize}`;

  // Gallery thumbnails
  const thumbnails = [
    product.image,
    ...COLOR_VARIANTS.map((c) => c.image),
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

  // Image Magnifier Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAdd = () => {
    setAdded(true);
    addToCart(quantity);
    addToCartContext({
      product: {
        ...product,
        title: `${product.title} (${selectedColor.name}, Size ${selectedSize})`,
        image: selectedImage,
      },
      quantity,
      size: selectedSize,
      openDrawer: false,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleAddBundle = () => {
    setBundleAdded(true);
    // Add primary item
    addToCartContext({
      product,
      quantity: 1,
      size: selectedSize,
      openDrawer: false,
    });
    // Add complementary item
    addToCartContext({
      product: {
        slug: "matching-silk-gloves-care-kit",
        title: COMPLEMENTARY_ITEM.title,
        price: COMPLEMENTARY_ITEM.price,
        image: COMPLEMENTARY_ITEM.image,
        categorySlug: product.categorySlug,
        brand: product.brand || "LUMINA",
        rating: 5.0,
      },
      quantity: 1,
      openDrawer: true,
    });
    setTimeout(() => setBundleAdded(false), 2000);
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion((prev) => (prev === id ? null : id));
  };

  const filteredReviews = CUSTOMER_REVIEWS.filter((r) =>
    reviewFilter === "photos" ? r.photo !== null : true
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#090d16] transition-colors duration-300">
      
      {/* Top Site Header Navbar */}
      <SiteHeader
        cartCount={cartCount}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Full Page Product Detail View */}
      <main className="flex-grow py-6 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Breadcrumb Trail */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            <Link href="/" className="hover:text-amber-500 dark:hover:text-amber-400 transition">
              Home
            </Link>
            <span>&gt;</span>
            <Link
              href={`/category/${product.categorySlug}`}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition font-semibold"
            >
              {categoryName}
            </Link>
            <span>&gt;</span>
            <span className="text-slate-900 dark:text-white font-extrabold truncate">
              {product.title}
            </span>
          </nav>

          {/* 2-Column Product Detail Main Section */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Interactive Zoom Image Showcase + Thumbnails */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Main Large Image Box with High-Res Magnifying Lens Zoom */}
                <div
                  ref={imageContainerRef}
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                  className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f4f5f8] dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800 cursor-crosshair group select-none"
                >
                  {selectedImage.startsWith("data:") ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={selectedImage}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-300"
                      style={
                        isZoomed
                          ? {
                              transform: "scale(2.2)",
                              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                            }
                          : undefined
                      }
                    />
                  ) : (
                    <Image
                      src={selectedImage || product.image}
                      alt={product.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      style={
                        isZoomed
                          ? {
                              transform: "scale(2.2)",
                              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                            }
                          : undefined
                      }
                    />
                  )}

                  {/* Top Left Zoom Helper Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-slate-950/75 backdrop-blur-xs text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md pointer-events-none">
                    <span className="text-amber-400">🔍</span>
                    <span>{isZoomed ? "2.2x High-Res Zoom" : "Hover to Zoom Texture"}</span>
                  </div>

                  {/* Top Right Floating Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 shadow-md hover:scale-105 transition cursor-pointer"
                      title="Share Product"
                    >
                      <Icon name="Share2" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setWishlist((prev) => !prev)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-md hover:scale-105 transition-all cursor-pointer"
                      title="Add to Wishlist"
                    >
                      <Icon
                        name="Heart"
                        className={`h-5 w-5 transition-transform ${
                          wishlist
                            ? "text-rose-500 fill-rose-500 scale-110"
                            : "text-slate-600 dark:text-slate-300 hover:text-rose-500"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 4 Thumbnail Views Row */}
                <div className="grid grid-cols-4 gap-3.5">
                  {thumbnails.map((thumbUrl, idx) => {
                    const isActive = selectedImage === thumbUrl;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(thumbUrl)}
                        className={`relative aspect-square rounded-2xl bg-[#f4f5f8] dark:bg-slate-800/80 overflow-hidden transition-all duration-200 cursor-pointer ${
                          isActive
                            ? "border-2 border-amber-400 shadow-md scale-105 ring-2 ring-amber-400/30"
                            : "border border-slate-200/80 dark:border-slate-800 opacity-75 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={thumbUrl}
                          alt={`Thumbnail View ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Right Column: Title, Ratings, Price, Visual Variants & CTAs */}
              <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
                
                <div className="space-y-4">
                  {/* Category & Rating Summary */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {categoryName} • {product.brand || "LUMINA Couture"}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        {skuCode}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                      {product.title}
                    </h1>

                    {/* Review Stars & Social Proof Pill */}
                    <div className="flex items-center gap-3 pt-1 flex-wrap">
                      <div className="flex items-center gap-1 text-amber-400">
                        {"★".repeat(5)}
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white ml-1">
                          4.9
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          (128 customer reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {product.description || `Crafted with extreme precision, this ${product.title} combines supreme comfort with modern elegance.`}
                  </p>

                  {/* Pricing Display */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-amber-300">
                        ${product.price}
                      </span>
                      {origPrice > product.price && (
                        <span className="text-lg font-semibold text-slate-400 line-through">
                          ${origPrice}
                        </span>
                      )}
                      {discountLabel && (
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full">
                          Save ${ (origPrice - product.price).toFixed(2) } ({discountLabel})
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      ✓ Taxes included • Free Express Delivery available
                    </p>
                  </div>

                  {/* Visual Color Swatches Selector */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        Color / Pattern: <span className="text-amber-600 dark:text-amber-400 font-black">{selectedColor.name}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {COLOR_VARIANTS.map((color) => {
                        const isSelected = selectedColor.name === color.name;
                        return (
                          <button
                            key={color.name}
                            onClick={() => {
                              setSelectedColor(color);
                              setSelectedImage(color.image);
                            }}
                            title={color.name}
                            className={`group relative h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? "ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-[#111827] scale-110 shadow-md"
                                : "hover:scale-105 opacity-80 hover:opacity-100"
                            }`}
                          >
                            <span
                              className="h-8 w-8 rounded-full border border-white/20 shadow-inner"
                              style={{ backgroundColor: color.hex }}
                            />
                            {isSelected && (
                              <span className="absolute text-white text-xs font-black drop-shadow-sm">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        Size: <span className="font-extrabold text-slate-900 dark:text-white">{selectedSize}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {["S", "M", "L", "XL"].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`h-10 w-12 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                            selectedSize === sz
                              ? "bg-amber-400 text-slate-950 shadow-md scale-105 border-2 border-amber-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity & Urgency Inventory Status */}
                  <div className="space-y-3 pt-2">
                    {/* Urgency Stock Microcopy Banner */}
                    <div className="flex items-center gap-2 text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 px-3.5 py-2 rounded-xl">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      </span>
                      <span>🔥 Only 3 left in stock — Order soon before stock runs out!</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Quantity:
                      </span>
                      <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="h-8 w-8 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold shadow-sm hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-sm font-black text-slate-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="h-8 w-8 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold shadow-sm hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dual Primary Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    <button
                      onClick={handleAdd}
                      className={`flex items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-900 dark:border-amber-400 bg-white dark:bg-slate-900 py-4 px-5 text-xs sm:text-sm font-black text-slate-900 dark:text-amber-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-[0.98] cursor-pointer ${
                        added ? "border-emerald-500 text-emerald-600 dark:text-emerald-400" : ""
                      }`}
                    >
                      <Icon name={added ? "Check" : "ShoppingCart"} className="h-4 w-4" />
                      <span>{added ? "Added to Bucket!" : "Add to Cart"}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleAdd();
                        router.push("/checkout");
                      }}
                      className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#ffb800] hover:bg-[#f5b000] py-4 px-5 text-xs sm:text-sm font-black text-slate-950 shadow-md transition active:scale-[0.98] cursor-pointer"
                    >
                      <span>⚡ Buy Now Express</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible Detail Accordions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  {/* Accordion 1: Fabric Care */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
                    <button
                      onClick={() => toggleAccordion("fabric")}
                      className="w-full p-3.5 flex items-center justify-between font-extrabold text-slate-900 dark:text-white text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🧶</span> Fabric Care &amp; Material Details
                      </span>
                      <Icon
                        name="ChevronDown"
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          openAccordion === "fabric" ? "rotate-180 text-amber-500" : ""
                        }`}
                      />
                    </button>
                    {openAccordion === "fabric" && (
                      <div className="p-3.5 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                        <p>• <strong>Material:</strong> 100% High-Grade Mulberry Silk / Premium Ring-Spun Cotton Blend</p>
                        <p>• <strong>Care:</strong> Dry clean recommended or hand wash cold with mild detergent</p>
                        <p>• <strong>Finish:</strong> Hand-rolled edges with reinforced luxury stitching</p>
                      </div>
                    )}
                  </div>

                  {/* Accordion 2: Shipping */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
                    <button
                      onClick={() => toggleAccordion("shipping")}
                      className="w-full p-3.5 flex items-center justify-between font-extrabold text-slate-900 dark:text-white text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🚚</span> Express Shipping &amp; Delivery Options
                      </span>
                      <Icon
                        name="ChevronDown"
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          openAccordion === "shipping" ? "rotate-180 text-amber-500" : ""
                        }`}
                      />
                    </button>
                    {openAccordion === "shipping" && (
                      <div className="p-3.5 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                        <p>• <strong>Standard Shipping:</strong> Free express shipping on orders over $100 (2-3 business days)</p>
                        <p>• <strong>Same-Day Dispatch:</strong> Orders placed before 2 PM EST ship same business day</p>
                        <p>• <strong>Real-Time Tracking:</strong> Live SMS and email tracking links provided upon dispatch</p>
                      </div>
                    )}
                  </div>

                  {/* Accordion 3: Returns */}
                  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
                    <button
                      onClick={() => toggleAccordion("returns")}
                      className="w-full p-3.5 flex items-center justify-between font-extrabold text-slate-900 dark:text-white text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span>🔄</span> 7-Day Hassle-Free Return Policy
                      </span>
                      <Icon
                        name="ChevronDown"
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          openAccordion === "returns" ? "rotate-180 text-amber-500" : ""
                        }`}
                      />
                    </button>
                    {openAccordion === "returns" && (
                      <div className="p-3.5 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in">
                        <p>• <strong>Returns:</strong> 7-day money-back guarantee with prepaid return shipping labels included</p>
                        <p>• <strong>Exchanges:</strong> Free instant exchanges for different sizes or color variants</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Frequently Bought Together Cross-Selling Module */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-sky-500/10 dark:from-amber-400/15 dark:to-slate-900 border border-amber-400/30 p-6 sm:p-8 space-y-6 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  BUNDLE &amp; SAVE 15%
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Frequently Bought Together
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Complete your collection with matching accessories
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Product Bundle Pair */}
              <div className="md:col-span-8 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                {/* Product 1 */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex-1 min-w-[200px]">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image src={product.image} alt={product.title} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{product.title}</p>
                    <p className="text-xs font-bold text-amber-500">${product.price}</p>
                  </div>
                </div>

                <span className="text-xl font-black text-amber-500 shrink-0">+</span>

                {/* Product 2 */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex-1 min-w-[200px]">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image src={COMPLEMENTARY_ITEM.image} alt={COMPLEMENTARY_ITEM.title} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 dark:text-white truncate">{COMPLEMENTARY_ITEM.title}</p>
                    <p className="text-xs font-bold text-amber-500">${COMPLEMENTARY_ITEM.price}</p>
                  </div>
                </div>
              </div>

              {/* Bundle Pricing & Add Both Button */}
              <div className="md:col-span-4 bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-center">
                <div className="space-y-0.5">
                  <span className="text-xs text-slate-400 font-bold">Bundle Total Price</span>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-amber-300">
                      ${( (product.price + COMPLEMENTARY_ITEM.price) * 0.85 ).toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 line-through">
                      ${(product.price + COMPLEMENTARY_ITEM.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddBundle}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs font-black shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Icon name={bundleAdded ? "Check" : "ShoppingCart"} className="h-4 w-4" />
                  <span>{bundleAdded ? "Bundle Added to Cart!" : "Add Both Items to Cart"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section with Photo Filter */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Customer Reviews &amp; Photos
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Real feedback from verified shoppers
                </p>
              </div>

              {/* Reviews Filter Pill Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReviewFilter("all")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    reviewFilter === "all"
                      ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  All Reviews ({CUSTOMER_REVIEWS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setReviewFilter("photos")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                    reviewFilter === "photos"
                      ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <span>📷 With Photos Only</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-black">
                    2
                  </span>
                </button>
              </div>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs">
                        {rev.author[0]}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{rev.author}</span>
                          {rev.verified && (
                            <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                              ✓ Verified Buyer
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400">{rev.date}</p>
                      </div>
                    </div>
                    <div className="text-amber-400 text-xs">{"★".repeat(rev.rating)}</div>
                  </div>

                  <p className="font-bold text-slate-900 dark:text-white">{rev.title}</p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {rev.comment}
                  </p>

                  {rev.photo && (
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm mt-2">
                      <Image src={rev.photo} alt="Customer Review Photo" fill className="object-cover" sizes="80px" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Similar Products Section */}
          {similarProducts.length > 0 && (
            <div className="pt-8 space-y-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    Similar Products
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Explore items from the same category
                  </p>
                </div>
                {totalSimilarPages > 1 && (
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    Page {similarPage} of {totalSimilarPages} ({similarProducts.length} items)
                  </span>
                )}
              </div>
              
              {/* 2 Products Per Line Grid (Mobile: 2 cols, Desktop: 4 cols) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {paginatedSimilar.map((simProd) => (
                  <ProductCard
                    key={simProd.slug}
                    product={simProd}
                  />
                ))}
              </div>

              {/* Clean Pagination Bar */}
              {totalSimilarPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Showing {(similarPage - 1) * SIMILAR_PER_PAGE + 1}–{Math.min(similarPage * SIMILAR_PER_PAGE, similarProducts.length)} of {similarProducts.length} products
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => setSimilarPage((p) => Math.max(1, p - 1))}
                      disabled={similarPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      ← Prev
                    </button>

                    {Array.from({ length: totalSimilarPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setSimilarPage(pageNum)}
                        className={`h-8 w-8 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                          similarPage === pageNum
                            ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => setSimilarPage((p) => Math.min(totalSimilarPages, p + 1))}
                      disabled={similarPage === totalSimilarPages}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Sticky Mobile Bottom Add-to-Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 shadow-2xl animate-fade-in flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 dark:border-slate-700">
            <Image src={selectedImage} alt={product.title} fill className="object-cover" sizes="40px" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black text-slate-900 dark:text-white truncate">{product.title}</p>
            <p className="text-xs font-bold text-amber-500">${product.price}</p>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md shrink-0 active:scale-95 transition cursor-pointer"
        >
          {added ? "✓ Added" : "+ Add to Cart"}
        </button>
      </div>

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
