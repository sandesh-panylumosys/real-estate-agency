"use client";

import { Edges } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type ModelState = { progress: number; zone: number };

const FLOORS = 10;
const FLOOR_H = 0.42;
const W = 3.2;
const D = 2.2;

/** Which floors each narrative zone highlights. */
const ZONE_FLOORS: number[][] = [
  [], // whole building
  [0], // arrival
  [1, 2, 3, 4, 5, 6, 7], // residences
  [8], // amenities
  [9], // penthouse
];

const BRONZE = new THREE.Color("#A8875A");
const STONE = new THREE.Color("#D8D0C4");

function Floor({ index, state }: { index: number; state: React.RefObject<ModelState> }) {
  const slab = useRef<THREE.MeshStandardMaterial>(null);
  const glass = useRef<THREE.MeshPhysicalMaterial>(null);
  const edges = useRef<THREE.LineBasicMaterial>(null);
  const isTop = index === FLOORS - 1;
  const inset = isTop ? 0.5 : index === 8 ? 0.15 : 0;
  const shift = index % 3 === 1 ? 0.12 : index % 3 === 2 ? -0.08 : 0;

  useFrame((_, dt) => {
    const zone = state.current?.zone ?? 0;
    const lit = ZONE_FLOORS[zone].includes(index);
    const dim = zone !== 0 && !lit;
    const k = 1 - Math.pow(0.002, dt);
    if (edges.current) {
      edges.current.color.lerp(lit ? BRONZE : STONE, k);
      edges.current.opacity += ((dim ? 0.18 : lit ? 1 : 0.55) - edges.current.opacity) * k;
    }
    if (glass.current) {
      const target = lit ? 0.32 : dim ? 0.03 : 0.1;
      glass.current.opacity += (target - glass.current.opacity) * k;
      glass.current.emissiveIntensity += ((lit ? 0.6 : 0) - glass.current.emissiveIntensity) * k;
    }
    if (slab.current) slab.current.opacity += ((dim ? 0.25 : 0.95) - slab.current.opacity) * k;
  });

  const y = index * FLOOR_H;
  const w = W - inset;
  const d = D - inset * 0.6;

  return (
    <group position={[shift, y, 0]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.12, 0.05, d + 0.12]} />
        <meshStandardMaterial ref={slab} color="#EDE7DD" roughness={0.9} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0, FLOOR_H / 2, 0]}>
        <boxGeometry args={[w, FLOOR_H - 0.05, d]} />
        <meshPhysicalMaterial
          ref={glass}
          color="#cfd6d8"
          emissive="#A8875A"
          emissiveIntensity={0}
          roughness={0.15}
          metalness={0.1}
          transparent
          opacity={0.1}
          depthWrite={false}
        />
        <Edges threshold={15}>
          <lineBasicMaterial ref={edges} color={STONE} transparent opacity={0.55} />
        </Edges>
      </mesh>
    </group>
  );
}

function Building({ state }: { state: React.RefObject<ModelState> }) {
  const group = useRef<THREE.Group>(null);
  const fins = useMemo(() => Array.from({ length: 9 }, (_, i) => -W / 2 + 0.2 + i * ((W - 0.4) / 8)), []);

  useFrame(({ camera }, dt) => {
    const p = state.current?.progress ?? 0;
    const k = 1 - Math.pow(0.001, dt);
    if (group.current) {
      const target = -0.7 + p * Math.PI * 0.9;
      group.current.rotation.y += (target - group.current.rotation.y) * k;
    }
    // A slow architectural camera: rise and close in as the story progresses.
    const camY = 2.2 + p * 2.2;
    const camZ = 9.4 - p * 1.6;
    camera.position.y += (camY - camera.position.y) * k;
    camera.position.z += (camZ - camera.position.z) * k;
    camera.lookAt(0, (FLOORS * FLOOR_H) / 2 - 0.2, 0);
  });

  return (
    <group ref={group} position={[0, -(FLOORS * FLOOR_H) / 2 + 0.4, 0]}>
      {Array.from({ length: FLOORS }, (_, i) => (
        <Floor key={i} index={i} state={state} />
      ))}
      {/* Vertical fins on the south face */}
      {fins.map((x) => (
        <mesh key={x} position={[x, (FLOORS - 1) * FLOOR_H * 0.5, D / 2 + 0.08]}>
          <boxGeometry args={[0.025, (FLOORS - 1) * FLOOR_H, 0.12]} />
          <meshStandardMaterial color="#A99B8B" roughness={0.7} />
        </mesh>
      ))}
      {/* Site plinth */}
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[6.5, 0.06, 4.6]} />
        <meshStandardMaterial color="#1f1f1f" roughness={1} />
        <Edges>
          <lineBasicMaterial color="#77736D" transparent opacity={0.6} />
        </Edges>
      </mesh>
      <gridHelper args={[14, 28, "#3a3835", "#262523"]} position={[0, -0.11, 0]} />
    </group>
  );
}

export default function BuildingModel({ state }: { state: React.RefObject<ModelState> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [5.5, 2.2, 9.4], fov: 32 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
      aria-hidden
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 4]} intensity={1.6} color="#FFE2BD" castShadow />
      <directionalLight position={[-6, 3, -4]} intensity={0.35} color="#9fb0d0" />
      <Building state={state} />
    </Canvas>
  );
}
