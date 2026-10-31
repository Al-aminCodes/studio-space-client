"use client";

import { Building2, MapPin, Plus, Search, Star } from "lucide-react";
import { useState } from "react";
import type { Studio } from "./types";

type Props = {
  studios: Studio[];
  onAdd: () => void;
  onEdit: (studio: Studio) => void;
  onDelete: (id: string) => void;
};

export default function StudioListings({
  studios,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = studios.filter((studio) =>
    `${studio.name} ${studio.category} ${studio.location}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            My Studio Listings
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your creative spaces.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-white hover:opacity-90"
        >
          <Plus className="size-4" />
          Add Studio
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search studios..."
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((studio) => (
          <article
            key={studio.id}
            className="overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-48">
              <img
                src={studio.image}
                alt={studio.name}
                className="size-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1 text-xs font-semibold">
                {studio.status}
              </span>
              <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-background/90 px-2.5 py-1.5 text-xs font-semibold">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {studio.rating || "New"}
              </span>
            </div>

            <div className="p-4">
              <p className="text-xs font-semibold text-accent">
                {studio.category}
              </p>
              <h3 className="mt-2 truncate font-bold">{studio.name}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {studio.location}
              </p>

              <p className="mt-3 text-lg font-extrabold">
                ${studio.price}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / hour
                </span>
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => onEdit(studio)}
                  className="h-10 rounded-lg border border-border text-sm font-semibold hover:border-accent hover:text-accent"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(String(studio.id))}
                  className="h-10 rounded-lg border border-border text-sm font-semibold text-red-500 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border py-16 text-center">
            <Building2 className="mx-auto size-10 text-muted-foreground" />
            <h3 className="mt-4 font-bold">No studios found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different search or add a studio.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
