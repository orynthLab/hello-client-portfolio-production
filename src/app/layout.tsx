import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Michroma } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { jsonLd } from "@/lib/jsonLd";

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
  // No `keywords` meta: search engines have ignored it for years, and the
  // production SEO pass removed it deliberately. Keyword intent lives in the
  // page copy and the per-service content instead.
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

// Structured data, as rewritten by the production SEO pass.
//
// The Organization carries a stable @id so every other schema on the site —
// Service, CreativeWork, WebSite — can point at this one entity instead of
// each re-describing the company.
//
// What used to live here and deliberately no longer does: hasOfferCatalog,
// knowsAbout, areaServed and slogan, all of which restated in schema what the
// service pages now say in real content; and an FAQPage listing five
// questions that appear nowhere on the homepage. Google requires FAQ markup
// to match visible page content, so that one was a liability rather than an
// asset. The FAQ schema now sits on the service pages, next to FAQs a
// visitor can actually read.
//
// sameAs is kept: those profile links are the only thing here that ties this
// entity to its presence elsewhere, and nothing in the SEO pass replaced them.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "OrynthBuild",
  url: SITE_URL,
  email: "contact@orynthbuild.site",
  // Googles entity panel looks for a logo on the Organization; without one
  // the brand has no image attached to it anywhere in structured data. The
  // file is the same mark the site renders in AIBrandMark, nothing new.
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/logo.svg`,
    width: 512,
    height: 512,
  },
  sameAs: [
    "https://clutch.co/profile/orynthbuild",
    "https://www.goodfirms.co/company/orynthbuild",
    "https://www.linkedin.com/company/orynthbuild",
    "https://www.instagram.com/orynthbuild.tech/",
    "https://www.facebook.com/profile.php?id=61592485095565",
  ],
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
        {/* JSON-LD is serialized from the literals above, never from user
            input — the only way to emit a raw <script> body in JSX. Escaped
            through jsonLd() regardless: JSON.stringify does not escape "<",
            so a future value containing "</script>" would otherwise close
            this tag early and turn structured data into an injection point. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd) }} />
        <div className="noise-layer" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
      {/* Analytics, deliberately off the critical path.

          @next/third-parties' <GoogleAnalytics> mounts gtag.js through next/script's
          default `afterInteractive` strategy, so it runs during hydration: 163 KB of
          third-party JavaScript and ~130ms of scripting competing with the page's own
          first paint. On mobile that was a measurable share of the project pages' total
          blocking time.

          `lazyOnload` holds both tags until after the load event. The config call still
          runs and the dataLayer shim is defined first, so the pageview and any later
          gtag() calls behave exactly as before — only the timing of the request moves.

          Inline script bodies are permitted here: the CSP in next.config.ts keeps
          'unsafe-inline' for script-src because every page is statically prerendered
          and a per-request nonce would force dynamic rendering. */}
      <Script id="ga-init" strategy="lazyOnload">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-71Y3E7WE85');`}
      </Script>
      <Script
        id="ga-src"
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-71Y3E7WE85"
      />
    </html>
  );
}
