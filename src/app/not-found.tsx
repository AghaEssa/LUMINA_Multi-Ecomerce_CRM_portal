import Link from "next/link";
import { SiteHeader } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import { Icon } from "@/components/common/Icons";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#060b13]">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md mx-auto space-y-6">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-amber-400/20 text-amber-500 font-black text-3xl shadow-lg border border-amber-400/30">
            404
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The category or product page you requested could not be found or has been moved to a new storefront location.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#075570] hover:bg-[#06465c] text-white px-6 py-3 text-xs font-bold shadow-md transition"
            >
              <Icon name="ArrowRight" className="h-4 w-4 rotate-180" />
              <span>Back to Storefront Homepage</span>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
