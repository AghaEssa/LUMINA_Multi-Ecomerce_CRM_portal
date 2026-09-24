import React from "react";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060b13] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery skeleton */}
          <div className="space-y-4">
            <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />
            <div className="flex gap-4">
              <div className="h-20 w-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-20 w-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-20 w-20 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>

          {/* Details skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl" />
              <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>

            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />

            <div className="space-y-3">
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-4 w-4/6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>

            <div className="flex gap-4 pt-4">
              <div className="h-12 flex-1 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
