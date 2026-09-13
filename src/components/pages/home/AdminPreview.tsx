import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icons";

export function AdminPreview() {
  return (
    <section id="admin-preview" className="py-20 bg-gradient-to-br from-[#090d16] via-[#0f172a] to-[#111827] text-white relative overflow-hidden">
      {/* Glow background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-ocean-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Enterprise Shopping Experience & Multi-Category Portals
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              LUMINA is engineered for high-performance e-commerce. Seamlessly navigate 8 dedicated category storefronts, filter real-time product catalogs, manage shopping carts, and search across global store collections.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <h4 className="font-bold text-sm text-amber-300">8 Dedicated Storefronts</h4>
                <p className="text-xs text-slate-400 mt-1">Tailored sub-categories & dynamic layouts</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <h4 className="font-bold text-sm text-ocean-200">Lightning-Fast Shopping</h4>
                <p className="text-xs text-slate-400 mt-1">Instantly filter and find your favorite products</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/category/clothes"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3 text-xs font-black text-ocean-950 shadow-lg hover:bg-amber-500 transition-all duration-200 uppercase tracking-wider"
              >
                <span>Browse Clothes Store</span>
                <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right High-Definition E-Commerce Shopping Image Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none overflow-hidden rounded-3xl border-2 border-white/20 shadow-2xl group bg-slate-900/80">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&auto=format&fit=crop"
                  alt="Lumina E-Commerce Shopping Experience"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>

              {/* Floating Glassmorphic Footer Label */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 p-4 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      50+ Authentic Brand Products Ready
                    </h4>
                  </div>
                </div>
                <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black text-ocean-950 uppercase tracking-widest shadow-sm">
                 Buy Now
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
