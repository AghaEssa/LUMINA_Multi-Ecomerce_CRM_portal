import Link from "next/link";
import { Icon } from "@/components/common/Icons";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  variant?: "default" | "hero";
  className?: string;
};

export function Breadcrumbs({ items, variant = "default", className = "" }: BreadcrumbsProps) {
  const isHero = variant === "hero";

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        isHero
          ? `py-0 px-0 ${className}`
          : `py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto ${className}`
      }
    >
      <ol className="flex items-center flex-wrap gap-2 text-xs font-semibold">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className={`flex items-center gap-1.5 transition ${
              isHero
                ? "text-sky-100 hover:text-amber-300 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-ocean-600 dark:hover:text-ocean-400"
            }`}
          >
            <Icon
              name="Package"
              className={`h-3.5 w-3.5 ${isHero ? "text-amber-300" : "text-ocean-600 dark:text-ocean-400"}`}
            />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <Icon
              name="ChevronRight"
              className={`h-3.5 w-3.5 ${isHero ? "text-sky-200/70" : "text-slate-300 dark:text-slate-600"}`}
            />
            {item.href ? (
              <Link
                href={item.href}
                className={`transition ${
                  isHero
                    ? "text-sky-100 hover:text-amber-300 font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:text-ocean-600 dark:hover:text-ocean-400"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isHero
                    ? "font-extrabold text-white bg-white/15 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20 shadow-sm"
                    : "font-bold text-ocean-700 dark:text-ocean-300 bg-ocean-50 dark:bg-ocean-950/60 px-2.5 py-0.5 rounded-full border border-ocean-200/50 dark:border-ocean-800/50"
                }
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
