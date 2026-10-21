export type GalleryPhoto = {
  id: string;
  url: string;
  title: string;
  caption: string;
};

type ImageKitAsset = {
  fileId: string;
  name: string;
  url: string;
  fileType?: string;
  customMetadata?: {
    photoTitle?: string;
    photoCaption?: string;
  };
};

export async function getImageKitPhotos(): Promise<GalleryPhoto[]> {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) throw new Error("ImageKit is not configured.");

  const credentials = Buffer.from(`${privateKey}:`).toString("base64");
  const params = new URLSearchParams({
    path: "/wedding-gallery/",
    type: "file",
    fileType: "image",
    sort: "DESC_CREATED",
    limit: "1000",
  });
  const response = await fetch(`https://api.imagekit.io/v1/files?${params}`, {
    headers: { Authorization: `Basic ${credentials}` },
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("ImageKit photo listing failed", response.status);
    throw new Error("The photo gallery could not be loaded.");
  }

  const assets = (await response.json()) as ImageKitAsset[];
  return assets
    .filter((asset) => asset.fileType === "image" && asset.url)
    .map((asset) => ({
      id: asset.fileId,
      url: asset.url,
      title: asset.customMetadata?.photoTitle || asset.name,
      caption: asset.customMetadata?.photoCaption || "",
    }));
}
