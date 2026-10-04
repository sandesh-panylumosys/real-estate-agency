"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Simulated daylight. As the visitor moves through the page the light moves
 * from cool morning, through neutral daylight and golden hour, into evening.
 * A single fixed layer in soft-light blend mode — intentionally faint.
 */
const PHASES = [
  { at: 0.0, color: [196, 214, 240], sun: [78, 8], strength: 0.1 }, // morning
  { at: 0.3, color: [255, 250, 240], sun: [55, -4], strength: 0.04 }, // daylight
  { at: 0.65, color: [255, 186, 120], sun: [22, 10], strength: 0.14 }, // golden hour
  { at: 1.0, color: [70, 86, 140], sun: [8, 30], strength: 0.16 }, // evening
];

export function DynamicLighting() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const el = ref.current!;
      const apply = (p: number) => {
        let i = 0;
        while (i < PHASES.length - 2 && p > PHASES[i + 1].at) i++;
        const a = PHASES[i];
        const b = PHASES[i + 1];
        const t = gsap.utils.clamp(0, 1, (p - a.at) / (b.at - a.at));
        const mix = (x: number, y: number) => x + (y - x) * t;
        const [r, g, bl] = a.color.map((c, k) => Math.round(mix(c, b.color[k])));
        const sx = mix(a.sun[0], b.sun[0]);
        const sy = mix(a.sun[1], b.sun[1]);
        el.style.background = `radial-gradient(120% 90% at ${sx}% ${sy}%, rgba(${r},${g},${bl},1) 0%, rgba(${r},${g},${bl},0.35) 45%, rgba(${r},${g},${bl},0) 80%)`;
        el.style.opacity = String(mix(a.strength, b.strength));
      };
      apply(0);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => apply(self.progress),
      });
    });
    return () => mm.revert();
  });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] mix-blend-soft-light"
      style={{ opacity: 0 }}
    />
  );
}
