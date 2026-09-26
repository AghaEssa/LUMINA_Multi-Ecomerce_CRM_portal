"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { logger } from "@/lib/logger";

export default function SegmentErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Segment Error Boundary caught an unhandled page exception", error, {
      digest: error.digest,
    });
  }, [error]);

  const displayMessage =
    process.env.NODE_ENV === "development"
      ? error.message
      : "We encountered an unexpected issue while loading this page section. Please try again or return to the homepage.";

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#060b13]">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-rose-500/20 text-rose-500 font-black text-3xl shadow-lg border border-rose-500/30">
            ⚠️
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Something went wrong!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {displayMessage}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white px-5 py-2.5 text-xs font-bold shadow-md transition"
            >
              <span>Try Again</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white px-5 py-2.5 text-xs font-bold transition"
            >
              <span>Go to Homepage</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
