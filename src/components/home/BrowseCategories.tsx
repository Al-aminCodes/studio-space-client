import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const categories = [
  {
    name: "Photo Studios",
    value: "Photo Studio",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80",
    description: "Capture your creative vision",
  },
  {
    name: "Sound Stages",
    value: "Film Stage",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
    description: "Bring your stories to life",
  },
  {
    name: "Podcast Rooms",
    value: "Podcast Lounge",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80",
    description: "Share your voice with the world",
  },
  {
    name: "Music Suites",
    value: "Music Suite",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=80",
    description: "Create your own sound",
  },
  {
    name: "Art Workshops",
    value: "Workshop",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80",
    description: "Create something extraordinary",
  },
];

type CategoryCount = {
  _id: string;
  count: number;
};

async function getCategoryCounts(): Promise<CategoryCount[]> {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    const response = await fetch(`${API_URL}/studios/categories/count`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch category counts");
    }

    const result = await response.json();

    return result.data ?? [];
  } catch (error) {
    console.error("Category count error:", error);
    return [];
  }
}

export default async function BrowseCategories() {
  const categoryCounts = await getCategoryCounts();

  return (
    <section className="container-page section-spacing">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            Browse by Studio Categories
          </h2>

          <p className="mt-2 text-sm text-muted">
            Discover the perfect creative space for your next project.
          </p>
        </div>

        <Link
          href="/studios"
          className="hidden text-sm font-semibold text-accent hover:underline sm:block"
        >
          View All →
        </Link>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => {
          const count =
            categoryCounts.find((item) => item._id === category.value)?.count ??
            0;

          return (
            <Link
              key={category.value}
              href={`/studios?category=${encodeURIComponent(category.value)}`}
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-xl"
            >
              {/* Online Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category Title */}
                <h3 className="absolute bottom-4 left-4 text-lg font-bold text-white">
                  {category.name}
                </h3>
              </div>

              {/* Category Information */}
              <div className="p-4">
                <p className="text-sm text-muted">{category.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">
                    {count} {count === 1 ? "Studio" : "Studios"}
                  </span>

                  <span className="text-sm font-semibold text-accent transition-transform duration-300 group-hover:translate-x-1">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
