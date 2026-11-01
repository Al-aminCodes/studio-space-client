import { Loader2 } from "lucide-react";

type PageLoaderProps = {
  title?: string;
  description?: string;
  cards?: number;
};

export default function PageLoader({
  title = "Loading StudioSpace",
  description = "Preparing your workspace...",
  cards = 3,
}: PageLoaderProps) {
  return (
    <main className="min-h-[70vh] bg-[#0d0e12] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
          </div>

          <div>
            <div className="h-5 w-44 animate-pulse rounded bg-white/10" />
            <p className="mt-2 text-sm text-gray-400">{description}</p>
          </div>
        </div>

        <div className="mb-8 space-y-3">
          <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-white/10" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-white/5" />
          <p className="pt-1 text-sm font-medium text-orange-400">{title}...</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cards }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-[#2a2d37] bg-[#16181e]"
            >
              <div className="h-48 animate-pulse bg-white/5 sm:h-56" />

              <div className="space-y-4 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />

                <div className="flex items-center justify-between pt-3">
                  <div className="h-6 w-24 animate-pulse rounded bg-white/10" />
                  <div className="h-9 w-24 animate-pulse rounded-lg bg-orange-500/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
