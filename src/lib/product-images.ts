/**
 * Utility for generating high-definition product visual previews
 * fallback SVG illustrations for LUMINA Multi-Category Storefront.
 */

const CATEGORY_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  clothes: { bg: "from-amber-700 via-stone-800 to-slate-900", accent: "#f59e0b", text: "Haute Couture & Wear" },
  furniture: { bg: "from-amber-900 via-amber-950 to-stone-900", accent: "#d97706", text: "Artisan Living & Oak" },
  utensils: { bg: "from-slate-700 via-[#075570] to-slate-900", accent: "#38bdf8", text: "Culinary & Kitchen" },
  medical: { bg: "from-teal-800 via-cyan-900 to-slate-950", accent: "#2dd4bf", text: "Clinical & Health Tech" },
  cosmetics: { bg: "from-rose-800 via-pink-950 to-slate-900", accent: "#f43f5e", text: "Botanical Skincare" },
  food: { bg: "from-emerald-800 via-green-950 to-slate-900", accent: "#10b981", text: "Organic Gourmet" },
  "smart-devices": { bg: "from-sky-800 via-blue-950 to-slate-950", accent: "#0284c7", text: "Intelligent Audio & Tech" },
  vehicles: { bg: "from-zinc-800 via-neutral-900 to-black", accent: "#ef4444", text: "Automotive Tech & Accessories" },
};

export function getProductDisplayImage(product: {
  image?: string;
  categorySlug: string;
  title: string;
  brand?: string;
}): string {
  if (
    product.image &&
    !product.image.includes("speaker.png") &&
    !product.image.includes("watch.png") &&
    !product.image.includes("chair.png") &&
    !product.image.includes("skincare.png") &&
    !product.image.includes("hero-bg.png")
  ) {
    return product.image;
  }

  // Use uploaded default PNGs for suitable categories if matching
  if (product.categorySlug === "clothes" && product.title.toLowerCase().includes("watch")) {
    return "/images/watch.png";
  }
  if (product.categorySlug === "furniture" && product.title.toLowerCase().includes("chair")) {
    return "/images/chair.png";
  }
  if (product.categorySlug === "smart-devices" && product.title.toLowerCase().includes("speaker")) {
    return "/images/speaker.png";
  }
  if (product.categorySlug === "cosmetics" && product.title.toLowerCase().includes("serum")) {
    return "/images/skincare.png";
  }

  // Create SVG Data URI Artwork
  const catInfo = CATEGORY_COLORS[product.categorySlug] || {
    bg: "from-slate-800 to-slate-950",
    accent: "#075570",
    text: "LUMINA Curated",
  };

  const titleShort = product.title.length > 28 ? product.title.slice(0, 25) + "..." : product.title;
  const brandName = product.brand || "LUMINA";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#075570"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect width="400" height="400" fill="url(#bgGrad)" rx="24"/>
    <circle cx="200" cy="180" r="130" fill="${catInfo.accent}" opacity="0.12" filter="blur(30px)"/>
    <rect x="35" y="35" width="330" height="330" rx="20" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    
    <!-- Outer Product Ring -->
    <circle cx="200" cy="175" r="75" fill="none" stroke="${catInfo.accent}" stroke-width="2" stroke-dasharray="6,6" opacity="0.6"/>
    <circle cx="200" cy="175" r="60" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" stroke-width="1" filter="url(#shadow)"/>
    
    <!-- Central Icon/Symbol visual -->
    <text x="200" y="188" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="38" fill="#ffffff" text-anchor="middle" opacity="0.95">${titleShort.charAt(0)}</text>
    
    <!-- Product Label Footer -->
    <rect x="50" y="280" width="300" height="60" rx="14" fill="rgba(6, 11, 19, 0.75)" stroke="rgba(255,255,255,0.1)"/>
    <text x="200" y="304" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="800" fill="${catInfo.accent}" letter-spacing="1.5" text-anchor="middle" text-transform="uppercase">${brandName}</text>
    <text x="200" y="324" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">${titleShort}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
