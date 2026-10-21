import { Suspense } from "react";
import GalleryPhotoGrid from "../gallery-photo-grid";
import { getImageKitPhotos, type GalleryPhoto } from "../imagekit-photos";

async function GalleryPhotos() {
  let photos: GalleryPhoto[] = [];
  let error = false;

  try {
    photos = await getImageKitPhotos();
  } catch {
    error = true;
  }

  return <GalleryPhotoGrid photos={photos} error={error} />;
}

export default function GalleryPage() {
  return (
    <main className="album-page">
      <header className="album-intro">
        <h1>THE WEDDING OF IMAN &amp; SYAHMI</h1>
        <div className="album-progress-track" aria-hidden="true" />
        <p>
          Our forever, your presence, a memory to treasure. Thank you for being
          part of our story.
        </p>
        <div className="album-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/figma/album-hero.jpg"
            alt="Iman and Syahmi together at their wedding"
            width="1536"
            height="2304"
            fetchPriority="high"
          />
        </div>
      </header>

      <section
        className="album-gallery"
        id="photo-gallery"
        aria-labelledby="album-gallery-title"
      >
        <h2 id="album-gallery-title">PHOTO GALLERY</h2>
        <Suspense
          fallback={
            <p className="album-gallery-empty" role="status">
              Loading photos…
            </p>
          }
        >
          <GalleryPhotos />
        </Suspense>
      </section>
    </main>
  );
}
