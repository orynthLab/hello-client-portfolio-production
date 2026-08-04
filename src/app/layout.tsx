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
    default: "OrynthBuild — AI, ML, Web & App Development, Tech Partner",
    template: "%s | OrynthBuild",
  },
  description:
    "OrynthBuild builds AI agents, machine learning tools, websites, UI/UX, and apps for founders, startups, and businesses in any industry, worldwide — as a direct build, or white-label under an agency's brand. Hello Client is one of our own products.",
  keywords: [
    "custom software development company",
    "software development for businesses",
    "business website development",
    "custom web application development",
    "digital product development company",
    "machine learning development company",
    "ML development agency",
    "UI UX design agency",
    "UI UX design company",
    "app development company",
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
    title: "OrynthBuild — AI, ML, Web & App Development, Tech Partner",
    description:
      "AI agents, machine learning tools, websites, UI/UX, and apps for founders and businesses worldwide — direct, or white-label under your agency's brand.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OrynthBuild — AI, ML, Web & App Development, Tech Partner",
    description:
      "AI agents, machine learning tools, websites, UI/UX, and apps for founders and businesses worldwide — direct, or white-label under your agency's brand.",
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
  sameAs: [
    "https://clutch.co/profile/orynthbuild",
    "https://www.goodfirms.co/company/orynthbuild",
    "https://www.linkedin.com/company/orynthbuild",
    "https://www.instagram.com/orynthbuild.tech/",
    "https://www.facebook.com/profile.php?id=61592485095565",
  ],
  description:
    "OrynthBuild builds AI agents, machine learning tools, websites, UI/UX, and apps for businesses in any industry worldwide, as a direct build or white-label under an agency's brand.",
  slogan: "We build what you need to ship — for your business, or under your brand.",
  areaServed: ["Worldwide", "India"],
  knowsAbout: [
    "AI Agent Development",
    "Machine Learning Development",
    "MVP Development",
    "Workflow Automation",
    "Full-Stack Web Development",
    "UI/UX Design",
    "App Development",
    "White-Label Software Development",
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
          name: "Machine Learning Development",
          description: "ML tools and models built into real products, not standalone notebooks.",
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
          name: "UI/UX Design",
          description: "Interface and experience design for websites, apps, and products.",
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does OrynthBuild build?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OrynthBuild builds AI agents, machine learning tools, MVPs, workflow automation systems, and full-stack websites, UI/UX, and apps — from first line of code to deployed, working software.",
      },
    },
    {
      "@type": "Question",
      name: "Does OrynthBuild only work with agencies, or with direct clients too?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both. OrynthBuild works as a white-label execution partner for agencies that need extra engineering capacity, and directly with founders, startups, and businesses that need a product built end-to-end under their own name.",
      },
    },
    {
      "@type": "Question",
      name: "What industries does OrynthBuild work with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OrynthBuild works with businesses across industries — including finance, banking, logistics, and other sectors that need custom software, AI agents, or automation, not just technology companies.",
      },
    },
    {
      "@type": "Question",
      name: "Does OrynthBuild work with clients outside India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. OrynthBuild is based in India and works with founders, startups, and agencies worldwide, including the US, UK, UAE, Canada, and Germany.",
      },
    },
    {
      "@type": "Question",
      name: "What is white-label execution?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "White-label execution means OrynthBuild builds the product or feature, and the client (usually an agency) delivers it to their own end client under their own brand, with no mention of OrynthBuild.",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
