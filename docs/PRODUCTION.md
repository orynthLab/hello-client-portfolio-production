# Production Notes

Internal documentation for the private repository — deployment, infrastructure,
environment configuration, and operational notes that don't belong in the
public-facing README.

## Architecture

Same architecture as the public README describes (Home → The Core → eight
project worlds, one shared framework). Eight service pages live alongside
them at `/services/[slug]`; they are reached by URL and the sitemap rather
than from the portfolio, which is deliberate. Nothing behind this app is server-side
beyond what Next.js itself renders — there is no database, no custom API
route, and no server-held secret. The only outbound integration is a
client-side POST to Web3Forms for the contact form.

Every project page (`/projects/[slug]`) is statically generated at build time
via `generateStaticParams` — confirm with `npm run build`, which should show
`● (SSG)` for that route and list every project slug under it. The home page
is fully static (`○`). There is no dynamic/on-demand rendering anywhere in
this app.

## Deployment

Deployed to **Vercel**, connected to this repository. **A push to `master`
is the deploy** — Vercel builds and promotes it automatically, typically
live within a minute or two. There is no CLI step; do not run
`npx vercel --prod`, and there is no `.vercel` directory to link.

No `vercel.json` is required or present — the zero-config defaults are
correct for this app.

If a different host is ever used instead: this app has no server runtime
requirements beyond what `next start` needs (Node.js), and no database to
provision.

## Infrastructure

- **Hosting**: Vercel (CDN + static hosting; no server compute needed beyond
  the Next.js build step)
- **Video assets**: eight walkthroughs served from `/public/videos/`,
  totalling roughly 70 MB. The two largest are
  `cross-border-transfer-engine.mp4` (~23 MB, a 7.5-minute walkthrough —
  long rather than badly encoded, and already at ~285 kbps) and
  `aviation-preparation-academy.mp4` (~14 MB). The rest sit between 4 and
  11 MB.

  `financial-report-agent.mp4` was 66 MB and is now ~11 MB, re-encoded at
  the same resolution (SSIM 0.9977) — that one is resolved.

  All eight use `preload="metadata"`, so none of this weight is fetched
  until a visitor presses play; it costs deploy size and playback start,
  not page load.

  These are committed directly to the repo and served by Vercel's CDN as
  static files. If video count or size grows further, consider moving to a
  dedicated video host/CDN (Mux, Cloudflare Stream, or an object store with
  its own CDN) rather than continuing to grow the git repository.

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Yes | Contact form submission (see `src/components/ContactModal.tsx`). Get one free at web3forms.com. It's a client-side/public-by-design key (like a reCAPTCHA site key) — treat it as configuration, not a secret, but it still shouldn't be committed so it can be rotated without a code change. |

Set this in Vercel under **Project → Settings → Environment Variables** for
Production, Preview, and Development as needed. Locally, copy `.env.example`
to `.env.local` (git-ignored) and fill in the real value.

There are currently no other environment variables, no database connection
strings, and no third-party API keys beyond the one above.

## Production Notes

- **Reduced motion**: `prefers-reduced-motion: reduce` is respected globally
  (see the `@media` block in `globals.css` and the `prefersReducedMotion()`
  guard in `motion.ts`, used across `WorldBackground.tsx`, `TheCore.tsx`, and
  `Arrival.tsx`). Verify this still holds after any future animation work.
- **Modal accessibility**: `ContactModal`, `ReadmeModal`, and `VideoLightbox`
  all share `useModalA11y` (focus-trap, Escape-to-close, focus-restore-on-close,
  `role="dialog"`/`aria-modal`). Any new modal should use the same hook rather
  than reimplementing this.
- **Performance discipline established during development** (keep intact in
  future changes):
  - Every `repeat: -1` GSAP loop is either scroll-visibility-gated
    (`ScrollTrigger`) or paused via `pauseWorldForOverlay()` while any modal
    is open.
  - Seeded-random background data (freight nodes, particles, etc.) is
    computed once at module scope, never inside a component body.
  - `backdrop-filter: blur()` is avoided over continuously-animating
    backgrounds — modal scrims are solid once `pauseWorldForOverlay()` has
    stopped what's behind them.
- **Cross-browser verified**: Chromium, Firefox, and WebKit, against the
  production build (not just dev mode) — see the QA pass in project history.
  Re-verify on all three after any animation-heavy change.

## Monitoring

Worth adding as the site becomes a real lead-generation surface:

- **Vercel Analytics** (or a privacy-respecting alternative) for real traffic
  and Core Web Vitals visibility
- **Error tracking** (e.g. Sentry) — console errors are currently only caught
  during manual QA
- **Contact-form delivery checks.** Test-submit the form periodically, or move
  to a plan with delivery webhooks.

<!-- Deliberately kept general. This repository is occasionally made public,
     and a precise inventory of which alerts do not exist is the one thing in
     here worth not publishing. Operational status belongs in the Vercel
     dashboard, not in a committed file. -->

## Scaling

This is a static, CDN-served site with one client-side form integration — it
scales the same way any Vercel static deployment does, with no app-side
bottleneck. The only constraint that can actually bind is the contact form's
submission allowance; revisit the plan if contact volume grows meaningfully.

## Future Improvements

- Move the video assets off the git repo and onto a dedicated video CDN if
  the set grows much beyond its current ~70 MB
- Add monitoring/error tracking (see above) before treating this as a
  primary lead-generation surface
- Add automated visual-regression coverage (the project relied on manual
  Playwright QA passes during development; there's no CI-run test suite yet)
- Consider a lightweight CI workflow (`typecheck` + `lint` + `build` on every
  PR) once this repo has more than one contributor
