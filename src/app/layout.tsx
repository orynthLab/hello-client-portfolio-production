import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Michroma } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
    default: "OrynthBuild | AI, Machine Learning, Web & App Development",
    template: "%s | OrynthBuild",
  },
  description:
    "OrynthBuild builds AI and machine learning solutions, workflow automation, MVPs, websites and apps for founders and businesses, with white-label engineering for agencies.",
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
    title: "OrynthBuild | AI, Machine Learning, Web & App Development",
    description:
      "AI and machine learning solutions, workflow automation, MVPs, websites and apps for founders and businesses, with white-label engineering for agencies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OrynthBuild | AI, Machine Learning, Web & App Development",
    description:
      "AI and machine learning solutions, workflow automation, MVPs, websites and apps for founders and businesses, with white-label engineering for agencies.",
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
  "@id": `${SITE_URL}/#organization`,
  email: "contact@orynthbuild.site",
  description:
    "OrynthBuild builds AI and machine learning solutions, workflow automation, MVPs, websites and apps, and provides white-label engineering for agencies.",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "OrynthBuild",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <div className="noise-layer" />
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
      <GoogleAnalytics gaId="G-71Y3E7WE85" />
    </html>
  );
}
