"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type UploadPhoto = {
  file: File;
  previewUrl: string;
};

type UploadDraftContextValue = {
  photo: UploadPhoto | null;
  choosePhoto: (file: File) => void;
  clearPhoto: () => void;
};

const UploadDraftContext = createContext<UploadDraftContextValue | null>(null);

export function UploadDraftProvider({ children }: { children: React.ReactNode }) {
  const [photo, setPhoto] = useState<UploadPhoto | null>(null);
  const draftUrl = useRef<string | null>(null);

  const clearPhoto = useCallback(() => {
    if (draftUrl.current) URL.revokeObjectURL(draftUrl.current);
    draftUrl.current = null;
    setPhoto(null);
  }, []);

  const choosePhoto = useCallback((file: File) => {
    if (draftUrl.current) URL.revokeObjectURL(draftUrl.current);
    const previewUrl = URL.createObjectURL(file);
    draftUrl.current = previewUrl;
    setPhoto({ file, previewUrl });
  }, []);

  useEffect(() => () => {
    if (draftUrl.current) URL.revokeObjectURL(draftUrl.current);
  }, []);

  return (
    <UploadDraftContext.Provider value={{ photo, choosePhoto, clearPhoto }}>
      {children}
    </UploadDraftContext.Provider>
  );
}

export function useUploadDraft() {
  const context = useContext(UploadDraftContext);
  if (!context) {
    throw new Error("useUploadDraft must be used inside UploadDraftProvider");
  }
  return context;
}
