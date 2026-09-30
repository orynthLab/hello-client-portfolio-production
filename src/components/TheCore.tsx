"use client";

import AIBrandMark from "@/components/AIBrandMark";
import ContactModal from "@/components/ContactModal";
import CoreUniverse from "@/components/core/CoreUniverse";

// ---------------------------------------------------------------------------
// The Core — the hub every project world is reached from.
//
// The navigation mechanism here is the particle universe in
// src/components/core/: one dark sphere that breaks apart into project
// clusters. This file owns only the screen's chrome (brand mark, contact) and
// the stage the universe fills, so the universe stays a self-contained,
// data-driven system.
//
// Nothing about the site's atmosphere lives here: the void background, the
// grain layer and the ambient ParticleField all sit behind this component and
// are untouched by it.
// ---------------------------------------------------------------------------
export default function TheCore() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-transparent">
      <AIBrandMark className="safe-top safe-left fixed z-40" />
      <ContactModal className="safe-top safe-right fixed z-40" />

      <div className="relative z-10 h-dvh w-full">
        <CoreUniverse />
      </div>
    </div>
  );
}
