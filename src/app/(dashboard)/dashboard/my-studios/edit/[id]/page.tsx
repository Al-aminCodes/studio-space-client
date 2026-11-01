"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useSession } from "@/lib/auth-client";
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

export default function EditStudioPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const hasLoadRequirements = Boolean(
    session?.user?.email && params.id && API_URL,
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    imageUrl: "",
    amenities: "",
    overview: "",
  });

  useEffect(() => {
    if (sessionLoading) return;

    const email = session?.user?.email;
    const id = params.id;

    if (!email || !id || !API_URL) {
      return;
    }

    let cancelled = false;

    async function loadStudio() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/my-listings/${encodeURIComponent(email!)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Could not load your listings.");
        }

        const data = await response.json();
        const studios: Studio[] = Array.isArray(data)
          ? data
          : (data.studios ?? []);

        const studio = studios.find((item) => String(item._id) === String(id));

        if (!studio) {
          throw new Error("Studio not found in your listings.");
        }

        if (cancelled) return;

        setForm({
          title: studio.title ?? "",
          category: studio.category ?? "",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? ""),
          maxCapacity: String(studio.maxCapacity ?? ""),
          location: studio.location ?? "",
          imageUrl: studio.imageUrl ?? "",
          amenities: (studio.amenities ?? []).join(", "),
          overview: studio.overview ?? "",
        });
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load studio.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStudio();

    return () => {
      cancelled = true;
    };
  }, [sessionLoading, session?.user?.email, params.id]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!API_URL) {
      toast.error("Server URL is not configured.");
      return;
    }

    if (!session?.user?.email) {
      toast.error("Please log in again.");
      router.push("/login");
      return;
    }

    if (
      !form.title.trim() ||
      !form.category ||
      !form.location.trim() ||
      !form.overview.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const hourlyRate = Number(form.hourlyRate);
    const securityDeposit = Number(form.securityDeposit);
    const maxCapacity = Number(form.maxCapacity);

    if (
      !Number.isFinite(hourlyRate) ||
      hourlyRate < 0 ||
      !Number.isFinite(securityDeposit) ||
      securityDeposit < 0 ||
      !Number.isInteger(maxCapacity) ||
      maxCapacity < 1
    ) {
      toast.error("Please enter valid prices and capacity.");
      return;
    }

    const updatedData = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate,
      securityDeposit,
      maxCapacity,
      location: form.location.trim(),
      imageUrl: form.imageUrl.trim(),
      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      overview: form.overview.trim(),
    };

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/my-listings/${encodeURIComponent(params.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        },
      );

      const result = await response.json().catch(() => null);
      console.log("Update studio response:", result);

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update studio.");
      }

      toast.success("Studio updated successfully!");
      router.push("/dashboard/my-studios");
      router.refresh();
    } catch (error) {
      console.error("Update studio error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (sessionLoading || (hasLoadRequirements && loading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={30} />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-xl font-bold">Please log in</h1>
        <Link
          href="/login"
          className="rounded-lg bg-primary px-5 py-2.5 text-primary-foreground"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/my-studios"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back to My Listings
        </Link>

        <div className="mb-6">
          <h1 className="mt-2 text-3xl text-[#0ea5e9] font-bold">
            Edit Studio
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update your studio information below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="title" className="text-sm font-medium">
                Studio title *
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
              >
                {[
                  "Photo Studio",
                  "Film Stage",
                  "Podcast Lounge",
                  "Music Suite",
                  "Workshop",
                  "Dance Studio",
                  "Meeting Room",
                  "Creative Workspace",
                  "Other",
                ].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location *
              </label>
              <input
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="hourlyRate" className="text-sm font-medium">
                Hourly rate ($) *
              </label>
              <input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                value={form.hourlyRate}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="securityDeposit" className="text-sm font-medium">
                Security deposit ($) *
              </label>
              <input
                id="securityDeposit"
                name="securityDeposit"
                type="number"
                min="0"
                step="0.01"
                value={form.securityDeposit}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxCapacity" className="text-sm font-medium">
                Maximum capacity *
              </label>
              <input
                id="maxCapacity"
                name="maxCapacity"
                type="number"
                min="1"
                step="1"
                value={form.maxCapacity}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">
                Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/studio.jpg"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="amenities" className="text-sm font-medium">
                Amenities
              </label>
              <input
                id="amenities"
                name="amenities"
                value={form.amenities}
                onChange={handleChange}
                placeholder="Wi-Fi, Lighting, Parking"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                Separate amenities with commas.
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="overview" className="text-sm font-medium">
                Studio overview *
              </label>
              <textarea
                id="overview"
                name="overview"
                value={form.overview}
                onChange={handleChange}
                required
                rows={5}
                className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/my-listings"
              className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff6a00] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
