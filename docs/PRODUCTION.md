# Production Notes

Internal documentation for the private repository — deployment, infrastructure,
environment configuration, and operational notes that don't belong in the
public-facing README.

## Architecture

Same architecture as the public README describes (Home → The Core → five
project worlds, one shared framework). Nothing behind this app is server-side
beyond what Next.js itself renders — there is no database, no custom API
route, and no server-held secret. The only outbound integration is a
client-side POST to Web3Forms for the contact form.

Every project page (`/projects/[slug]`) is statically generated at build time
via `generateStaticParams` — confirm with `npm run build`, which should show
`● (SSG)` for that route and list every project slug under it. The home page
is fully static (`○`). There is no dynamic/on-demand rendering anywhere in
this app.

## Deployment

Deployed to **Vercel** (zero-config for Next.js — auto-detects the framework,
build command, and output).

```bash
npx vercel --prod
```

First run prompts for login and project linking; subsequent runs redeploy the
linked project directly. No `vercel.json` is required or present — defaults
are correct for this app.

If a different host is ever used instead: this app has no server runtime
requirements beyond what `next start` needs (Node.js), and no database to
provision.

## Infrastructure

- **Hosting**: Vercel (CDN + static hosting; no server compute needed beyond
  the Next.js build step)
- **Video assets**: served from `/public/videos/` — currently:
  - `robo-advisor.mp4` (~5.5 MB)
  - `financial-report-agent.mp4` (~66 MB — noticeably larger than the
    others; flagged during development as a bandwidth/load-time
    consideration, not yet resolved)
  - `document-trust-engine.mp4` (~4 MB)
  - `logistics-operations-hub.mp4` (~4.4 MB)
  - `creative-engineering-portfolio.mp4` (~4 MB)

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

Not currently configured. Recommended before/soon after a real production
launch:

- **Vercel Analytics** (or a privacy-respecting alternative) for real traffic/
  Core Web Vitals visibility
- **Error tracking** (e.g. Sentry) — there is currently no error-reporting
  integration; console errors are only caught during manual/Playwright QA
- **Web3Forms delivery** has no monitoring beyond the UI's own success/error
  state — if submissions silently stop arriving, there's currently no alert
  for it. Consider periodically test-submitting the contact form, or
  switching to a plan/service with delivery webhooks if this becomes a real
  lead-gen channel.

## Scaling

This is a static, CDN-served site with one client-side form integration — it
scales the same way any Vercel static deployment does, with no app-side
bottleneck. The only real constraint is **Web3Forms' free-tier submission
limits**; if contact volume grows meaningfully, revisit their pricing tiers.

## Future Improvements

- Move large video assets off the git repo and onto a dedicated video CDN
- Add monitoring/error tracking (see above) before treating this as a
  primary lead-generation surface
- Add automated visual-regression coverage (the project relied on manual
  Playwright QA passes during development; there's no CI-run test suite yet)
- Consider a lightweight CI workflow (`typecheck` + `lint` + `build` on every
  PR) once this repo has more than one contributor
