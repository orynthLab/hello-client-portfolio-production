import { layoutClusters, project, type Camera, type LayoutPoint, type UniverseNode } from "./universe";

// ---------------------------------------------------------------------------
// The Core's particle engine.
//
// Built to the concept board: one dark 3D sphere that compresses, pulses and
// disintegrates into particle clusters, one cluster per project, floating in a
// space the visitor can orbit and zoom.
//
// "3D look in a 2D environment" — every position here is a real (x, y, z) in
// normalized space and gets perspective-projected each frame (see project() in
// universe.ts). That is what makes each cluster's orbit rings read as tilted
// circles rather than drawn ellipses, and what lets the whole field be orbited.
//
// Deliberately plain TypeScript over a 2D canvas: no React, no GSAP, no DOM
// particle, and no state update per frame. Particle positions live in flat
// typed arrays mutated inside one requestAnimationFrame loop.
//
// The board's material rule is absolute and shapes the whole renderer: no
// reflections, no shine, no glass. Nothing here draws a specular highlight.
// ---------------------------------------------------------------------------

export type CorePhase =
  | "idle"
  | "activating"
  | "disintegrating"
  | "reorganizing"
  | "universe";

export type ClusterScreenPoint = {
  slug: string;
  x: number;
  y: number;
  radius: number;
  /** front-most clusters take pointer priority and draw brightest */
  depth: number;
};

export type EngineQuality = {
  count: number;
  perCluster: number;
  dustKeep: number;
  dprCap: number;
};

export const QUALITY: Record<"desktop" | "tablet" | "mobile", EngineQuality> = {
  desktop: { count: 1800, perCluster: 16, dustKeep: 0.2, dprCap: 1.5 },
  tablet: { count: 1050, perCluster: 13, dustKeep: 0.17, dprCap: 1.35 },
  // The board asks for mobile to be intentional, not the desktop field shrunk.
  mobile: { count: 520, perCluster: 10, dustKeep: 0.14, dprCap: 1.25 },
};

// Timing, from the board's five stages.
const T_ACTIVATE = 620;
const T_DISINTEGRATE = 1150;
const T_REORGANIZE = 1500;
const T_STABILIZE = 480;

const TAU = Math.PI * 2;

/** The Core's on-screen radius in CSS pixels. Small and deliberately capped:
 *  it occupies a small part of the screen with a lot of empty space around it, and
 *  is never the whole hero. Kept here as the single source of truth — the DOM
 *  layer sizes its canvas and hit target from coreRadiusPx() too, so the
 *  particles are always thrown from exactly where the sphere's edge is. */
export function coreRadiusPx(w: number, h: number) {
  return Math.max(62, Math.min(110, Math.min(w, h) * 0.115));
}
/** The three orbit rings every cluster carries. */
const RING_RADII = [0.06, 0.098, 0.14];

function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Pre-rendered soft-glow sprite per colour. Drawing a cached bitmap is about
 *  an order of magnitude cheaper per particle than building a gradient and
 *  filling an arc every frame — this is what makes ~1800 particles viable. */
const SPRITE_SIZE = 32;
function makeSprite(color: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = SPRITE_SIZE;
  c.height = SPRITE_SIZE;
  const g = c.getContext("2d")!;
  const half = SPRITE_SIZE / 2;
  const grad = g.createRadialGradient(half, half, 0, half, half, half);
  grad.addColorStop(0, color);
  grad.addColorStop(0.34, color);
  grad.addColorStop(1, "transparent");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(half, half, half, 0, TAU);
  g.fill();
  return c;
}

export type EngineOptions = {
  nodes: UniverseNode[];
  quality: EngineQuality;
  reducedMotion: boolean;
  onPhase?: (phase: CorePhase) => void;
  /** Called every frame with current screen positions. Handlers must mutate the
   *  DOM directly — calling setState here would re-render React 60x a second. */
  onFrame?: (points: ClusterScreenPoint[]) => void;
  /** Fired only when the hovered cluster actually changes. */
  onHover?: (slug: string | null) => void;
  /** Mutated every frame with the 3D Core's compression and opacity. The
   *  sphere lives on its own WebGL layer and reads this in its render loop, so
   *  the two stay in step without either one re-rendering React. */
  visual?: { energy: number; alpha: number };
};

export class CoreParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private opts: EngineOptions;

  private raf = 0;
  private running = false;
  private phase: CorePhase = "idle";
  private phaseStart = 0;
  private now = 0;

  private w = 0;
  private h = 0;
  private cx = 0;
  private cy = 0;
  private unit = 1;

  private n = 0;
  private x!: Float32Array;
  private y!: Float32Array;
  private z!: Float32Array;
  private vx!: Float32Array;
  private vy!: Float32Array;
  private vz!: Float32Array;
  private sx!: Float32Array; // unit-sphere sample: the Core's shell
  private sy!: Float32Array;
  private sz!: Float32Array;
  private cluster!: Int16Array; // -1 = ambient dust
  private ring!: Int8Array; // which orbit ring this particle rides
  private ringPhase!: Float32Array;
  private ringSpeed!: Float32Array;
  private size!: Float32Array;
  private alpha!: Float32Array;
  private dustKeep!: Uint8Array;
  private arrive!: Float32Array;
  private dustX!: Float32Array;
  private dustY!: Float32Array;
  private dustZ!: Float32Array;

  private clusterPts: LayoutPoint[] = [];
  /** per-cluster orbit plane, so no two worlds share a motion signature */
  private ringTilt!: Float32Array;
  private ringRoll!: Float32Array;
  private sprites = new Map<string, HTMLCanvasElement>();
  private points: ClusterScreenPoint[] = [];

  private cam: Camera = { yaw: 0, pitch: 0, zoom: 1 };
  private camTarget: Camera = { yaw: 0, pitch: 0, zoom: 1 };

  private hovered = -1;
  private highlight = -1;
  private hoverAmount!: Float32Array;
  private pointerX = -9999;
  private pointerY = -9999;

  private coreEnergy = 0;
  private coreAlpha = 1;
  private spin = 0;
  private burstFlash = 0;
  private shockwaves: { t: number; life: number; strength: number }[] = [];
  private universeFade = 0;
  /** the Core's radius in normalized space, derived from coreRadiusPx() */
  private sphereR = 0.25;

  constructor(canvas: HTMLCanvasElement, opts: EngineOptions) {
    this.canvas = canvas;
    this.opts = opts;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2D canvas unavailable");
    this.ctx = ctx;
    this.hoverAmount = new Float32Array(opts.nodes.length);
    this.allocate();
    this.resize();
  }

  // -------------------------------------------------------------------------
  // setup
  // -------------------------------------------------------------------------

  private allocate() {
    const { quality, nodes } = this.opts;
    const n = quality.count;
    this.n = n;

    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.z = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.vz = new Float32Array(n);
    this.sx = new Float32Array(n);
    this.sy = new Float32Array(n);
    this.sz = new Float32Array(n);
    this.cluster = new Int16Array(n);
    this.ring = new Int8Array(n);
    this.ringPhase = new Float32Array(n);
    this.ringSpeed = new Float32Array(n);
    this.size = new Float32Array(n);
    this.alpha = new Float32Array(n);
    this.dustKeep = new Uint8Array(n);
    this.arrive = new Float32Array(n);
    this.dustX = new Float32Array(n);
    this.dustY = new Float32Array(n);
    this.dustZ = new Float32Array(n);

    const rand = seeded(1337);
    const clusters = nodes.length;
    const per = quality.perCluster;

    this.ringTilt = new Float32Array(clusters);
    this.ringRoll = new Float32Array(clusters);
    for (let c = 0; c < clusters; c++) {
      // each world gets its own orbit plane — the board's "unique motion
      // signature for each project"
      this.ringTilt[c] = 0.35 + rand() * 0.9;
      this.ringRoll[c] = rand() * TAU;
    }

    for (let i = 0; i < n; i++) {
      // Fibonacci sphere — the Core's shell, and the origin every particle is
      // thrown from, so the break reads as the sphere itself coming apart.
      const t = (i + 0.5) / n;
      const phi = Math.acos(1 - 2 * t);
      const theta = TAU * i * 0.618033988749895;
      this.sx[i] = Math.sin(phi) * Math.cos(theta);
      this.sy[i] = Math.sin(phi) * Math.sin(theta);
      this.sz[i] = Math.cos(phi);

      this.cluster[i] = i < per * clusters ? Math.floor(i / per) : -1;

      this.size[i] = 0.5 + rand() * 1.2;
      this.alpha[i] = 0.16 + rand() * 0.44;
      this.dustKeep[i] = rand() < quality.dustKeep ? 1 : 0;
      this.arrive[i] = rand();

      // where ambient dust lives once the universe settles — a shallow slab
      this.dustX[i] = (rand() - 0.5) * 3.1;
      this.dustY[i] = (rand() - 0.5) * 2.1;
      this.dustZ[i] = (rand() - 0.5) * 1.5;

      this.ringPhase[i] = rand() * TAU;
      // slow: six clusters all shimmering at once reads as jitter, not life
      this.ringSpeed[i] = (0.05 + rand() * 0.12) * (rand() > 0.5 ? 1 : -1);
      this.ring[i] = 0;
    }

    // A cluster is one bright central node plus a handful of particles riding
    // its three orbit rings. Small on purpose — readable from across the field.
    for (let i = 0; i < n; i++) {
      if (this.cluster[i] < 0) continue;
      const local = i % per;
      if (local === 0) {
        this.ring[i] = -1; // the central node itself
        // Rank shows in weight as well as position: the first project's node
        // is noticeably the largest and they taper from there, so the field
        // has a clear headline instead of eight equal dots.
        const rank = this.cluster[i] / Math.max(1, clusters - 1);
        this.size[i] = 6.6 - rank * 2.2;
        this.alpha[i] = 1;
      } else {
        this.ring[i] = (local - 1) % RING_RADII.length;
        this.size[i] = 0.62 + rand() * 0.5;
        this.alpha[i] = 0.42 + rand() * 0.3;
      }
    }

    for (const node of nodes) this.sprites.set(node.accent, makeSprite(node.accent));
    this.sprites.set("#ffffff", makeSprite("#ffffff"));
    this.sprites.set("#cfe0f5", makeSprite("#cfe0f5"));
  }

  resize = () => {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this.opts.quality.dprCap);
    this.w = rect.width;
    this.h = rect.height;
    this.canvas.width = Math.max(1, Math.round(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.cx = this.w / 2;
    this.cy = this.h / 2;
    this.unit = Math.min(this.w, this.h) * 0.44;

    // The sphere is sized in CSS pixels, not in normalized units, so it stays
    // small and consistent across viewports rather than scaling with the field.
    this.sphereR = coreRadiusPx(this.w, this.h) / this.unit;

    const narrow = this.w < 640;
    this.clusterPts = layoutClusters(this.opts.nodes.length, {
      aspect: this.w / Math.max(1, this.h),
      maxRadius: narrow ? 0.8 : 0.88,
      minRadius: narrow ? 0.36 : 0.34,
      // A narrow screen has to hold apart labels, not dots: the gap that
      // reads as generous around a 6px node is nowhere near enough around
      // the ~120px of text hanging beneath it.
      separation: narrow ? 0.72 : 0.48,
    });
  };

  // -------------------------------------------------------------------------
  // control surface
  // -------------------------------------------------------------------------

  start() {
    if (this.running) return;
    this.running = true;
    this.now = performance.now();
    this.phaseStart = this.now;
    if (this.opts.reducedMotion) {
      this.setPhase("universe");
      this.snapToUniverse();
      this.coreAlpha = 0;
      this.universeFade = 1;
    } else {
      this.seedSphere();
    }
    this.raf = requestAnimationFrame(this.tick);
  }

  /** A visitor returning from a project shouldn't watch the Core break twice. */
  enterUniverseImmediately() {
    this.setPhase("universe");
    this.snapToUniverse();
    this.coreAlpha = 0;
    this.universeFade = 1;
  }

  activate() {
    if (this.phase !== "idle") return;
    if (this.opts.reducedMotion) {
      this.enterUniverseImmediately();
      return;
    }
    this.setPhase("activating");
  }

  /** Drag to orbit. Pitch is clamped so the slab is never viewed edge-on. */
  orbitBy(dx: number, dy: number) {
    this.camTarget.yaw += dx * 0.0042;
    this.camTarget.pitch = Math.max(-0.55, Math.min(0.55, this.camTarget.pitch + dy * 0.0034));
  }

  zoomBy(delta: number) {
    this.camTarget.zoom = Math.max(0.65, Math.min(2.1, this.camTarget.zoom * (1 - delta * 0.0012)));
  }

  setPointer(x: number, y: number) {
    this.pointerX = x;
    this.pointerY = y;
  }

  setHighlight(slug: string | null) {
    this.highlight = slug ? this.opts.nodes.findIndex((n) => n.slug === slug) : -1;
  }

  getPhase() {
    return this.phase;
  }

  getPoints() {
    return this.points;
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.sprites.clear();
  }

  private setPhase(p: CorePhase) {
    if (this.phase === p) return;
    this.phase = p;
    this.phaseStart = this.now;
    this.opts.onPhase?.(p);
  }

  // -------------------------------------------------------------------------
  // positions
  // -------------------------------------------------------------------------

  private seedSphere() {
    for (let i = 0; i < this.n; i++) {
      this.x[i] = this.sx[i] * this.sphereR;
      this.y[i] = this.sy[i] * this.sphereR;
      this.z[i] = this.sz[i] * this.sphereR;
      this.vx[i] = this.vy[i] = this.vz[i] = 0;
    }
  }

  private snapToUniverse() {
    for (let i = 0; i < this.n; i++) {
      const t = this.targetFor(i, 0);
      this.x[i] = t.x;
      this.y[i] = t.y;
      this.z[i] = t.z;
      this.vx[i] = this.vy[i] = this.vz[i] = 0;
    }
  }

  /** Where particle i belongs in the settled universe, in 3D. */
  private targetFor(i: number, time: number) {
    const c = this.cluster[i];
    if (c < 0) {
      return { x: this.dustX[i], y: this.dustY[i], z: this.dustZ[i] };
    }
    const p = this.clusterPts[c] ?? { x: 0, y: 0, z: 0 };
    if (this.ring[i] < 0) return { x: p.x, y: p.y, z: p.z };

    // a real circle in 3D, tilted into this cluster's own orbit plane
    const r = RING_RADII[this.ring[i]] * (1 - this.hoverAmount[c] * 0.16);
    const a = this.ringPhase[i] + time * this.ringSpeed[i];
    const ox = Math.cos(a) * r;
    const oy = Math.sin(a) * r;

    const tilt = this.ringTilt[c];
    const roll = this.ringRoll[c];
    const y1 = oy * Math.cos(tilt);
    const z1 = oy * Math.sin(tilt);
    const x2 = ox * Math.cos(roll) - y1 * Math.sin(roll);
    const y2 = ox * Math.sin(roll) + y1 * Math.cos(roll);

    return { x: p.x + x2, y: p.y + y2, z: p.z + z1 };
  }

  private burst() {
    const rand = seeded(4242);
    for (let i = 0; i < this.n; i++) {
      const d = Math.hypot(this.x[i], this.y[i], this.z[i]) || 0.001;
      const nx = this.x[i] / d;
      const ny = this.y[i] / d;
      const nz = this.z[i] / d;
      const roll = rand();
      // a minority thrown far — without that spread it reads as one uniform
      // expanding shell rather than something breaking
      const speed = 0.0072 * (roll > 0.86 ? 2.2 + rand() * 1.5 : 0.45 + roll * 1.2);
      const swirl = speed * (0.18 + rand() * 0.26);
      this.vx[i] = nx * speed + ny * swirl;
      this.vy[i] = ny * speed - nx * swirl;
      this.vz[i] = nz * speed + (rand() - 0.5) * speed * 0.5;
    }
    this.burstFlash = 1;
    this.shockwaves = [
      { t: 0, life: 640, strength: 1 },
      { t: -90, life: 800, strength: 0.58 },
      { t: -210, life: 980, strength: 0.32 },
    ];
  }

  // -------------------------------------------------------------------------
  // loop
  // -------------------------------------------------------------------------

  private tick = (t: number) => {
    if (!this.running) return;
    const dt = Math.min(48, t - this.now);
    this.now = t;
    this.update(dt, t / 1000);
    this.render(t / 1000);
    this.raf = requestAnimationFrame(this.tick);
  };

  private update(dt: number, time: number) {
    const elapsed = this.now - this.phaseStart;
    const step = dt / 16.667;

    // camera easing
    this.cam.yaw += (this.camTarget.yaw - this.cam.yaw) * Math.min(1, dt / 220);
    this.cam.pitch += (this.camTarget.pitch - this.cam.pitch) * Math.min(1, dt / 220);
    this.cam.zoom += (this.camTarget.zoom - this.cam.zoom) * Math.min(1, dt / 220);

    this.burstFlash = Math.max(0, this.burstFlash - dt / 350);
    for (const s of this.shockwaves) s.t += dt;
    if (this.shockwaves.length && this.shockwaves[0].t > 1200) this.shockwaves = [];

    for (let c = 0; c < this.hoverAmount.length; c++) {
      const want = c === this.hovered ? 1 : 0;
      this.hoverAmount[c] += (want - this.hoverAmount[c]) * Math.min(1, dt / 150);
    }

    switch (this.phase) {
      case "idle": {
        this.spin += dt * 0.00007;
        this.coreEnergy += (0 - this.coreEnergy) * Math.min(1, dt / 400);
        const breathe = 1 + Math.sin(time * 0.55) * 0.018;
        const r = this.sphereR * breathe;
        const cos = Math.cos(this.spin);
        const sin = Math.sin(this.spin);
        for (let i = 0; i < this.n; i++) {
          this.x[i] = (this.sx[i] * cos - this.sz[i] * sin) * r;
          this.y[i] = this.sy[i] * r;
          this.z[i] = (this.sx[i] * sin + this.sz[i] * cos) * r;
        }
        break;
      }

      case "activating": {
        const k = Math.min(1, elapsed / T_ACTIVATE);
        this.coreEnergy = easeInOutCubic(k);
        this.spin += dt * 0.00034 * (0.4 + k);
        const r = this.sphereR * (1 - 0.3 * this.coreEnergy);
        const cos = Math.cos(this.spin);
        const sin = Math.sin(this.spin);
        for (let i = 0; i < this.n; i++) {
          this.x[i] = (this.sx[i] * cos - this.sz[i] * sin) * r;
          this.y[i] = this.sy[i] * r;
          this.z[i] = (this.sx[i] * sin + this.sz[i] * cos) * r;
        }
        if (k >= 1) {
          this.burst();
          this.setPhase("disintegrating");
        }
        break;
      }

      case "disintegrating": {
        const k = Math.min(1, elapsed / T_DISINTEGRATE);
        const drag = Math.pow(0.962 - 0.02 * k, step);
        for (let i = 0; i < this.n; i++) {
          this.vx[i] *= drag;
          this.vy[i] *= drag;
          this.vz[i] *= drag;
          this.x[i] += this.vx[i] * step;
          this.y[i] += this.vy[i] * step;
          this.z[i] += this.vz[i] * step;
        }
        this.coreAlpha += (0 - this.coreAlpha) * Math.min(1, dt / 220);
        if (k >= 1) this.setPhase("reorganizing");
        break;
      }

      case "reorganizing":
      case "universe": {
        const isRe = this.phase === "reorganizing";
        const k = isRe ? Math.min(1, elapsed / T_REORGANIZE) : 1;
        for (let i = 0; i < this.n; i++) {
          if (!isRe && this.cluster[i] < 0 && !this.dustKeep[i] && this.universeFade >= 1) continue;
          // staggered arrival, so clusters condense progressively instead of
          // every particle snapping home on the same frame
          const local = isRe ? Math.max(0, (k - this.arrive[i] * 0.45) / 0.55) : 1;
          const damp = Math.pow(isRe ? 0.845 : 0.86, step);
          if (local <= 0) {
            this.vx[i] *= Math.pow(0.94, step);
            this.vy[i] *= Math.pow(0.94, step);
            this.vz[i] *= Math.pow(0.94, step);
          } else {
            const spring = isRe ? 0.004 + easeOutCubic(Math.min(1, local)) * 0.028 : 0.034;
            const t = this.targetFor(i, time);
            this.vx[i] = (this.vx[i] + (t.x - this.x[i]) * spring) * damp;
            this.vy[i] = (this.vy[i] + (t.y - this.y[i]) * spring) * damp;
            this.vz[i] = (this.vz[i] + (t.z - this.z[i]) * spring) * damp;
          }
          this.x[i] += this.vx[i] * step;
          this.y[i] += this.vy[i] * step;
          this.z[i] += this.vz[i] * step;
        }
        this.universeFade = Math.min(1, this.universeFade + dt / 900);
        if (isRe && elapsed >= T_REORGANIZE + T_STABILIZE) this.setPhase("universe");
        break;
      }
    }

    if (this.opts.visual) {
      this.opts.visual.energy = this.coreEnergy;
      this.opts.visual.alpha = this.coreAlpha;
    }

    this.updatePoints();
  }

  /** Project cluster centres, hit-test the pointer, publish for the DOM layer. */
  private updatePoints() {
    const nodes = this.opts.nodes;
    const open = this.phase === "universe" || this.phase === "reorganizing";
    const pts: ClusterScreenPoint[] = [];

    for (let c = 0; c < nodes.length; c++) {
      const p = this.clusterPts[c] ?? { x: 0, y: 0, z: 0 };
      const pr = project(p.x, p.y, p.z, this.cam, this.cx, this.cy, this.unit);
      pts.push({
        slug: nodes[c].slug,
        x: pr.x,
        y: pr.y,
        radius: (this.w < 640 ? 34 : 46) * pr.scale,
        depth: pr.depth,
      });
    }
    this.points = pts;

    let hit = -1;
    if (open) {
      let best = Infinity;
      for (let c = 0; c < pts.length; c++) {
        const d = Math.hypot(this.pointerX - pts[c].x, this.pointerY - pts[c].y);
        // nearer clusters win ties, matching what the visitor sees on top
        if (d < pts[c].radius && pts[c].depth < best) {
          best = pts[c].depth;
          hit = c;
        }
      }
    }
    if (hit !== this.hovered) {
      this.hovered = hit;
      this.opts.onHover?.(hit >= 0 ? nodes[hit].slug : null);
    }

    this.opts.onFrame?.(pts);
  }

  // -------------------------------------------------------------------------
  // render
  // -------------------------------------------------------------------------

  /** A cluster's orbit rings: real circles in 3D, projected. */
  private drawRings(c: number, accent: string) {
    const ctx = this.ctx;
    const p = this.clusterPts[c] ?? { x: 0, y: 0, z: 0 };
    const tilt = this.ringTilt[c];
    const roll = this.ringRoll[c];
    const hv = this.hoverAmount[c];
    const dim = this.hovered >= 0 && this.hovered !== c ? 0.42 : 1;

    ctx.globalCompositeOperation = "lighter";
    for (let ri = 0; ri < RING_RADII.length; ri++) {
      const r = RING_RADII[ri];
      const alpha = (0.1 + hv * 0.3) * dim * (1 - ri * 0.16);
      if (alpha < 0.012) continue;
      ctx.strokeStyle = hv > 0.2 ? accent : "rgba(168,196,232,1)";
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      const SEG = 44;
      for (let s = 0; s <= SEG; s++) {
        const a = (s / SEG) * TAU;
        const ox = Math.cos(a) * r;
        const oy = Math.sin(a) * r;
        const y1 = oy * Math.cos(tilt);
        const z1 = oy * Math.sin(tilt);
        const x2 = ox * Math.cos(roll) - y1 * Math.sin(roll);
        const y2 = ox * Math.sin(roll) + y1 * Math.cos(roll);
        const pr = project(p.x + x2, p.y + y2, p.z + z1, this.cam, this.cx, this.cy, this.unit);
        if (s === 0) ctx.moveTo(pr.x, pr.y);
        else ctx.lineTo(pr.x, pr.y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  private render(time: number) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    const nodes = this.opts.nodes;
    const isSphere = this.phase === "idle" || this.phase === "activating";
    const white = this.sprites.get("#ffffff")!;
    const soft = this.sprites.get("#cfe0f5")!;

    // The sphere's own radius on screen, at the current camera.
    const rPx = this.sphereR * this.unit * this.cam.zoom * (1 - 0.3 * this.coreEnergy);

    // While the Core is whole, this canvas draws nothing at all: the sphere is
    // a real 3D object on its own WebGL layer underneath (CoreSphere3D), and
    // scattering 2D dots over it is exactly the "dotted circle" look that
    // replaced. The pool sits silently on the shell until the break.
    if (isSphere) return;

    const drawParticles = (farHalf: boolean | null) => {
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < this.n; i++) {
        const c = this.cluster[i];
        let alpha = this.alpha[i];
        let sprite = soft;
        let scale = this.size[i];

        const pr = project(this.x[i], this.y[i], this.z[i], this.cam, this.cx, this.cy, this.unit);
        if (farHalf !== null && pr.depth > 0 !== farHalf) continue;

        if (isSphere) {
          alpha = Math.min(1, alpha * 1.15 + 0.1);
          scale *= 0.8;
          sprite = pr.depth > 0 ? soft : white;
        } else if (c < 0) {
          if (!this.dustKeep[i]) {
            alpha *= 1 - this.universeFade;
            if (alpha < 0.006) continue;
          } else {
            alpha *= 1 - this.universeFade * 0.45;
          }
        } else {
          const hv = this.hoverAmount[c];
          const central = this.ring[i] < 0;
          // Accent stays an accent: only a project's own node carries it, and
          // its ring particles only pick it up on hover.
          if (central || hv > 0.15) sprite = this.sprites.get(nodes[c].accent) ?? white;
          const dim = this.hovered >= 0 && this.hovered !== c ? 0.5 : 1;
          alpha *= dim * (1 + hv * 0.8 + (c === this.highlight ? 0.16 : 0));
          if (central) {
            scale *= 1 + hv * 0.4;
            alpha *= 0.94 + Math.sin(time * 1.1 + c) * 0.06;
            // a wider, softer pass in the same accent gives the marker a halo
            const gs = scale * pr.scale * 3.4 * 2.5;
            ctx.globalAlpha = Math.min(1, alpha * 0.28);
            ctx.drawImage(sprite, pr.x - gs / 2, pr.y - gs / 2, gs, gs);
          }
        }

        // perspective does the depth work: far particles are smaller and fainter
        const s = scale * pr.scale * 3.4;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha * (0.45 + pr.scale * 0.6)));
        ctx.drawImage(sprite, pr.x - s / 2, pr.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    // rings first, so particles sit on top of their own traces
    if (this.universeFade > 0.15) {
      for (let c = 0; c < nodes.length; c++) this.drawRings(c, nodes[c].accent);
    }
    drawParticles(null);

    // shockwaves and the bloom of the break
    ctx.globalCompositeOperation = "lighter";
    for (const wv of this.shockwaves) {
      if (wv.t <= 0) continue;
      const k = Math.min(1, wv.t / wv.life);
      if (k >= 1) continue;
      ctx.strokeStyle = `rgba(196,224,255,${(1 - k) * 0.4 * wv.strength})`;
      ctx.lineWidth = (1 - k) * 2.1 + 0.3;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, rPx * (0.9 + easeOutCubic(k) * 6.5), 0, TAU);
      ctx.stroke();
    }

    if (this.burstFlash > 0.01) {
      const f = this.burstFlash * this.burstFlash;
      const g = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, Math.max(this.w, this.h) * 0.55);
      g.addColorStop(0, `rgba(222,238,255,${0.46 * f})`);
      g.addColorStop(0.4, `rgba(140,186,240,${0.15 * f})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, this.w, this.h);
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }
}
