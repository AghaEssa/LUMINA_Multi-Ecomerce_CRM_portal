export default function CategoryLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#060b13] animate-pulse">
      {/* Header Skeleton */}
      <div className="h-20 bg-[#075570] w-full" />
      <div className="h-10 bg-[#06465c] w-full opacity-80" />

      {/* Hero Banner Skeleton */}
      <div className="bg-[#075570]/90 py-12 px-8 border-b border-white/10">
        <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20" />
            <div className="space-y-2">
              <div className="h-4 w-32 rounded bg-white/20" />
              <div className="h-8 w-64 rounded bg-white/30" />
            </div>
          </div>
          <div className="h-4 w-full max-w-2xl rounded bg-white/20" />
        </div>
      </div>

      {/* Sub-Category Pills Skeleton */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3">
        <div className="mx-auto max-w-7xl px-4 flex gap-3">
          <div className="h-8 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <main className="flex-grow py-8 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-3xl bg-slate-200 dark:bg-slate-800/60 p-5 space-y-4">
              <div className="aspect-square w-full rounded-2xl bg-slate-300 dark:bg-slate-700/60" />
              <div className="h-4 w-2/3 rounded bg-slate-300 dark:bg-slate-700" />
              <div className="h-4 w-1/3 rounded bg-slate-300 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
