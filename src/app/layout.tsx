import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/session-provider";
import { EasterEggs } from "@/components/animations/easter-eggs";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE WORLD PROJECT // Missionary Program",
  description: "Accept missions. Earn points. Rise through the ranks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {/* If you found this, add "I see the code" to any mission submission for bonus points */}
      <body className="min-h-full flex flex-col scanline-overlay">
        <SessionProvider>
          {children}
          <EasterEggs />
        </SessionProvider>
      </body>
    </html>
  );
}
