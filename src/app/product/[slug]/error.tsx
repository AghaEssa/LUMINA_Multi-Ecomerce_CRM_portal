"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logger } from "@/lib/logger";

export default function ProductErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Product Page Error Boundary", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl font-black">
          🛍️
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Product Loading Error
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            We couldn't retrieve the specifications or details for this product. It may have been relocated or updated.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#075570] hover:bg-[#06465c] text-white text-xs font-bold transition shadow-sm"
          >
            Retry Loading
          </button>
          <Link
            href="/categories"
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 transition"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
