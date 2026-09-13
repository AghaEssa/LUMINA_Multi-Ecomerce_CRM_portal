import Link from "next/link";
import { Icon } from "@/components/common/Icons";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <ol className="flex items-center flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-ocean-600 dark:hover:text-ocean-400 transition"
          >
            <Icon name="Package" className="h-3.5 w-3.5 text-ocean-600 dark:text-ocean-400" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <Icon name="ChevronRight" className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-ocean-600 dark:hover:text-ocean-400 transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-bold text-ocean-700 dark:text-ocean-300 bg-ocean-50 dark:bg-ocean-950/60 px-2.5 py-0.5 rounded-full border border-ocean-200/50 dark:border-ocean-800/50">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
