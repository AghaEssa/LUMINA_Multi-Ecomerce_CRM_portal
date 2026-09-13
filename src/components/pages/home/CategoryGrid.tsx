import { CategoryCard } from "@/components/pages/home/CategoryCard";
import type { CategoryItem } from "@/lib/categories";

export function CategoryGrid({ categories }: { categories: CategoryItem[] }) {
  return (
    <section id="categories" className="py-20 bg-white dark:bg-[#090d16] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-100 pb-8 dark:border-slate-800/80">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-ocean-600 dark:text-amber-400">
              <span>Multi-Category Excellence</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Explore 8 Main Categories
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
             Browse our exclusive product selections. Each department features <strong>high-quality</strong> essentials and unique pieces tailored to your lifestyle.
            </p>
          </div>
        </div>

        {/* 8 Categories Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>

      </div>
    </section>
  );
}
