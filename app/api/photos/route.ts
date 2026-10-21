import { connection } from "next/server";
import { getImageKitPhotos } from "../../imagekit-photos";

export async function GET() {
  await connection();

  try {
    const photos = await getImageKitPhotos();
    return Response.json({ photos });
  } catch {
    const status = process.env.IMAGEKIT_PRIVATE_KEY ? 502 : 503;
    return Response.json(
      { error: "The photo gallery could not be loaded.", photos: [] },
      { status },
    );
  }
}
