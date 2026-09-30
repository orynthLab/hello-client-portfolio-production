"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Overlay from "@/components/Overlay";

// ---------------------------------------------------------------------------
// The product walkthrough, expanded. Clicking play never navigates anywhere —
// it pops this player up over a dimmed (not blurred — see ReadmeModal for why)
// version of the world, plays the real file, and hands back to exactly where
// the visitor was on close. Every control is custom-built to match the site's
// own language rather than the browser's native <video controls> chrome.
// ---------------------------------------------------------------------------

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PlayIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path d="M1 1L17 10L1 19V1Z" fill="currentColor" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <rect x="1" y="1" width="5" height="16" rx="1" fill="currentColor" />
      <rect x="10" y="1" width="5" height="16" rx="1" fill="currentColor" />
    </svg>
  );
}

export default function VideoLightbox({
  src,
  open,
  onClose,
}: {
  src: string;
  open: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Overlay handles the world pause and the focus trap; this effect only owns
  // the video element itself.
  useEffect(() => {
    if (!open) return;
    const video = videoRef.current;
    video?.play().catch(() => {
      // Autoplay can still be refused in rare cases (e.g. reduced-data mode) —
      // the visible play button is the fallback, not a broken experience.
    });
    return () => {
      video?.pause();
    };
  }, [open]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const skip = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + delta, 0), video.duration || Infinity);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      container.requestFullscreen?.().catch(() => {});
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const overlay = (
    <Overlay
      open={open}
      onClose={onClose}
      ariaLabel="Video walkthrough"
      scrimClassName="bg-void/92"
      panelClassName="edge-glow w-full max-w-5xl overflow-hidden rounded-2xl border border-glass-border bg-black"
    >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-ink-dim transition-colors hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative aspect-video w-full" onClick={togglePlay}>
              <video
                ref={videoRef}
                src={src}
                className="h-full w-full"
                playsInline
                onTimeUpdate={(e) => {
                  if (!seeking) setCurrentTime(e.currentTarget.currentTime);
                }}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            </div>

            {/* controls — a persistent bar rather than auto-hide-on-idle, so there's
               no extra idle-timer machinery adding to what we just finished trimming */}
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col gap-2 px-4 pb-3 pt-8"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.01}
                value={currentTime}
                onChange={(e) => {
                  const t = Number(e.target.value);
                  setCurrentTime(t);
                  if (videoRef.current) videoRef.current.currentTime = t;
                }}
                onPointerDown={() => setSeeking(true)}
                onPointerUp={() => setSeeking(false)}
                className="iw-scrubber"
                style={{ background: `linear-gradient(to right, #52f2ff ${progress}%, rgba(255,255,255,0.18) ${progress}%)` }}
                aria-label="Seek"
              />

              <div className="flex items-center gap-3">
                <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className="text-ink transition-colors hover:text-cyan">
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button type="button" onClick={() => skip(-10)} aria-label="Back 10 seconds" className="text-ink-dim transition-colors hover:text-cyan">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 5L5 12l6 7M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" onClick={() => skip(10)} aria-label="Forward 10 seconds" className="text-ink-dim transition-colors hover:text-cyan">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 5l6 7-6 7M19 12H5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>

                <span className="font-mono text-[11px] tabular-nums text-ink-faint">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="ml-auto flex items-center gap-3">
                  <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="text-ink-dim transition-colors hover:text-cyan">
                    {muted ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H3v6h3l5 4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H3v6h3l5 4V5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M16 8.5a4 4 0 0 1 0 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    )}
                  </button>
                  <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen" className="text-ink-dim transition-colors hover:text-cyan">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </div>
            </div>
    </Overlay>
  );

  if (!mounted) return null;
  return createPortal(overlay, document.body);
}
