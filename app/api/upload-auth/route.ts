import { getUploadAuthParams } from "@imagekit/next/server";
import { connection } from "next/server";

export async function GET() {
  await connection();

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return Response.json(
      { error: "Image uploads are not configured yet. Add the ImageKit keys and restart the server." },
      { status: 503 },
    );
  }

  const { token, expire, signature } = getUploadAuthParams({
    publicKey,
    privateKey,
    expire: Math.floor(Date.now() / 1000) + 60 * 10,
  });

  return Response.json({ token, expire, signature, publicKey });
}
