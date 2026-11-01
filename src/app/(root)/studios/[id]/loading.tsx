import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StudioDetailsLoading() {
  return (
    <main className="min-h-screen bg-[#0d0e12] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Back navigation */}
        <Link
          href="/explore-studios"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400"
        >
          <ArrowLeft size={16} />
          Back to Studios
        </Link>

        {/* Loading title */}
        <div className="mb-6 flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
          <p className="text-sm font-medium text-orange-400">
            Loading studio details...
          </p>
        </div>

        {/* Main details */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Image skeleton */}
          <div className="space-y-4 lg:col-span-3">
            <div className="h-72 animate-pulse rounded-2xl bg-[#16181e] sm:h-[420px]" />

            <div className="space-y-3 rounded-2xl border border-[#2a2d37] bg-[#16181e] p-6">
              <div className="h-6 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-white/5" />

              <div className="space-y-2 pt-4">
                <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-white/5" />
              </div>
            </div>

            {/* Amenities */}
            <div className="rounded-2xl border border-[#2a2d37] bg-[#16181e] p-6">
              <div className="mb-5 h-6 w-36 animate-pulse rounded bg-white/10" />

              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-9 w-24 animate-pulse rounded-lg bg-white/5"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <aside className="h-fit space-y-5 rounded-2xl border border-[#2a2d37] bg-[#16181e] p-6 lg:col-span-2">
            <div className="h-7 w-2/3 animate-pulse rounded bg-white/10" />

            <div className="h-10 w-1/2 animate-pulse rounded bg-orange-500/20" />

            <div className="space-y-4 border-y border-[#2a2d37] py-5">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
                  <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
                </div>
              ))}
            </div>

            <div className="h-12 w-full animate-pulse rounded-xl bg-orange-500/30" />

            <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
          </aside>
        </div>
      </div>
    </main>
  );
}
