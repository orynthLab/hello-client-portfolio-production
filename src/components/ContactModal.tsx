"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GlassPanel from "@/components/GlassPanel";
import { pauseWorldForOverlay, resumeWorldForOverlay } from "@/components/investment-world/motion";
import { useModalA11y } from "@/components/useModalA11y";

// Submits to Web3Forms — no backend, no server code on our side. Unlike a
// direct-to-Google-Forms POST, this endpoint actually supports CORS and
// returns a real JSON response, so success/failure here is verified, not
// assumed. Submissions land as emails at contact@orynthbuild.site.
//
// The access key is a Web3Forms "public" key by design — it's submitted from
// client-side JS on every request no matter what, the same way a reCAPTCHA
// site key works, so putting it in NEXT_PUBLIC_* doesn't expose anything
// that wasn't already visible in the compiled bundle. It's an env var for
// clean configuration (no secret rotates through git history), not because
// leaking it would be a security incident.
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? "";

export default function ContactModal({
  className = "",
  buttonClassName = "flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim transition-colors hover:border-cyan/50 hover:text-cyan",
  label = "Contact",
  showIcon = true,
}: {
  className?: string;
  buttonClassName?: string;
  label?: string;
  showIcon?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  useModalA11y(open, close, panelRef);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.append("access_key", WEB3FORMS_ACCESS_KEY);
    data.append("subject", "New inquiry from the Hello Client portfolio");

    setSending(true);
    setError(null);
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const result = await res.json();
      if (result.success) {
        setSent(true);
      } else {
        setError("Something went wrong — please try again or email us directly.");
      }
    } catch {
      setError("Something went wrong — please try again or email us directly.");
    } finally {
      setSending(false);
    }
  };

  // Nothing behind this overlay is visible while it's open — pause the whole
  // world's continuous animation so it isn't competing with the modal's own
  // form for the main thread (same pattern as ReadmeModal/VideoLightbox).
  useEffect(() => {
    if (!open) return;
    pauseWorldForOverlay();
    return () => resumeWorldForOverlay();
  }, [open]);

  return (
    <div className={className}>
      <button
        data-cursor="connect"
        onClick={() => setOpen(true)}
        className={buttonClassName}
      >
        {showIcon && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        )}
        {label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* solid, no backdrop-blur: now that this overlay pauses the world's
               continuous animation (above), there's nothing live left behind it
               to blur — same reasoning as ReadmeModal's scrim. */}
            <motion.div
              className="absolute inset-0 bg-void/80"
              onClick={close}
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Contact"
              tabIndex={-1}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-md"
            >
              <GlassPanel className="p-5 sm:p-6">
                <button
                  data-cursor="explore"
                  onClick={close}
                  className="absolute right-4 top-4 text-ink-faint transition-colors hover:text-ink"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>

                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-cyan/80">
                  Connect
                </p>
                <h2 className="mt-1.5 font-display text-lg font-semibold text-ink">
                  Tell us what you&apos;re building.
                </h2>

                {sent ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm text-ai-green"
                  >
                    Received. We&apos;ll be in touch shortly.
                  </motion.p>
                ) : (
                  <form className="mt-4 flex flex-col gap-2" onSubmit={handleSubmit}>
                    <input
                      name="name"
                      required
                      type="text"
                      placeholder="Name"
                      className="rounded-xl border border-glass-border bg-white/[0.03] px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-cyan/50"
                    />
                    <input
                      name="email"
                      required
                      type="email"
                      placeholder="Email"
                      className="rounded-xl border border-glass-border bg-white/[0.03] px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-cyan/50"
                    />
                    <textarea
                      name="message"
                      required
                      rows={2}
                      placeholder="What are you looking to build?"
                      className="resize-none rounded-xl border border-glass-border bg-white/[0.03] px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-cyan/50"
                    />
                    {error && <p className="text-xs text-red-400">{error}</p>}
                    <button
                      type="submit"
                      disabled={sending}
                      data-cursor="connect"
                      className="group mt-1 flex items-center justify-center gap-2 rounded-full bg-cyan/10 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan edge-glow transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
                    >
                      {sending ? "Sending" : "Send"}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </form>
                )}

                <p className="mt-4 border-t border-glass-border pt-3 font-mono text-[10px] text-ink-faint">
                  contact@orynthbuild.site
                </p>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
