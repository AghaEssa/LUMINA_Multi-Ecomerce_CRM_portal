import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "../src/lib/categories";
import { DEFAULT_PRODUCTS } from "../src/lib/products";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting LUMINA PostgreSQL database seeding on Neon...");

  // 1. Seed Categories
  console.log("\n📦 Seeding Categories...");
  const categoryMap = new Map<string, string>();

  for (const cat of DEFAULT_CATEGORIES) {
    const upserted = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        icon: cat.icon,
        description: cat.description || "",
        itemCount: cat.itemCount || 0,
        badge: cat.badge || "",
        image: cat.image || "",
        heroImage: cat.heroImage || "",
        featured: cat.featured ?? true,
        subCategories: cat.subCategories || [],
        bannerTagline: cat.bannerTagline || "",
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description || "",
        itemCount: cat.itemCount || 0,
        badge: cat.badge || "",
        image: cat.image || "",
        heroImage: cat.heroImage || "",
        featured: cat.featured ?? true,
        subCategories: cat.subCategories || [],
        bannerTagline: cat.bannerTagline || "",
      },
    });

    categoryMap.set(upserted.slug, upserted.id);
    console.log(`  ✓ Category: ${upserted.name} (${upserted.slug})`);
  }

  // 2. Seed Products
  console.log("\n🛍️ Seeding Products...");
  let productCount = 0;

  for (const p of DEFAULT_PRODUCTS) {
    const categoryId = categoryMap.get(p.categorySlug) || null;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        categorySlug: p.categorySlug,
        categoryId: categoryId,
        subCategory: p.subCategory || "General",
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        discountPercent: p.discountPercent ?? null,
        image: p.image,
        secondaryImage: p.secondaryImage ?? null,
        brand: p.brand,
        rating: p.rating,
        description: p.description || "",
        inStock: p.inStock ?? true,
        badge: p.badge || "",
        tags: p.tags || [],
        sizes: p.sizes || [],
        colors: p.colors ? (p.colors as any) : undefined,
      },
      create: {
        title: p.title,
        slug: p.slug,
        categorySlug: p.categorySlug,
        categoryId: categoryId,
        subCategory: p.subCategory || "General",
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        discountPercent: p.discountPercent ?? null,
        image: p.image,
        secondaryImage: p.secondaryImage ?? null,
        brand: p.brand,
        rating: p.rating,
        description: p.description || "",
        inStock: p.inStock ?? true,
        badge: p.badge || "",
        tags: p.tags || [],
        sizes: p.sizes || [],
        colors: p.colors ? (p.colors as any) : undefined,
      },
    });
    productCount++;
    console.log(`  ✓ Product [${productCount}]: ${p.title} (${p.brand})`);
  }

  console.log(`\n🎉 Seeding complete!`);
  console.log(`  Total Categories: ${categoryMap.size}`);
  console.log(`  Total Products: ${productCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
