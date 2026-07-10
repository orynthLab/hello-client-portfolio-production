import type { Metadata } from "next";
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
