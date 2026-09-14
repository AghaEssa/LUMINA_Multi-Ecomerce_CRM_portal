import { fetchProductBySlug, fetchSimilarProducts, fetchAllCategories } from "@/services/productApi";
import { ProductPageClient } from "@/components/pages/product/ProductPageClient";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) {
    return { title: "Product Not Found | LUMINA Store" };
  }
  return {
    title: `${product.title} | LUMINA Multi-Category Store`,
    description: product.description || `Buy ${product.title} on LUMINA Store.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const [product, categories] = await Promise.all([
    fetchProductBySlug(slug),
    fetchAllCategories(),
  ]);

  if (!product) {
    return null;
  }

  const similarProducts = await fetchSimilarProducts(product.categorySlug, product.slug, 12);
  const category = categories.find((c) => c.slug === product.categorySlug);

  return (
    <ProductPageClient
      product={product}
      similarProducts={similarProducts}
      categoryName={category?.name || product.subCategory || "Storefront"}
      categories={categories}
    />
  );
}
