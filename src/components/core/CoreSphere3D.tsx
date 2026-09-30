"use client";

import { useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// The Core — small, dark, abstract.
//
// Real geometry, so the depth is genuine rather than a gradient pretending to
// curve. Everything else is held back on purpose:
//
//   no environment map   — an env map is what produces sun-like specular
//                          reflections, and that is exactly the "planet"
//                          reading this must not have
//   no texture map       — no surface detail, no continents, nothing to make
//                          it read as a body with terrain
//   matte material       — roughness is high and metalness near zero, so no
//                          hard highlight can ever form on it
//
// The governing rule: THE LIGHT MOVES, THE OBJECT BARELY DOES. Geometry
// rotation is almost imperceptible; what actually travels is a soft highlight
// running around the limb, driven by a light direction that orbits slowly.
// That is what makes it feel alive rather than like something spinning.
//
// Renders on a small transparent canvas over the site's own background, which
// it never touches.
// ---------------------------------------------------------------------------

/** Written by the particle engine every frame; read here in useFrame. Passing
 *  it as a ref rather than props keeps React out of the animation loop. */
export type CoreVisualState = { energy: number; alpha: number };

/** One full trip of the light around the Core's edge, in seconds. Slow enough
 *  that the movement is only noticed after watching for a moment. */
const ORBIT_SECONDS = 46;
const ORBIT_SPEED = (Math.PI * 2) / ORBIT_SECONDS;

/** A soft radial falloff, used for the sunrise point and its atmospheric glow.
 *  One 128px texture shared by every flare layer — cheaper than a shader and
 *  more than enough for something this small. */
function makeGlowTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  // sunlight yellow through to soft white — deliberately no orange stop
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,253,1)");
  grad.addColorStop(0.14, "rgba(255,250,232,0.88)");
  grad.addColorStop(0.36, "rgba(253,238,198,0.26)");
  grad.addColorStop(0.66, "rgba(248,234,200,0.06)");
  grad.addColorStop(1, "rgba(248,236,205,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/** Fresnel, modulated by where the moving light currently is. The Fresnel term
 *  pins the light to the limb; the light term decides which part of the limb is
 *  bright, so a soft highlight travels around the edge instead of sitting still. */
const rimVertex = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const rimFragment = `
  uniform vec3 uColor;
  uniform vec3 uGlowColor;
  uniform vec3 uLightDir;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec3 n = normalize(vNormal);
    float ndv = max(dot(n, normalize(vView)), 0.0);

    // Two bands on ONE surface: a thin sharp rim, and a much wider, dimmer
    // atmospheric falloff. Both live in this shader on purpose — a separate
    // larger sphere for the glow drew a visible second circle around the Core,
    // which read as a decorative ring rather than as light.
    float sharp = pow(1.0 - ndv, uPower);
    float wide  = pow(1.0 - ndv, 1.9);

    // Localized, like a distant sun: concentrated where the light actually
    // reaches the edge, and falling off hard from there.
    float lit = pow(smoothstep(-0.10, 0.98, dot(n, normalize(uLightDir))), 2.2);

    // Almost nothing survives on the far side — no full outline anywhere.
    float a = (sharp * (0.015 + lit * 0.985) + wide * lit * 0.15) * uStrength;

    // Pale gold at the hot point, cooling to a softer tone as it falls away,
    // so the warmth never accumulates into an orange wash.
    vec3 col = mix(uGlowColor, uColor, clamp(lit * 1.35, 0.0, 1.0));
    gl_FragColor = vec4(col, a);
  }
`;

function Orb({ stateRef, reduced }: { stateRef: RefObject<CoreVisualState>; reduced: boolean }) {
  const bodyRef = useRef<THREE.Mesh>(null);
  const rimRef = useRef<THREE.Mesh>(null);
  const keyRef = useRef<THREE.PointLight>(null);
  const flareRef = useRef<THREE.Group>(null);

  // Nothing is drawn inside the body: no inner glow, no drifting motes, no
  // internal reflections. The interior is meant to be flatly, completely dark
  // so that only the edge reacts to the light.

  const flare = useMemo(() => makeGlowTexture(), []);

  // Warm sunlight yellow, not orange — orange is the single most common way
  // this reads as a lava planet instead of sunrise light in space.
  const rimUniforms = useMemo(
    () => ({
      // Pale gold, close to warm white at the hottest point. Saturated warm
      // tones accumulate under additive blending and turn the whole edge
      // orange, so both of these sit well below full saturation.
      uColor: { value: new THREE.Color("#fff3d6") },
      uGlowColor: { value: new THREE.Color("#e6cda0") },
      uLightDir: { value: new THREE.Vector3(1, 0, -0.2) },
      // high power keeps the lit band thin and sharp — a rim, not a wash
      uPower: { value: 6.8 },
      uStrength: { value: 0.78 },
    }),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const s = stateRef.current ?? { energy: 0, alpha: 1 };
    const speed = reduced ? 0.06 : 1;

    // The sun's slow trip around the Core, in the screen plane, so the bright
    // point tracks the visible edge. This is the only real motion in the piece.
    const a = t * ORBIT_SPEED * speed;
    const lx = Math.cos(a);
    const ly = Math.sin(a);

    if (keyRef.current) {
      // Behind the Core: the front face receives almost nothing, which is what
      // keeps the surface reading as an eclipsed silhouette rather than a lit ball.
      keyRef.current.position.set(lx * 3.6, ly * 3.6, -2.6);
      keyRef.current.intensity = (1.5 + Math.sin(t * 0.21 * speed) * 0.2) * (1 + s.energy * 2.2);
    }

    if (flareRef.current) {
      // pinned to the limb, a hair in front so it is never clipped by the body
      flareRef.current.position.set(lx * 1.215, ly * 1.215, 0.06);
      const pulse = 0.9 + Math.sin(t * 0.6 * speed) * 0.1;
      flareRef.current.scale.setScalar(pulse * (1 + s.energy * 0.7) * (1 - s.energy * 0.14));
      // the streak lies along the tangent, the way a real flare would
      flareRef.current.rotation.z = a;
    }

    if (bodyRef.current) {
      // Micro-rotation only — present, but never readable as spinning.
      bodyRef.current.rotation.y = t * 0.009 * speed;
      bodyRef.current.rotation.x = Math.sin(t * 0.05 * speed) * 0.035;
      const breathe = 1 + Math.sin(t * 0.42 * speed) * 0.007;
      bodyRef.current.scale.setScalar(breathe * (1 - s.energy * 0.14));
      const mat = bodyRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = s.alpha;
      mat.emissiveIntensity = 0.05 + s.energy * 0.9;
    }

    if (rimRef.current) {
      const u = (rimRef.current.material as THREE.ShaderMaterial).uniforms;
      // slightly behind, so the warm band wraps the edge instead of facing us
      u.uLightDir.value.set(lx, ly, -0.22).normalize();
      // no flicker: one slow, shallow drift, nothing that reads as a change
      u.uStrength.value = (0.78 + Math.sin(t * 0.19 * speed) * 0.04 + s.energy * 1.4) * s.alpha;
      u.uPower.value = 6.8 - s.energy * 2.6;
      rimRef.current.scale.setScalar(1 - s.energy * 0.14);
    }
  });

  return (
    <>
      {/* Barely there: the surface is meant to stay an almost-black silhouette,
          with the warm rim doing all the visible work. */}
      <ambientLight intensity={0.05} color="#7d8ba0" />
      <pointLight ref={keyRef} intensity={1.2} color="#ffeec4" distance={16} decay={1.4} />

      {/* the body — matte, untextured, almost black with a blue-grey bias */}
      <mesh ref={bodyRef}>
        <sphereGeometry args={[1.2, 96, 96]} />
        <meshStandardMaterial
          color="#060910"
          emissive="#0a1420"
          emissiveIntensity={0.05}
          roughness={0.92}
          metalness={0.04}
          transparent
          opacity={1}
        />
      </mesh>

      {/* The travelling edge light. One surface only — the sharp rim and its
          soft surround are two terms in the same shader, so there is no second
          circle floating outside the Core. */}
      <mesh ref={rimRef}>
        <sphereGeometry args={[1.215, 96, 96]} />
        <shaderMaterial
          vertexShader={rimVertex}
          fragmentShader={rimFragment}
          uniforms={rimUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* The sunrise point: where the light behind the Core reaches its edge.
          Additive only, no post-processing — three flat quads is all the bloom
          something this small needs. depthTest is off so the point is never
          bitten into by the body it sits on. */}
      <group ref={flareRef}>
        {/* soft atmospheric halo */}
        <mesh>
          <planeGeometry args={[1.05, 1.05]} />
          <meshBasicMaterial
            map={flare}
            color="#fff0d4"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
        {/* the bright point itself — soft bloom, never a harsh spot */}
        <mesh>
          <planeGeometry args={[0.34, 0.34]} />
          <meshBasicMaterial
            map={flare}
            color="#fffaf0"
            transparent
            opacity={0.68}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
        {/* a single quiet streak — the whole lens flare, kept to one element */}
        <mesh>
          <planeGeometry args={[2.0, 0.045]} />
          <meshBasicMaterial
            map={flare}
            color="#fff2dc"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>
      </group>
    </>
  );
}

export default function CoreSphere3D({
  stateRef,
  reduced = false,
}: {
  stateRef: RefObject<CoreVisualState>;
  reduced?: boolean;
}) {
  return (
    <Canvas
      // Transparent: the site's own background shows through untouched.
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      // Pulled back so the r=1.2 body fills ~71% of this canvas, leaving the
      // outer margin for the soft edge light to fall off into.
      camera={{ position: [0, 0, 4.9], fov: 38 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Orb stateRef={stateRef} reduced={reduced} />
    </Canvas>
  );
}
