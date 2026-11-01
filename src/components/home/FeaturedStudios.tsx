import Link from "next/link";
import type { Studio } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getFeaturedStudios(): Promise<Studio[]> {
  try {
    const response = await fetch(`${API_URL}/studios-limit`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    console.log("Featured API result:", result);

    // Supports both response formats
    const studios = Array.isArray(result)
      ? result
      : (result.data ?? result.studios ?? []);

    return studios;
  } catch (error) {
    console.error("Featured studios error:", error);
    return [];
  }
}

export default async function FeaturedStudios() {
  const studios = await getFeaturedStudios();

  return (
    <section className="container-page py-12">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Featured Studios
          </h2>

          <p className="mt-1 text-sm text-muted">
            Top-rated studios, handpicked for your creative projects.
          </p>
        </div>

        <Link
          href="/studios"
          className="text-sm font-semibold text-accent hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Studio Cards */}
      {studios.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {studios.map((studio) => (
            <article
              key={studio._id}
              className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-background">
                {studio.imageUrl ? (
                  <img
                    src={studio.imageUrl}
                    alt={studio.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl">
                    🎥
                  </div>
                )}

                {/* Category */}
                <span className="absolute left-2 top-2 rounded-full bg-accent px-3 py-1 text-[10px] font-semibold text-white">
                  {studio.category}
                </span>

                {/* Rating */}
                <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white">
                  ⭐ {studio.rating != null ? studio.rating.toFixed(1) : "New"}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-3 p-3">
                <h3 className="truncate text-sm font-bold text-foreground">
                  {studio.title}
                </h3>

                <p className="text-base font-bold text-accent">
                  ${studio.hourlyRate}
                  <span className="text-xs font-normal text-muted"> / hr</span>
                </p>

                <p className="truncate text-xs text-muted">
                  📍 {studio.location}
                </p>

                <Link
                  href={`/studios/${studio._id}`}
                  className="block rounded-lg bg-accent px-3 py-2 text-center text-xs font-semibold text-white transition hover:opacity-90"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface py-12 text-center">
          <p className="text-muted">No featured studios available right now.</p>
        </div>
      )}
    </section>
  );
}
