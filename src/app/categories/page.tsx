import { fetchAllCategories } from "@/services/productApi";
import { CategoryGrid } from "@/components/pages/home/CategoryGrid";
import { SiteHeader } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export default async function AllCategoriesPage() {
  const categories = await fetchAllCategories();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#060b13]">
      <SiteHeader />
      <Breadcrumbs
        items={[
          { label: "Master Storefront", href: "/" },
          { label: "All 8 Categories" },
        ]}
      />
      <main className="flex-grow">
        <CategoryGrid categories={categories} />
      </main>
      <SiteFooter />
    </div>
  );
}
