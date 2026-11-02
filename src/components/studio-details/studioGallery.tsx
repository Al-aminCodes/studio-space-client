"use client";

import Image from "next/image";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPlus, FiX } from "react-icons/fi";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { Studio } from "./types";

type StudioGalleryProps = {
  studio: Studio;
  isStudioOwner: boolean;
  onSaveImages: (images: string[]) => Promise<boolean>;
};

export default function StudioGallery({
  studio,
  isStudioOwner,
  onSaveImages,
}: StudioGalleryProps) {
  const initialImages =
    studio.images ?? (studio.imageUrl ? [studio.imageUrl] : []);

  const [galleryImages, setGalleryImages] = useState<string[]>(() =>
    Array.from(new Set(initialImages.filter(Boolean))),
  );

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [gallerySaving, setGallerySaving] = useState(false);

  const activeImage = galleryImages[activeImageIndex];

  const handleAddImage = async () => {
    const url = imageUrlInput.trim();

    if (!url) {
      toast.error("Please enter an image URL.");
      return;
    }

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        toast.error("Please enter a valid image URL.");
        return;
      }
    } catch {
      toast.error("Invalid image URL.");
      return;
    }

    if (galleryImages.includes(url)) {
      toast.error("This image already exists.");
      return;
    }

    if (galleryImages.length >= 20) {
      toast.error("Maximum 20 images allowed.");
      return;
    }

    const updatedImages = [...galleryImages, url];

    setGallerySaving(true);

    try {
      const saved = await onSaveImages(updatedImages);

      if (!saved) return;

      setGalleryImages(updatedImages);
      setActiveImageIndex(updatedImages.length - 1);
      setImageUrlInput("");
      setShowImageInput(false);

      toast.success("Image added successfully!");
    } finally {
      setGallerySaving(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    if (!isStudioOwner || gallerySaving) return;

    const updatedImages = galleryImages.filter(
      (_, imageIndex) => imageIndex !== index,
    );

    setGallerySaving(true);

    try {
      const saved = await onSaveImages(updatedImages);

      if (!saved) return;

      setGalleryImages(updatedImages);

      setActiveImageIndex((currentIndex) => {
        if (updatedImages.length === 0) return 0;
        if (currentIndex > index) return currentIndex - 1;
        if (currentIndex === index) {
          return Math.min(index, updatedImages.length - 1);
        }
        return currentIndex;
      });

      toast.success("Image removed successfully!");
    } finally {
      setGallerySaving(false);
    }
  };

  const handlePreviousImage = () => {
    if (galleryImages.length <= 1) return;

    setActiveImageIndex((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const handleNextImage = () => {
    if (galleryImages.length <= 1) return;

    setActiveImageIndex((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <div>
      <div className="relative h-[280px] overflow-hidden rounded-2xl border sm:h-[420px]">
        {activeImage ? (
          <Image
            key={activeImage}
            src={activeImage}
            alt={`${studio.title} image`}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            No studio image available
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-5">
          <span className="rounded-md bg-white px-3 py-1 text-sm text-gray-900">
            {studio.category}
          </span>
        </div>

        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePreviousImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <FiChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}

        {galleryImages.length > 0 && (
          <div className="absolute right-4 top-4 z-20 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {activeImageIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 0 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${
                activeImageIndex === index
                  ? "border-orange-500"
                  : "border-transparent"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveImageIndex(index)}
                className="relative h-full w-full"
              >
                <Image
                  src={image}
                  alt={`${studio.title} thumbnail ${index + 1}`}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-cover"
                />
              </button>

              {isStudioOwner && (
                <button
                  type="button"
                  onClick={() => void handleRemoveImage(index)}
                  disabled={gallerySaving}
                  className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add image */}
      {isStudioOwner && (
        <div className="mt-4">
          {!showImageInput ? (
            <Button
              type="button"
              onClick={() => setShowImageInput(true)}
              className="gap-2 text-white"
            >
              <FiPlus size={18} />
              Add Image
            </Button>
          ) : (
            <div className="rounded-xl border p-4">
              <div className="mb-3 flex justify-between">
                <h3 className="font-semibold">Add Gallery Image</h3>

                <button
                  type="button"
                  onClick={() => {
                    setShowImageInput(false);
                    setImageUrlInput("");
                  }}
                  disabled={gallerySaving}
                >
                  <FiX size={18} />
                </button>
              </div>

              <input
                type="url"
                value={imageUrlInput}
                onChange={(event) => setImageUrlInput(event.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={gallerySaving}
                className="w-full rounded-lg border bg-transparent px-4 py-3 text-sm"
              />

              <div className="mt-4 flex gap-2">
                <Button
                  type="button"
                  onClick={() => void handleAddImage()}
                  disabled={gallerySaving}
                >
                  {gallerySaving ? "Saving..." : "Add Image"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={gallerySaving}
                  onClick={() => {
                    setShowImageInput(false);
                    setImageUrlInput("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
