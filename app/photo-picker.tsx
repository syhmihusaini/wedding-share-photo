"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useUploadDraft } from "./upload-draft-provider";

export default function PhotoPicker() {
  const router = useRouter();
  const { choosePhoto } = useUploadDraft();

  function handlePhotoSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file || !file.type.startsWith("image/")) return;

    choosePhoto(file);
    router.push("/upload");
  }

  return (
    <label className="invite-action invite-upload">
      <span>UPLOAD YOUR PICTURE HERE!</span>
      <input
        type="file"
        accept="image/*"
        aria-label="Choose a wedding picture to upload"
        onChange={handlePhotoSelected}
      />
    </label>
  );
}
