"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Loader2,
  Building2,
  Image as ImageIcon,
} from "lucide-react";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl?: string;
  userEmail?: string;
  status?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyStudiosPage() {
  const { data: session, isPending: sessionLoading } = useSession();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const userEmail = session?.user?.email;

  const loadStudios = useCallback(async () => {
    if (!userEmail || !API_URL) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/my-listings/${encodeURIComponent(userEmail)}`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Could not load studios.");
      }

      const data = await response.json();

      const allStudios: Studio[] = Array.isArray(data)
        ? data
        : (data.studios ?? []);

      setStudios(allStudios);
    } catch (error) {
      console.error("Load studios error:", error);
      toast.error("Failed to load your studios.");
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) return;

    void Promise.resolve().then(loadStudios);
  }, [sessionLoading, session?.user, loadStudios]);

  const handleDelete = async (id: string) => {
    if (!API_URL) {
      toast.error("Server URL is not configured.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this studio?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`${API_URL}/my-listings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.message || "Failed to delete studio.");
      }

      setStudios((previous) => previous.filter((studio) => studio._id !== id));

      toast.success("Studio deleted successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price || 0);

  if (sessionLoading || (session?.user && loading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-background text-foreground">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 bg-background p-6 text-center text-foreground">
        <Building2 size={40} className="text-muted-foreground" />
        <h1 className="text-xl font-bold">Please log in</h1>
        <p className="text-sm text-muted-foreground">
          Log in to manage your studio listings.
        </p>
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
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            My Studio Listings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your studio spaces.
          </p>
        </div>

        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col justify-between gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-card-foreground">
                All Listings
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {studios.length} studio{studios.length === 1 ? "" : "s"}
              </p>
            </div>

            <Link
              href="/dashboard/add-studio"
              className="inline-flex items-center justify-center rounded-lg bg-[#ff6a00] px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              + Add New Studio
            </Link>
          </div>

          {studios.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Building2
                size={40}
                className="mx-auto mb-3 text-muted-foreground"
              />
              <h3 className="font-semibold">No studios listed yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your first studio to see it here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-medium">Studio</th>
                    <th className="px-4 py-4 font-medium">Category</th>
                    <th className="px-4 py-4 font-medium">Rate</th>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {studios.map((studio) => (
                    <tr
                      key={studio._id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {studio.imageUrl ? (
                              <Image
                                src={studio.imageUrl}
                                alt={studio.title}
                                fill
                                unoptimized
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon
                                  size={18}
                                  className="text-muted-foreground"
                                />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-56 truncate font-semibold text-card-foreground">
                              {studio.title}
                            </p>
                            <p className="mt-1 max-w-56 truncate text-xs text-muted-foreground">
                              {studio.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-muted-foreground">
                        {studio.category}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 font-medium">
                        {formatPrice(studio.hourlyRate)}
                        <span className="text-muted-foreground"> /hr</span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          {studio.status || "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/my-studios/edit/${studio._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
                          >
                            <Pencil size={14} />
                            Update
                          </Link>

                          <button
                            onClick={() => handleDelete(studio._id)}
                            disabled={deletingId === studio._id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400"
                          >
                            {deletingId === studio._id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
