"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Annotation, CornerMarks, SectionLabel } from "@/components/ui/Architectural";
import type { ModelState } from "@/components/three/BuildingModel";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn, pad2 } from "@/lib/utils";

// Three.js is only fetched when this section approaches the viewport on a capable device.
const BuildingModel = dynamic(() => import("@/components/three/BuildingModel"), { ssr: false });

const ZONES = [
  { title: "The Building", body: "Ten levels of stone, glass and timber fins, oriented for sea light and cross-ventilation." },
  { title: "Arrival", body: "A double-height lobby with a reflecting pool and a private lift for every residence." },
  { title: "Residences", body: "Seven levels of full-floor homes, each with a wraparound terrace and 3.4 m ceilings." },
  { title: "Amenities", body: "A sky garden, lap pool and residents' library on the eighth floor." },
  { title: "Penthouse", body: "A setback crown with its own roof terrace and 360° views across the bay." },
];

/** The residence as an architectural model: Exterior → Floors → Zones → Amenities. */
export function ArchitectureModel({ index = "06" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);
  const state = useRef<ModelState>({ progress: 0, zone: 0 });
  const [zone, setZone] = useState(0);
  const [use3D, setUse3D] = useState(false);

  // Decide on 3D only when the section is about to be seen.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setUse3D(
          window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches &&
            !!document.createElement("canvas").getContext("webgl2"),
        );
      },
      { rootMargin: "100% 0px" },
    );
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        ScrollTrigger.create({
          trigger: root.current!.querySelector("[data-model-track]"),
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            state.current.progress = self.progress;
            const z = Math.min(ZONES.length - 1, Math.floor(self.progress * ZONES.length));
            if (z !== state.current.zone) {
              state.current.zone = z;
              setZone(z);
            }
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="architecture"
      data-nav="dark"
      aria-labelledby="arch-title"
      className="relative bg-ink text-soft"
    >
      <div data-model-track className="relative md:h-[400vh] md:motion-reduce:h-auto">
        <div className="relative grid min-h-[100svh] items-center gap-10 py-28 md:sticky md:top-0 md:h-[100svh] md:grid-cols-12 md:py-0">
          <div className="px-gutter relative z-10 md:col-span-5 lg:col-span-4">
            <SectionLabel index={index} tone="dark">
              The Architecture
            </SectionLabel>
            <h2 id="arch-title" className="font-display mt-10 text-[clamp(2.75rem,5vw,5.5rem)]">
              Built in <span className="accent text-taupe">layers.</span>
            </h2>

            <ol className="mt-12 flex flex-col">
              {ZONES.map((z, i) => (
                <li
                  key={z.title}
                  className={cn(
                    "border-t border-soft/10 py-4 transition-colors duration-700",
                    i === zone ? "text-soft" : "text-soft/35",
                  )}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={cn("meta text-[0.625rem]", i === zone && "text-bronze")}>{pad2(i + 1)}</span>
                    <span className="font-display text-[1.75rem] leading-none">{z.title}</span>
                  </div>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out-expo)] motion-reduce:grid-rows-[1fr] motion-reduce:opacity-100 max-md:grid-rows-[1fr] max-md:opacity-100",
                      i === zone ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <p className="overflow-hidden pl-10 pt-2 text-[0.9rem] leading-relaxed text-stone/80">{z.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative h-[60svh] md:col-span-7 md:h-full lg:col-span-8">
            <CornerMarks className="inset-8 text-soft/30" />
            {use3D ? <BuildingModel state={state} /> : <ElevationFallback zone={zone} />}
            <Annotation className="bottom-10 right-[var(--gutter)] text-taupe">
              Massing model · 1:500
            </Annotation>
            <Annotation className="left-10 top-24 hidden text-taupe md:flex" line="right">
              +42.00 m AOD
            </Annotation>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Static elevation drawing — mobile, reduced motion, or no WebGL. */
function ElevationFallback({ zone }: { zone: number }) {
  const floors = 10;
  const lit: number[][] = [[], [0], [1, 2, 3, 4, 5, 6, 7], [8], [9]];
  return (
    <svg viewBox="0 0 400 420" className="absolute inset-0 m-auto h-[85%] w-full" aria-hidden>
      <g fill="none" stroke="#D8D0C4" strokeWidth="1">
        <path d="M40 390 H360" stroke="#A8875A" />
        {Array.from({ length: floors }, (_, i) => {
          const inset = i === 9 ? 40 : i === 8 ? 12 : 0;
          const y = 390 - (i + 1) * 34;
          const on = lit[zone].includes(i);
          return (
            <g key={i} opacity={zone === 0 || on ? 1 : 0.25}>
              <rect
                x={110 + inset}
                y={y}
                width={180 - inset * 2}
                height={34}
                fill={on ? "rgba(168,135,90,0.25)" : "transparent"}
                stroke={on ? "#A8875A" : "#D8D0C4"}
                style={{ transition: "all .6s" }}
              />
              {Array.from({ length: 6 }, (_, k) => (
                <path key={k} d={`M${125 + inset + k * ((150 - inset * 2) / 5)} ${y + 4} V${y + 30}`} opacity="0.3" />
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
