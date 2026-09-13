import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";
import type { CategoryItem } from "@/lib/categories";

export function CategoryCard({ category }: { category: CategoryItem }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-ocean-400 dark:hover:border-amber-400/60 hover:shadow-card-hover dark:border-slate-800/90 dark:bg-[#111827]"
    >
      {/* Top Card Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-ocean-50 text-ocean-600 ring-1 ring-ocean-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-ocean-700 group-hover:text-white group-hover:ring-ocean-700 dark:bg-slate-800/80 dark:text-amber-400 dark:ring-slate-700/80 group-hover:dark:bg-amber-400 group-hover:dark:text-slate-950 group-hover:dark:ring-amber-400">
            <Icon name={category.icon} className="h-6 w-6" />
          </div>

          {category.badge && (
            <span className="rounded-full bg-ocean-50 border border-ocean-200/60 px-3 py-1 text-[11px] font-bold text-ocean-700 dark:bg-amber-400/10 dark:border-amber-400/20 dark:text-amber-300">
              {category.badge}
            </span>
          )}
        </div>

        {/* Name & Description */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-ocean-600 dark:text-white dark:group-hover:text-amber-300 transition duration-200">
          {category.name}
        </h3>

        {category.description && (
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>

      {/* Optional Card Image Banner */}
      {category.image && (
        <div className="relative mt-4 h-28 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800/80">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        </div>
      )}

      {/* Card Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/80">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
          {category.itemCount ? `${category.itemCount.toLocaleString()} items` : "Explore items"}
        </span>

        <div className="flex items-center gap-1 text-xs font-bold text-ocean-600 dark:text-amber-400 group-hover:translate-x-0.5 transition duration-200">
          <span>Browse</span>
          <Icon name="ArrowRight" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
