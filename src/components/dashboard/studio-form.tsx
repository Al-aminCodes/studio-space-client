"use client";

import { Building2, CheckCircle2 } from "lucide-react";
import type { Studio } from "./types";

type Props = {
  studio: Studio | null;
  onSubmit: (data: {
    name: string;
    category: string;
    location: string;
    price: number;
    image: string;
  }) => void;
  onCancel: () => void;
};

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Room",
  "Music Suite",
  "Art Workshop",
];

export default function StudioForm({ studio, onSubmit, onCancel }: Props) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const category = String(formData.get("category") || "");
    const location = String(formData.get("location") || "").trim();
    const image = String(formData.get("image") || "").trim();
    const price = Number(formData.get("price"));

    if (!name || !category || !location || !image || price <= 0) {
      return;
    }

    try {
      const parsed = new URL(image);
      if (!["https:", "http:"].includes(parsed.protocol)) return;
    } catch {
      return;
    }

    onSubmit({ name, category, location, price, image });
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          {studio ? "Edit Studio" : "Add New Studio"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {studio
            ? "Update your studio information."
            : "Share your creative space with the community."}
        </p>
      </div>

      <form
        key={studio?.id ?? "new-studio"}
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-7"
      >
        <h3 className="flex items-center gap-2 font-bold">
          <Building2 className="size-5 text-accent" />
          Studio information
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            Studio name
            <input
              name="name"
              required
              defaultValue={studio?.name ?? ""}
              placeholder="Lumiere Photo Studio"
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 outline-none focus:border-accent"
            />
          </label>

          <label className="space-y-2 text-sm font-medium">
            Category
            <select
              name="category"
              required
              defaultValue={studio?.category ?? ""}
              className="h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:border-accent"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium">
            Location
            <input
              name="location"
              required
              defaultValue={studio?.location ?? ""}
              placeholder="City, State"
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 outline-none focus:border-accent"
            />
          </label>

          <label className="space-y-2 text-sm font-medium">
            Price per hour ($)
            <input
              name="price"
              type="number"
              min="1"
              required
              defaultValue={studio?.price ?? ""}
              placeholder="45"
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 outline-none focus:border-accent"
            />
          </label>

          <label className="space-y-2 text-sm font-medium sm:col-span-2">
            Studio image URL
            <input
              name="image"
              type="url"
              required
              defaultValue={studio?.image ?? ""}
              placeholder="https://example.com/studio.jpg"
              className="h-11 w-full rounded-xl border border-border bg-background px-3.5 outline-none focus:border-accent"
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="h-11 rounded-xl border border-border px-5 text-sm font-semibold hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-bold text-white hover:opacity-90"
          >
            <CheckCircle2 className="size-4" />
            {studio ? "Save Changes" : "Create Studio"}
          </button>
        </div>
      </form>
    </section>
  );
}
