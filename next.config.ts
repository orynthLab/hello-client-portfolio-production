import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// ---------------------------------------------------------------------------
// Content Security Policy
//
// Every origin here is one this site actually contacts — verified against the
// built output, not assumed:
//   googletagmanager / google-analytics  GA4, loaded via @next/third-parties
//   api.web3forms.com                    the contact form's only fetch target
//
// Fonts are NOT an external origin: next/font/google downloads and self-hosts
// them at build time, so font-src stays 'self'. The social profile URLs in the
// JSON-LD are link targets, never requests, so they need no allowance.
//
// Honest note on 'unsafe-inline' for scripts: Next injects inline bootstrap
// and hydration scripts, and this site also emits inline JSON-LD. The strict
// alternative is a per-request nonce, which requires dynamic rendering — and
// every page here is statically prerendered, which is the whole performance
// and security posture of the site. So script-src keeps 'unsafe-inline' and
// earns its value elsewhere: an injected <script src> pointing at an attacker
// origin is blocked, object-src and base-uri are shut, and frame-ancestors
// stops the page being framed at all.
// ---------------------------------------------------------------------------
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://api.web3forms.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Clickjacking. frame-ancestors above is the modern control; this is the
  // fallback for anything that still only understands the legacy header.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs any of these, so none of them are available to a
  // script that manages to run.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()",
  },
  // Two years, subdomains included. Only meaningful over HTTPS, which is all
  // Vercel serves.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework or its version to a scanner.
  poweredByHeader: false,

  reactStrictMode: true,

  // Source maps are already off for production browsers by default; stated
  // explicitly so a future change has to be deliberate rather than accidental.
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        // every route, including static assets
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
