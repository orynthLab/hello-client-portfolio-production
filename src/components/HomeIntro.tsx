import Link from "next/link";
import { services } from "@/data/services";

// ---------------------------------------------------------------------------
// The homepage's crawlable half.
//
// The Core is the homepage as far as a visitor is concerned, but it only mounts
// once the boot sequence has finished in the browser. A crawler does not wait
// eight seconds or click "enter", so until this existed the site's strongest URL
// rendered 43 words, one heading reading "HELLO CLIENT", and not a single link
// to anything — the eight service pages included. Everything below is plain
// server-rendered markup: no state, no effects, no interaction required to read
// it or to follow a link out of it.
//
// It sits after the Core rather than inside it, so nothing here touches the
// Core's markup, its timeline, or its gestures. The Core's own wheel handler
// already yields to the page until the universe opens ("the page should scroll
// normally"), which is what lets this be reachable at all.
//
// Copy is held to claims the site already makes elsewhere — the services are
// the eight real pages, named and linked by their own slugs. Nothing here is
// written for a crawler that a visitor would not want to read.
// ---------------------------------------------------------------------------

/** The eyebrow only earns its line when it says something the name does not.
 *  "MVP Development" under "MVP Development", or "Full-Stack Development"
 *  under "Full Stack Development Services", is the same words twice. */
function kicker(name: string, eyebrow: string) {
  const flat = (v: string) => v.toLowerCase().replace(/[^a-z]/g, "").replace(/services$/, "");
  const a = flat(name);
  const b = flat(eyebrow);
  return a.includes(b) || b.includes(a) ? null : eyebrow;
}

export default function HomeIntro() {
  return (
    <section
      aria-labelledby="home-intro-heading"
      className="relative z-10 w-full border-t border-glass-border bg-void"
    >
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim">
          OrynthBuild
        </p>

        <h2
          id="home-intro-heading"
          className="font-display mt-4 max-w-2xl text-2xl font-semibold leading-[1.15] text-ink sm:text-4xl"
        >
          AI systems, products and the engineering underneath them.
        </h2>

        <div className="mt-6 grid max-w-4xl gap-5 text-sm leading-relaxed text-ink-dim sm:grid-cols-2 sm:text-[0.95rem]">
          <p>
            We build production software for founders, startups and established
            businesses: AI agents that work inside real tools, document and
            financial systems people can audit, and the full-stack platforms that
            carry them. Every project shown on this site is our own work, and
            each one says plainly what it is — shipped product, working system,
            or demonstration prototype.
          </p>
          <p>
            We also work white-label. Agencies bring us engineering they cannot
            staff — AI, automation, or a whole product — and it ships under their
            brand, not ours. Either way the same team does the work, and the case
            studies here describe how.
          </p>
        </div>

        <h3 className="mt-14 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim">
          What we work on
        </h3>

        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="glass-panel group flex h-full flex-col gap-2 rounded-2xl p-5 transition-colors hover:border-cyan/40"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: service.accent }}
                />
                <span className="font-display text-sm font-medium leading-snug text-ink transition-colors group-hover:text-cyan">
                  {service.name}
                </span>
                {kicker(service.name, service.eyebrow) && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-dim">
                    {kicker(service.name, service.eyebrow)}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm leading-relaxed text-ink-dim">
          Prefer to look at the work first? The Core above opens every project —
          or start with the{" "}
          <Link
            href="/projects/cross-border-transfer-engine"
            className="text-ink underline decoration-cyan/40 underline-offset-4 transition-colors hover:text-cyan"
          >
            Cross-Border Transfer Engine
          </Link>{" "}
          and the{" "}
          <Link
            href="/projects/document-identifier-verifier"
            className="text-ink underline decoration-cyan/40 underline-offset-4 transition-colors hover:text-cyan"
          >
            Document Trust Engine
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
