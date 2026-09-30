"use client";

import { useRef, useState } from "react";
import GlassPanel from "@/components/GlassPanel";
import Overlay from "@/components/Overlay";

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
  const sendingRef = useRef(false);
  const close = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Pressing Enter in a field submits the form even while the button is
    // disabled, so the in-flight guard has to live here rather than only on
    // the button — otherwise one impatient visitor sends four identical leads.
    if (sendingRef.current) return;
    sendingRef.current = true;

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
      sendingRef.current = false;
    }
  };

  return (
    <div className={className}>
      <button
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

      <Overlay open={open} onClose={close} ariaLabel="Contact" panelClassName="w-full max-w-md">
              <GlassPanel className="p-5 sm:p-6">
                <button
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
                  <p
                    className="mt-4 text-sm text-ai-green"
                  >
                    Received. We&apos;ll be in touch shortly.
                  </p>
                ) : (
                  <form className="mt-4 flex flex-col gap-2" onSubmit={handleSubmit}>
                    {/* Honeypot. Web3Forms rejects any submission where this
                        field is filled, and a bot filling every input is
                        exactly how automated spam behaves. Hidden from people
                        and from assistive tech, and never focusable, so no
                        real visitor can trip it. This form's only real abuse
                        risk is bot volume burning the submission quota. */}
                    <input
                      type="checkbox"
                      name="botcheck"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />
                    <input
                      name="name"
                      required
                      type="text"
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Name"
                      className="rounded-xl border border-glass-border bg-white/[0.03] px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-cyan/50"
                    />
                    <input
                      name="email"
                      required
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      placeholder="Email"
                      className="rounded-xl border border-glass-border bg-white/[0.03] px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-cyan/50"
                    />
                    <textarea
                      name="message"
                      required
                      rows={2}
                      maxLength={2000}
                      placeholder="What are you looking to build?"
                      className="resize-none rounded-xl border border-glass-border bg-white/[0.03] px-3.5 py-2 text-sm text-ink outline-none transition-colors focus:border-cyan/50"
                    />
                    {error && <p className="text-xs text-red-400">{error}</p>}
                    <button
                      type="submit"
                      disabled={sending}
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
      </Overlay>
    </div>
  );
}
