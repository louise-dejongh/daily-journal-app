import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "sonner";

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
            <h1 className="text-xl font-semibold tracking-tight">Reflect</h1>
            <span className="text-sm text-muted-foreground">Profile</span>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
