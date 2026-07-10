"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function generatePositions(count: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 18;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
  }
  return arr;
}

function Particles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const geometry = geometryRef.current;
    if (!geometry) return;
    geometry.setAttribute("position", new THREE.BufferAttribute(generatePositions(count), 3));
    geometry.attributes.position.needsUpdate = true;
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.015;
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.02;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.02;
    pointsRef.current.rotation.x = -mouse.current.y * 0.05;
    pointsRef.current.rotation.y += -mouse.current.x * 0.0002;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.028}
        color="#52f2ff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField({ density = 1 }: { density?: number }) {
  const count = Math.round(420 * density);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <Particles count={count} />
      </Canvas>
    </div>
  );
}
