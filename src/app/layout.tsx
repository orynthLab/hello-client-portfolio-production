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

const SITE_URL = "https://www.orynthbuild.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OrynthBuild — White-Label Execution Agency for AI, Web & Full-Stack Development",
    template: "%s | OrynthBuild",
  },
  description:
    "OrynthBuild is a white-label execution and tech partner for founders and agencies worldwide — AI agent development, MVP development, workflow automation, and full-stack web & app development delivered under your brand, on time. Hello Client is one of our own products.",
  keywords: [
    "white label execution agency",
    "white label development agency",
    "white label tech partner",
    "white label software development",
    "tech execution partner",
    "outsource web development",
    "outsource software development",
    "outsource app development",
    "full stack development agency",
    "full stack development company India",
    "AI agent development agency",
    "AI agent development company",
    "MVP development agency",
    "MVP development company India",
    "startup MVP development",
    "workflow automation agency",
    "business automation company",
    "app development agency",
    "web development agency India",
    "web development company India",
    "product engineering partner",
    "AI product studio",
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
    "OrynthBuild is a white-label execution and tech partner for founders and agencies worldwide, delivering AI agent development, MVP development, workflow automation, and full-stack web & app development under client brands.",
  slogan: "White-label execution for teams who need to ship.",
  areaServed: ["Worldwide", "India"],
  knowsAbout: [
    "White-Label Software Development",
    "AI Agent Development",
    "MVP Development",
    "Workflow Automation",
    "Full-Stack Web Development",
    "App Development",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "OrynthBuild Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "AI Agent Development",
          description: "Design and engineering of production AI agents for founders and agencies.",
          areaServed: ["Worldwide", "India"],
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "MVP Development",
          description: "Fast, full-stack MVP builds for startups and founders taking an idea to launch.",
          areaServed: ["Worldwide", "India"],
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Workflow & Business Automation",
          description: "Automation systems that remove manual, repetitive work from client operations.",
          areaServed: ["Worldwide", "India"],
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Full-Stack Web & App Development",
          description: "End-to-end web and app development, from product design through deployment.",
          areaServed: ["Worldwide", "India"],
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "White-Label Execution",
          description: "Outsourced product and engineering execution delivered under a client's own brand.",
          areaServed: ["Worldwide", "India"],
        },
      },
    ],
  },
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
