import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Michroma } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const michroma = Michroma({
  variable: "--font-michroma",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hello Client — AI Product Studio",
  description:
    "We design and build AI agents, automation, and full-scale products. This portfolio is one of our own products.",
};

// viewportFit: "cover" lets fixed/full-bleed sections draw under the iPhone
// notch/Dynamic Island and home-indicator area instead of leaving a hard
// black bar there — paired with the env(safe-area-inset-*) padding added in
// globals.css on the elements that actually sit in those regions.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030407",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${michroma.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-ink">
        <div className="noise-layer" />
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
