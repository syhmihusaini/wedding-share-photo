"use client";

import { useEffect, useState } from "react";
import type { GalleryPhoto } from "./imagekit-photos";

export default function GalleryPhotoGrid({
  photos,
  error = false,
}: {
  photos: GalleryPhoto[];
  error?: boolean;
}) {
  const [currentPhotos, setCurrentPhotos] = useState(photos);

  useEffect(() => {
    const uploadId = new URLSearchParams(window.location.search).get("uploaded");
    if (uploadId === null) return;
    const expectedUploadedId: string = uploadId;

    let active = true;
    let timeout: number | undefined;
    async function refreshUntilUploaded() {
      const maxAttempts = expectedUploadedId.startsWith("new-") ? 1 : 30;

      for (let attempt = 0; attempt < maxAttempts && active; attempt += 1) {
        try {
          const response = await fetch(`/api/photos?check=${Date.now()}`, {
            cache: "no-store",
          });
          if (response.ok) {
            const result = (await response.json()) as { photos?: GalleryPhoto[] };
            const latestPhotos = result.photos ?? [];
            if (active) setCurrentPhotos(latestPhotos);

            if (latestPhotos.some((photo) => photo.id === expectedUploadedId)) break;
          }
        } catch {
          // Retry briefly while ImageKit finishes listing the uploaded file.
        }

        if (attempt + 1 < maxAttempts && active) {
          await new Promise<void>((resolve) => {
            timeout = window.setTimeout(resolve, 2_000);
          });
        }
      }

    }

    void refreshUntilUploaded();

    return () => {
      active = false;
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, []);

  if (error) {
    return <p className="album-gallery-empty">Photos could not load. Please refresh the page.</p>;
  }
  if (currentPhotos.length === 0) {
    return <p className="album-gallery-empty">No photos have been uploaded yet.</p>;
  }

  return (
    <>
      <div className="album-photo-grid">
        {currentPhotos.map((photo) => (
          <article className="album-photo-card" key={photo.id}>
            <div className="album-photo-frame">
              {/* The source is the public URL returned by ImageKit. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.title} loading="lazy" />
            </div>
            <div className="album-photo-copy">
              <h3>{photo.title}</h3>
              {photo.caption && <p>{photo.caption}</p>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
