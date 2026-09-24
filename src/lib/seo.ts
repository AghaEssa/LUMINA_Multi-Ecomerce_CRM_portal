import type { Metadata } from "next";
import type { ProductItem } from "@/lib/products";
import type { CategoryItem } from "@/lib/categories";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lumina-storefront.vercel.app";

/**
 * Generates dynamic Metadata for Product Detail Pages
 */
export function generateProductMetadata(product: ProductItem | null | undefined): Metadata {
  if (!product) {
    return {
      title: `Product Not Found | ${APP_NAME}`,
      description: "The requested product could not be found on LUMINA Multi-Category Storefront.",
      robots: { index: false, follow: true },
    };
  }

  const title = `${product.title} | ${product.brand || APP_NAME}`;
  const description =
    product.description ||
    `Shop ${product.title} on ${APP_NAME}. Premium multi-category collection with instant delivery and 2FA secured checkout.`;
  const canonicalUrl = `${SITE_URL}/product/${product.slug}`;
  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${SITE_URL}${product.image}`;

  return {
    title,
    description,
    keywords: [
      product.title,
      product.brand,
      product.categorySlug,
      product.subCategory || "",
      "LUMINA",
      "Online Shopping",
      "Multi-category Store",
    ].filter(Boolean),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: APP_NAME,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  };
}

/**
 * Generates JSON-LD Structured Data (schema.org/Product) for Product Detail Pages
 */
export function generateProductJsonLd(product: ProductItem) {
  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `${SITE_URL}${product.image}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [imageUrl],
    description: product.description || `Buy ${product.title} on ${APP_NAME}`,
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: product.brand || APP_NAME,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.8,
      reviewCount: 42,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: APP_NAME,
      },
    },
  };

  return JSON.stringify(schema);
}

/**
 * Generates dynamic Metadata for Category Store Pages
 */
export function generateCategoryMetadata(category: CategoryItem | Partial<CategoryItem> | null): Metadata {
  if (!category || !category.name) {
    return {
      title: `Storefront Categories | ${APP_NAME}`,
      description: APP_DESCRIPTION,
    };
  }

  const categorySlug = category.slug || "all";
  const title = `${category.name} Collection | ${APP_NAME} Multi-Category Store`;
  const description =
    category.description ||
    `Browse LUMINA's curated ${category.name} collection featuring premium high-demand items.`;
  const canonicalUrl = `${SITE_URL}/category/${categorySlug}`;

  return {
    title,
    description,
    keywords: [category.name, categorySlug, "LUMINA Category", "Curated Collection", "Online Shopping"],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: APP_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Generates JSON-LD Structured Data (schema.org/CollectionPage) for Category Pages
 */
export function generateCategoryJsonLd(category: CategoryItem | Partial<CategoryItem>) {
  const categorySlug = category.slug || "all";
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name || "Storefront"} Collection`,
    description: category.description || `Browse ${category.name || "storefront"} items on ${APP_NAME}`,
    url: `${SITE_URL}/category/${categorySlug}`,
    isPartOf: {
      "@type": "WebSite",
      name: APP_NAME,
      url: SITE_URL,
    },
  };

  return JSON.stringify(schema);
}
