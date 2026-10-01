import { prisma } from "@/lib/prisma";

export type CategoryItem = {
  name: string;
  slug: string;
  icon: string;
  description?: string;
  itemCount?: number;
  badge?: string;
  image?: string;
  heroImage?: string;
  featured?: boolean;
  subCategories: string[];
  bannerTagline?: string;
};

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    name: "Clothes",
    slug: "clothes",
    icon: "Shirt",
    description: "Haute couture, luxury apparel, tailored suits & streetwear essentials",
    itemCount: 1420,
    badge: "Trending",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop",
    featured: true,
    subCategories: [
      "All",
      "Men's Collection",
      "Women's Collection",
      "Tops & Outerwear",
      "Bottoms & Pants",
      "Luxury Accessories",
      "Footwear",
    ],
    bannerTagline: "Elevate your wardrobe with sustainable luxury and precision tailoring.",
  },
  {
    name: "Furniture",
    slug: "furniture",
    icon: "Armchair",
    description: "Ergonomic seating, artisan oak tables, ambient lighting & living decor",
    itemCount: 860,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop",
    featured: true,
    subCategories: [
      "All",
      "Ergonomic Seating",
      "Artisan Tables",
      "Ambient Lighting",
      "Executive Office",
      "Living & Bedroom",
    ],
    bannerTagline: "Transform your living space with minimalist Scandinavian & modern craft.",
  },
  {
    name: "Utensils",
    slug: "utensils",
    icon: "Utensils",
    description: "Master chef knives, titanium cookware, luxury tableware & kitchen tech",
    itemCount: 650,
    badge: "Chef Choice",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&auto=format&fit=crop",
    featured: true,
    subCategories: [
      "All",
      "Chef Knives",
      "Cookware Sets",
      "Luxury Tableware",
      "Bakeware Essentials",
      "Kitchen Appliances",
    ],
    bannerTagline: "Empower your culinary creations with precision Japanese steel & cookware.",
  },
  {
    name: "Medical",
    slug: "medical",
    icon: "Stethoscope",
    description: "Clinical-grade diagnostics, wireless health monitors & care tech",
    itemCount: 430,
    badge: "Verified",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop",
    featured: true,
    subCategories: [
      "All",
      "Clinical Diagnostics",
      "Wellness Monitors",
      "Personal Care Tech",
      "Mobility & Rehab",
      "First Aid & Tech",
    ],
    bannerTagline: "Hospital-grade accuracy and continuous wellness tracking for your home.",
  },
  {
    name: "Cosmetics",
    slug: "cosmetics",
    icon: "Sparkles",
    description: "Organic skincare serums, botanical makeup, luxury scents & hair elixirs",
    itemCount: 1120,
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop",
    featured: true,
    subCategories: [
      "All",
      "Skincare Essentials",
      "Luxury Fragrances",
      "Botanical Makeup",
      "Haircare & Serums",
      "Sun Protection",
    ],
    bannerTagline: "Pure botanical formulations engineered for timeless natural beauty.",
  },
  {
    name: "Food",
    slug: "food",
    icon: "Apple",
    description: "Gourmet organic produce, artisanal bakery, fine cold-pressed oils & drinks",
    itemCount: 980,
    badge: "Organic",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop",
    featured: true,
    subCategories: [
      "All",
      "Organic Produce",
      "Artisanal Bakery",
      "Gourmet Oils & Pantry",
      "Fine Beverages",
      "Healthy Snacks",
    ],
    bannerTagline: "Sustainably harvested farm-direct delicacies and artisanal pantry goods.",
  },
  {
    name: "Smart Devices",
    slug: "smart-devices",
    icon: "Smartphone",
    description: "High-fidelity spatial audio, wearable tech, smart home hubs & devices",
    itemCount: 1750,
    badge: "New Tech",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop",
    featured: true,
    subCategories: [
      "All",
      "Audiophile Sound",
      "Wearable Tech",
      "Smart Home",
      "Laptops & Workstations",
      "Mobile Accessories",
    ],
    bannerTagline: "Next-generation spatial acoustics and intelligent connected hardware.",
  },
  {
    name: "Vehicles",
    slug: "vehicles",
    icon: "Car",
    description: "Next-gen EV fast chargers, interior luxury fittings, dash tech & car care",
    itemCount: 340,
    badge: "Exclusive",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop",
    heroImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop",
    featured: true,
    subCategories: [
      "All",
      "EV Charging Tech",
      "Interior Luxury",
      "Automotive Electronics",
      "Detailing & Care",
      "Performance Accessories",
    ],
    bannerTagline: "Premium automotive accessories, fast charging, and electronic enhancement.",
  },
];

export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const categoriesFromDb = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (categoriesFromDb && categoriesFromDb.length > 0) {
      return categoriesFromDb.map((cat) => {
        const foundDefault = DEFAULT_CATEGORIES.find((d) => d.slug === cat.slug);
        return {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          description: cat.description || foundDefault?.description,
          itemCount: typeof cat.itemCount === "number" ? cat.itemCount : foundDefault?.itemCount,
          badge: cat.badge || foundDefault?.badge,
          image: cat.image || foundDefault?.image,
          heroImage: cat.heroImage || foundDefault?.heroImage || cat.image || foundDefault?.image,
          featured: Boolean(cat.featured),
          subCategories: cat.subCategories && cat.subCategories.length > 0 ? cat.subCategories : (foundDefault?.subCategories || ["All", "General", "Featured"]),
          bannerTagline: cat.bannerTagline || foundDefault?.bannerTagline || `Browse ${cat.name} products`,
        };
      });
    }

    return DEFAULT_CATEGORIES;
  } catch (error) {
    console.warn("PostgreSQL category query notice: Using default categories dataset.", error instanceof Error ? error.message : error);
    return DEFAULT_CATEGORIES;
  }
}
