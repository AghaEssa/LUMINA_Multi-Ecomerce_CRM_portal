import React from "react";
import { LuminaLogo } from "@/components/common/LuminaLogo";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060b13] flex flex-col items-center justify-center p-4 text-slate-900 dark:text-white">
      <div className="text-center space-y-6 max-w-sm mx-auto animate-pulse">
        {/* Lumina Logo Brand */}
        <div className="flex justify-center">
          <LuminaLogo size="lg" showText={true} />
        </div>

        {/* Spinner ring */}
        <div className="relative h-12 w-12 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-[#0284c7] dark:border-amber-400 border-t-transparent animate-spin" />
        </div>

        {/* Text */}
        <div className="space-y-1.5">
          <p className="text-xs font-black uppercase tracking-widest text-[#0284c7] dark:text-amber-400">
            LUMINA Storefront
          </p>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Loading storefront resources...
          </p>
        </div>

        {/* Skeleton Bars */}
        <div className="space-y-2 pt-2">
          <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto" />
          <div className="h-2.5 w-32 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
}
