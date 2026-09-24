import React from "react";
import { SiteHeader } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";

export default function CategoryLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#060b13]">
      <SiteHeader />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-48 sm:h-64 w-full rounded-3xl bg-slate-200 dark:bg-slate-800/80" />

        {/* Filter Controls Bar Skeleton */}
        <div className="h-12 w-full rounded-2xl bg-slate-200 dark:bg-slate-800/60" />

        {/* Product Cards Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-3"
            >
              <div className="aspect-square w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-9 w-full bg-slate-200 dark:bg-slate-800 rounded-xl pt-2" />
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
