import { fetchAllCategories, fetchProductsByCategory } from "@/services/productApi";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { CategoryPortalPage } from "@/components/pages/category/CategoryPortalPage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return DEFAULT_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase().trim();

  // Fetch categories and products in parallel for max performance
  const [allCategories, products] = await Promise.all([
    fetchAllCategories(),
    fetchProductsByCategory(slug),
  ]);

  const matchedCategory = allCategories.find((cat) => cat.slug.toLowerCase() === slug) || {
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
    slug,
    icon: "LayoutGrid",
    description: `Browse LUMINA's curated ${slug} collection.`,
    itemCount: 120,
    badge: "Curated",
    subCategories: ["All", "General", "Featured"],
    bannerTagline: `Explore our curated selection of ${slug} products.`,
  };

  return (
    <CategoryPortalPage
      category={matchedCategory}
      categories={allCategories}
      products={products}
    />
  );
}
