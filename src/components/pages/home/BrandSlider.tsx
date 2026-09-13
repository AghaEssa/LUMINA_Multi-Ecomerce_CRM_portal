type BrandItem = {
  name: string;
  logoSvg: React.ReactNode;
};

const TOP_BRANDS: BrandItem[] = [
  {
    name: "Puma",
    logoSvg: (
      <svg className="h-8 w-auto max-w-[90px] fill-slate-900 dark:fill-white" viewBox="0 0 120 40">
        <path d="M12 12h14c4 0 7 2.5 7 6.5s-3 6.5-7 6.5h-8v6h-6V12zm6 4v5h8c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5h-8zm19-4h6v12c0 3 2 4.5 4.5 4.5s4.5-1.5 4.5-4.5V12h6v12c0 5.5-4 9-9.5 9s-9.5-3.5-9.5-9V12zm23 0h6l4.5 11 4.5-11h6v19h-5.5v-12l-5 12h-1l-5-12v12H60V12zm24 0h7l6 19h-6l-1.2-4h-4.6l-1.2 4H78l6-19zm2.6 4.5l-1.5 5.5h3l-1.5-5.5z" />
        <path d="M110 14c-1.5-1.5-3.5-2-5.5-1.5 2 1 3 3 2 5-1 2-3 2.5-5 2s-3-2-2.5-4c-3 1.5-5 4-5.5 7.5 1.5-1 3.5-1 5 0s2 3 1.5 5c-1 2-3 2.5-5 2-2-.5-3.5-2.5-3.5-4.5-1 4 1 8 4.5 10.5l4-3-2-2 3.5-1.5 3 3 3-5-3.5-2.5z" />
      </svg>
    ),
  },
  {
    name: "Nike",
    logoSvg: (
      <svg className="h-8 w-auto max-w-[90px] fill-slate-900 dark:fill-white" viewBox="0 0 120 40">
        <path d="M15 28c8.5 0 24-8.5 35-18-12.5 5-21.5 7.5-27.5 7.5-4 0-5.5-1-5.5-2.5 0-2 2.5-4.5 7-7.5l-4.5 1.5C13 11 9 14.5 9 18.5c0 4 3 9.5 6 9.5z" />
        <text x="56" y="27" fontSize="22" fontWeight="900" fontStyle="italic" letterSpacing="-1">NIKE</text>
      </svg>
    ),
  },
  {
    name: "Fastrack",
    logoSvg: (
      <svg className="h-8 w-auto max-w-[100px]" viewBox="0 0 130 40">
        <path fill="#f97316" d="M22 6c-6 0-11 5-11 11s5 11 11 11c4.5 0 8.5-2.8 10-7h-6c-1 1.8-2.8 3-4 3-3 0-5.5-2.5-5.5-5.5S19 13 22 13c1.2 0 3 1.2 4 3h6c-1.5-4.2-5.5-7-10-7z" />
        <text x="36" y="27" fontSize="18" fontWeight="900" fill="#0f172a" className="dark:fill-white" letterSpacing="-1">fastrack</text>
      </svg>
    ),
  },
  {
    name: "Ray-Ban",
    logoSvg: (
      <svg className="h-8 w-auto max-w-[95px] fill-slate-900 dark:fill-white" viewBox="0 0 120 40">
        <text x="10" y="27" fontSize="24" fontWeight="900" fontFamily="serif" fontStyle="italic">Ray-Ban</text>
      </svg>
    ),
  },
  {
    name: "Wildcraft",
    logoSvg: (
      <svg className="h-8 w-auto max-w-[100px]" viewBox="0 0 130 40">
        <path fill="#ea580c" d="M12 10l6 14 6-14 6 14 6-14h5l-9 20h-5l-6-14-6 14h-5L8 10h4z" />
        <text x="44" y="26" fontSize="15" fontWeight="900" fill="#0f172a" className="dark:fill-white">Wildcraft</text>
      </svg>
    ),
  },
  {
    name: "Levi's",
    logoSvg: (
      <svg className="h-8 w-auto max-w-[95px]" viewBox="0 0 120 40">
        <rect x="15" y="8" width="90" height="24" rx="4" fill="#dc2626" />
        <text x="25" y="26" fontSize="17" fontWeight="900" fill="#ffffff" letterSpacing="0.5">Levi&apos;s</text>
      </svg>
    ),
  },
  {
    name: "Zara",
    logoSvg: (
      <svg className="h-8 w-auto max-w-[90px] fill-slate-900 dark:fill-white" viewBox="0 0 120 40">
        <text x="10" y="28" fontSize="28" fontWeight="900" fontFamily="serif" letterSpacing="-3">ZARA</text>
      </svg>
    ),
  },
  {
    name: "Gap",
    logoSvg: (
      <svg className="h-8 w-auto max-w-[80px] fill-slate-900 dark:fill-white" viewBox="0 0 100 40">
        <text x="15" y="30" fontSize="32" fontWeight="900" fontFamily="serif" letterSpacing="3">GAP</text>
      </svg>
    ),
  },
  {
    name: "Under Armour",
    logoSvg: (
      <svg className="h-8 w-auto max-w-[95px] fill-slate-900 dark:fill-white" viewBox="0 0 120 40">
        <path d="M15 12c-5 0-9 4-9 9s4 9 9 9h5v-4h-5c-2.8 0-5-2.2-5-5s2.2-5 5-5h5v-4h-5zm18 0h-5v4h5c2.8 0 5 2.2 5 5s-2.2 5-5 5h-5v4h5c5 0 9-4 9-9s-4-9-9-9z" />
        <text x="48" y="26" fontSize="13" fontWeight="900" letterSpacing="-0.5">ARMOUR</text>
      </svg>
    ),
  },
];

export function BrandSlider() {
  return (
    <section id="brands" className="py-12 bg-white dark:bg-[#090d16] overflow-hidden border-y border-slate-100 dark:border-slate-800/80 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Top Brands
        </h2>
      </div>

      {/* Auto-Sliding Infinite Marquee Row */}
      <div className="relative flex items-center overflow-hidden py-1">
        <div className="animate-marquee flex items-center whitespace-nowrap gap-5 sm:gap-8">
          {[...TOP_BRANDS, ...TOP_BRANDS].map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="group flex flex-col items-center shrink-0 w-32 sm:w-36 transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* White Rounded Card Box */}
              <div className="flex h-24 w-full items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 group-hover:border-ocean-300 dark:hover:border-slate-700 group-hover:shadow-md dark:border-slate-800/90 dark:bg-[#111827]">
                {brand.logoSvg}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
