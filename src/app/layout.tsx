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

const SITE_URL = "https://orynthbuild.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OrynthBuild — White-Label Execution Agency for AI, Web & Full-Stack Development",
    template: "%s | OrynthBuild",
  },
  description:
    "OrynthBuild is a white-label execution and tech partner for founders and agencies worldwide — full-stack web development, AI agent engineering, and outsourced product builds delivered under your brand, on time. Hello Client is one of our own products.",
  keywords: [
    "white label execution agency",
    "white label development agency",
    "white label tech partner",
    "white label software development",
    "tech execution partner",
    "outsource web development",
    "outsource software development",
    "full stack development agency",
    "AI agent development agency",
    "AI product studio",
    "product engineering partner",
    "OrynthBuild",
    "Hello Client",
  ],
  applicationName: "OrynthBuild",
  authors: [{ name: "OrynthBuild" }],
  creator: "OrynthBuild",
  publisher: "OrynthBuild",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "OrynthBuild",
    title: "OrynthBuild — White-Label Execution Agency for AI, Web & Full-Stack Development",
    description:
      "White-label execution and tech partner for founders and agencies worldwide — full-stack web, AI agents, and outsourced product builds delivered under your brand.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OrynthBuild — White-Label Execution Agency for AI, Web & Full-Stack Development",
    description:
      "White-label execution and tech partner for founders and agencies worldwide — full-stack web, AI agents, and outsourced product builds delivered under your brand.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OrynthBuild",
  url: SITE_URL,
  email: "contact@orynthbuild.site",
  description:
    "OrynthBuild is a white-label execution and tech partner for founders and agencies worldwide, delivering full-stack web development, AI agent engineering, and outsourced product builds under client brands.",
  slogan: "White-label execution for teams who need to ship.",
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <div className="noise-layer" />
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
