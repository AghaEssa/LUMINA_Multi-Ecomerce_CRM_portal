import { notFound } from "next/navigation";
import { fetchAllCategories, fetchProductsByCategory } from "@/services/productApi";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { CategoryPortalPage } from "@/components/pages/category/CategoryPortalPage";
import { generateCategoryMetadata, generateCategoryJsonLd } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return DEFAULT_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase().trim();
  const allCategories = await fetchAllCategories();
  const matchedCategory = allCategories.find((cat) => cat.slug.toLowerCase() === slug);

  if (!matchedCategory) {
    return {
      title: "Category Not Found | LUMINA Storefront",
      description: "The requested category segment could not be found.",
    };
  }

  return generateCategoryMetadata(matchedCategory);
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.toLowerCase().trim();

  const allCategories = await fetchAllCategories();
  const matchedCategory = allCategories.find((cat) => cat.slug.toLowerCase() === slug);

  if (!matchedCategory) {
    notFound();
  }

  const products = await fetchProductsByCategory(slug);
  const jsonLd = generateCategoryJsonLd(matchedCategory);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <CategoryPortalPage
        category={matchedCategory}
        categories={allCategories}
        products={products}
      />
    </>
  );
}
