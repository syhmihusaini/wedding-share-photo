"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { upload } from "@imagekit/next";
import { useState, type FormEvent } from "react";
import { useUploadDraft } from "./upload-draft-provider";

export default function PreUploadForm() {
  const { photo, clearPhoto } = useUploadDraft();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!photo || isUploading) return;

    if (!photo.file.type.startsWith("image/")) {
      setStatus("Please choose an image file.");
      return;
    }
    if (photo.file.size > 20 * 1024 * 1024) {
      setStatus("Please choose an image smaller than 20 MB.");
      return;
    }

    setIsUploading(true);
    setStatus("Uploading your photo…");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 120_000);
    try {
      const authResponse = await fetch("/api/upload-auth", {
        signal: controller.signal,
      });
      const auth = await authResponse.json();
      if (!authResponse.ok) {
        throw new Error(auth.error || "Photo upload is not configured yet.");
      }

      const fileName = photo.file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const customMetadata: Record<string, string> = {
        photoTitle: title.trim() || "Subheading",
      };
      if (caption.trim()) customMetadata.photoCaption = caption.trim();

      const uploadedPhoto = await upload({
        file: photo.file,
        fileName: fileName || "wedding-photo",
        folder: "/wedding-gallery",
        useUniqueFileName: true,
        isPrivateFile: false,
        tags: ["wedding-gallery"],
        customMetadata,
        abortSignal: controller.signal,
        checks: '"file.mime" IN ["image/jpeg","image/png","image/webp","image/gif","image/heic","image/heif","image/avif"] AND "file.size" <= 20971520',
        ...auth,
      });

      clearPhoto();
      const uploadedId = uploadedPhoto.fileId || `new-${Date.now()}`;
      router.push(
        `/gallery?uploaded=${encodeURIComponent(uploadedId)}#photo-gallery`,
      );
    } catch (error) {
      setStatus(
        controller.signal.aborted
          ? "The upload took too long. Check your connection and try again."
          : error instanceof Error
          ? error.message
          : "The photo could not be uploaded. Please try again.",
      );
    } finally {
      window.clearTimeout(timeout);
      setIsUploading(false);
    }
  }

  return (
    <main className="preupload-page">
      <div className="preupload-stage">
        {photo ? (
          <div className="preupload-photo-preview">
            {/* The photo is user-selected and stays dynamic. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.previewUrl} alt={`Selected photo: ${photo.file.name}`} />
          </div>
        ) : (
          <div className="preupload-no-photo">
            <p>Choose a photo to add to the album.</p>
            <Link href="/">Choose a photo</Link>
          </div>
        )}

        <form className="preupload-form" onSubmit={handleSubmit}>
          <label className="preupload-field preupload-title-field">
            <span className="visually-hidden">Photo title</span>
            <input
              type="text"
              placeholder="Subheading"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={100}
            />
          </label>
          <label className="preupload-field preupload-caption-field">
            <span className="visually-hidden">Photo caption</span>
            <textarea
              placeholder="text word"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              maxLength={500}
              rows={4}
            />
          </label>
          <button
            className="preupload-submit"
            type="submit"
            disabled={!photo || isUploading}
          >
            {isUploading ? "UPLOADING…" : "UPLOAD"}
          </button>
          <p className="preupload-status" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </main>
  );
}
