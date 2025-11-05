import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import { Toaster } from "sonner";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Daily Journal",
  description: "A simple, elegant journaling UI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <header className="border-b bg-background/50 backdrop-blur">
          <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                className="w-10 h-10 rounded-sm"
                src="/images/reflect-logo.png"
                alt="Reflect logo"
                width={40}
                height={40}
              />

              <h1
                className={`text-xl font-semibold tracking-tight ${playfair.className}`}
              >
                Reflect
              </h1>
            </div>

            <Image
              className="w-10 h-10 rounded-full"
              src="/images/profile-placeholder.jpg"
              alt="Profile picture"
              width={40}
              height={40}
            />
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
