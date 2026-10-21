import type { Metadata } from "next";
import "./globals.css";
import { UploadDraftProvider } from "./upload-draft-provider";

export const metadata: Metadata = {
  title: "Iman & Syahmi — Wedding Photos",
  description:
    "Celebrate Iman and Syahmi and share your favorite wedding pictures in their album.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <UploadDraftProvider>{children}</UploadDraftProvider>
      </body>
    </html>
  );
}
