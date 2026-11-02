"use client";

import {
  Building2,
  Clock,
  Eye,
  Image as ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiStar } from "react-icons/fi";
import { toast } from "sonner";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl?: string;
  amenities?: string[];
  overview: string;
  userName?: string;
  userEmail?: string;
  userImage?: string;
  rating?: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ExploreStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        if (!API_URL) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured.");
        }

        const response = await fetch(`${API_URL}/studios`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch studios.");
        }

        const data = await response.json();

        const studioList: Studio[] = Array.isArray(data)
          ? data
          : Array.isArray(data.studios)
            ? data.studios
            : [];

        setStudios(studioList);
      } catch (error) {
        console.error("Fetch studios error:", error);
        toast.error("Could not load studios. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(studios.map((studio) => studio.category))],
    [studios],
  );

  const filteredStudios = useMemo(() => {
    const query = search.toLowerCase().trim();

    const result = studios.filter((studio) => {
      const matchesSearch =
        studio.title?.toLowerCase().includes(query) ||
        studio.location?.toLowerCase().includes(query) ||
        studio.category?.toLowerCase().includes(query) ||
        studio.overview?.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || studio.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "low") {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (sortBy === "high") {
      result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    }

    return result;
  }, [studios, search, selectedCategory, sortBy]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(Number(price) || 0);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 text-[var(--foreground)] transition-colors duration-300 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
            <Building2 size={17} />
            <span>STUDIOS DIRECTORY</span>
          </div>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Explore Studios
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                Discover creative spaces for photography, film production,
                podcasts, music, and more.
              </p>
            </div>

            <div className="w-fit rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <p className="text-xs text-[var(--muted)]">Available studios</p>
              <p className="mt-1 text-2xl font-bold text-[var(--accent)]">
                {studios.length}
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by studio, category, or location..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-11 pr-4 text-sm text-[var(--foreground)] outline-none transition placeholder:opacity-60 focus:border-[var(--accent)]"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
              />
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-10 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "All" ? "All Categories" : category}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
            >
              <option value="default">Sort: Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex items-center gap-3 text-[var(--muted)]">
              <Loader2
                className="animate-spin text-[var(--accent)]"
                size={24}
              />
              <span>Loading studios...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredStudios.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-16 text-center">
            <Building2 className="mx-auto mb-4 text-[var(--muted)]" size={42} />
            <h2 className="text-xl font-semibold">No studios found</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Try another search term or select a different category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setSortBy("default");
              }}
              className="mt-5 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Studio Cards */}
        {!loading && filteredStudios.length > 0 && (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredStudios.map((studio) => (
              <article
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-[var(--background)]">
                  {studio.imageUrl ? (
                    <img
                      src={studio.imageUrl}
                      alt={studio.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--muted)]">
                      <ImageIcon size={44} />
                    </div>
                  )}

                  <span className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/70 px-3 py-1.5 text-xs font-medium text-orange-300 backdrop-blur">
                    {studio.category}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-4 left-4">
                    <p className="text-sm text-gray-200">Starting from</p>
                    <p className="text-xl font-bold text-white">
                      ${formatPrice(studio.hourlyRate)}
                      <span className="text-sm font-normal text-gray-300">
                        {" "}
                        / hour
                      </span>
                    </p>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h2 className="line-clamp-1 text-xl font-bold">
                    {studio.title}
                  </h2>

                  <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
                    <MapPin
                      size={16}
                      className="shrink-0 text-[var(--accent)]"
                    />
                    <span className="line-clamp-1">{studio.location}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={17}
                          className={
                            star <= Math.round(Number(studio.rating) || 0)
                              ? "fill-amber-400 text-amber-400"
                              : "text-[var(--muted)]"
                          }
                        />
                      ))}
                    </div>

                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      {Number(studio.rating) > 0
                        ? Number(studio.rating).toFixed(1)
                        : "No rating"}
                    </span>

                    <span className="text-sm text-[var(--muted)]">/ 5</span>
                  </div>

                  {/* Amenities Preview */}

                  <Link
                    href={`/studios/${studio._id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    <Eye size={17} />
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {/* Studio Details Modal */}
      {selectedStudio && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedStudio(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="studio-modal-title"
            className="my-auto max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  Studio Details
                </p>
                <h2
                  id="studio-modal-title"
                  className="mt-1 text-lg font-bold sm:text-xl"
                >
                  {selectedStudio.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedStudio(null)}
                aria-label="Close studio details"
                className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {/* Full Image */}
              <div className="mb-6 h-56 overflow-hidden rounded-xl bg-[var(--background)] sm:h-80">
                {selectedStudio.imageUrl ? (
                  <img
                    src={selectedStudio.imageUrl}
                    alt={selectedStudio.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--muted)]">
                    <ImageIcon size={48} />
                  </div>
                )}
              </div>

              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-lg bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--accent)]">
                  {selectedStudio.category}
                </span>

                <p className="text-2xl font-bold">
                  ${formatPrice(selectedStudio.hourlyRate)}
                  <span className="text-sm font-normal text-[var(--muted)]">
                    {" "}
                    / hour
                  </span>
                </p>
              </div>

              {/* Main Information */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                    <MapPin size={16} className="text-[var(--accent)]" />
                    Location / Address
                  </p>
                  <p className="break-words font-medium">
                    {selectedStudio.location || "Not provided"}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                    <Users size={16} className="text-[var(--accent)]" />
                    Maximum Capacity
                  </p>
                  <p className="font-medium">
                    {selectedStudio.maxCapacity} people
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                    <ShieldCheck size={16} className="text-[var(--accent)]" />
                    Security Deposit
                  </p>
                  <p className="font-medium">
                    ${formatPrice(selectedStudio.securityDeposit)}
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                  <p className="mb-2 flex items-center gap-2 text-sm text-[var(--muted)]">
                    <Clock size={16} className="text-[var(--accent)]" />
                    Hourly Rate
                  </p>
                  <p className="font-medium">
                    ${formatPrice(selectedStudio.hourlyRate)} / hour
                  </p>
                </div>
              </div>

              {/* Overview */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Detailed Overview</h3>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[var(--muted)]">
                  {selectedStudio.overview || "No overview provided."}
                </p>
              </div>

              {/* All Amenities */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold">
                  Amenities & Facilities
                </h3>

                {selectedStudio.amenities?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedStudio.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--muted)]"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    No amenities listed.
                  </p>
                )}
              </div>

              {/* Owner Information */}
              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4">
                <h3 className="mb-4 font-semibold">Studio Owner</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <UserRound
                      size={18}
                      className="mt-0.5 shrink-0 text-[var(--accent)]"
                    />
                    <div>
                      <p className="text-xs text-[var(--muted)]">Owner Name</p>
                      <p className="mt-1 break-words text-sm text-[var(--foreground)]">
                        {selectedStudio.userName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-[var(--accent)]"
                    />
                    <div>
                      <p className="text-xs text-[var(--muted)]">Owner Email</p>
                      <p className="mt-1 break-all text-sm text-[var(--foreground)]">
                        {selectedStudio.userEmail || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudio(null)}
                className="mt-6 w-full rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)]"
              >
                Close Details
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
