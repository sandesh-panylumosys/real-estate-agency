"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { SectionLabel } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";
import type { LocationGuide, PlaceCategory } from "@/data/types";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn, formatCoord } from "@/lib/utils";

const CATEGORIES: PlaceCategory[] = [
  "Schools",
  "Restaurants",
  "Business",
  "Shopping",
  "Parks",
  "Airport",
  "Hospitals",
  "Entertainment",
];

const STAGES = [
  { title: "The Property", note: "Your front door" },
  { title: "The Neighbourhood", note: "Within a ten-minute walk" },
  { title: "The City", note: "Within twenty-five minutes" },
  { title: "The Lifestyle", note: "Everything, connected" },
];

const C = 500;
const MAX_R = 440;
const radius = (km: number) => MAX_R * Math.sqrt(km / 11);
const polar = (bearing: number, km: number) => {
  const a = ((bearing - 90) * Math.PI) / 180;
  return { x: C + Math.cos(a) * radius(km), y: C + Math.sin(a) * radius(km) };
};

/** Section 6 — "Where Your Life Happens" */
export function LocationExperience({ guide, index = "07" }: { guide: LocationGuide; index?: string }) {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<PlaceCategory | "All">("All");
  const [hovered, setHovered] = useState<string | null>(null);
  const [stage, setStage] = useState(3);

  const places = useMemo(
    () => guide.places.filter((p) => filter === "All" || p.category === filter).sort((a, b) => a.minutes - b.minutes),
    [guide.places, filter],
  );

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        setStage(0);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q("[data-loc-track]")[0],
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            onUpdate: (self) => setStage(Math.min(3, Math.floor(self.progress * 4))),
          },
        });
        // Property → neighbourhood → city: the map zooms out around the house.
        tl.fromTo(q("[data-zoom]"), { scale: 4.2 }, { scale: 1, duration: 3, ease: "power1.inOut" })
          .fromTo(q("[data-ring]"), { opacity: 0 }, { opacity: 1, stagger: 0.4, duration: 0.6 }, 0.2)
          .fromTo(q("[data-marker]"), { opacity: 0 }, { opacity: 1, stagger: 0.08, duration: 0.4 }, 0.8)
          .to({}, { duration: 1 });
        return () => setStage(3);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="location"
      data-nav="light"
      aria-labelledby="loc-title"
      className="relative bg-ivory text-ink"
    >
      <div data-loc-track className="relative lg:h-[320vh] lg:motion-reduce:h-auto">
        <div className="grid gap-12 py-28 lg:sticky lg:top-0 lg:h-[100svh] lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-0">
          <div className="px-gutter lg:col-span-5 lg:pr-0">
            <SectionLabel index={index}>
              {guide.neighborhood}, {guide.city}
            </SectionLabel>
            <h2 id="loc-title" className="font-display mt-8 text-[clamp(2.75rem,5.2vw,5.5rem)]">
              <RevealText as="span" by="words" className="block">
                Where your
              </RevealText>
              <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
                life happens.
              </RevealText>
            </h2>

            <div className="mt-6 hidden h-16 lg:block" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p
                  key={stage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-baseline gap-4"
                >
                  <span className="meta text-bronze">0{stage + 1}</span>
                  <span className="font-display text-3xl">{STAGES[stage].title}</span>
                  <span className="meta text-muted">{STAGES[stage].note}</span>
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="mt-4 max-w-md text-[0.95rem] leading-[1.8] text-muted">{guide.summary}</p>

            <div role="group" aria-label="Filter nearby places" className="mt-8 flex flex-wrap gap-2">
              {(["All", ...CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={filter === c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "min-h-10 rounded-full border px-3.5 text-[0.7rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-500",
                    filter === c ? "border-ink bg-ink text-soft" : "border-ink/15 text-ink/70 hover:border-ink/50",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <ul className="mt-8 max-h-[30vh] divide-y divide-ink/10 overflow-y-auto border-y border-ink/10 lg:max-h-[24vh]" data-lenis-prevent>
              <AnimatePresence initial={false}>
                {places.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onPointerEnter={() => setHovered(p.id)}
                    onPointerLeave={() => setHovered(null)}
                    className={cn(
                      "flex items-baseline justify-between gap-4 py-3 transition-colors",
                      hovered === p.id && "text-bronze",
                    )}
                  >
                    <span className="text-[0.9rem]">{p.name}</span>
                    <span className="meta shrink-0 text-muted">
                      {p.category} · {p.minutes} min
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          <div className="relative aspect-square w-full overflow-hidden lg:col-span-7 lg:aspect-auto lg:h-full">
            <svg
              viewBox="0 0 1000 1000"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label={`Map of places near the property in ${guide.neighborhood}`}
            >
              <g data-zoom style={{ transformOrigin: "500px 500px" }}>
                {/* Coastline to the west */}
                <path
                  d="M160 -20 C 210 140, 150 260, 200 380 S 300 560, 240 700 S 180 900, 250 1040"
                  fill="none"
                  stroke="#A99B8B"
                  strokeWidth="1.2"
                />
                <path d="M160 -20 C 210 140, 150 260, 200 380 S 300 560, 240 700 S 180 900, 250 1040 L -20 1040 L -20 -20 Z" fill="#D8D0C4" opacity="0.35" />
                {/* Streets */}
                <g stroke="#171717" strokeOpacity="0.08" strokeWidth="1">
                  {Array.from({ length: 14 }, (_, i) => (
                    <path key={`h${i}`} d={`M0 ${i * 75 + 20} L1000 ${i * 75 + 50}`} />
                  ))}
                  {Array.from({ length: 12 }, (_, i) => (
                    <path key={`v${i}`} d={`M${i * 90 + 260} 0 L${i * 90 + 230} 1000`} />
                  ))}
                </g>
                <path d="M200 520 Q 500 470 1000 560" fill="none" stroke="#171717" strokeOpacity="0.2" strokeWidth="2.5" />
                <path d="M560 0 Q 520 500 600 1000" fill="none" stroke="#171717" strokeOpacity="0.2" strokeWidth="2.5" />

                {/* Distance rings */}
                {[1, 3, 6, 10].map((km) => (
                  <g key={km} data-ring>
                    <circle cx={C} cy={C} r={radius(km)} fill="none" stroke="#171717" strokeOpacity="0.18" strokeDasharray="3 6" />
                    <text
                      x={C + radius(km) * 0.7071 + 6}
                      y={C - radius(km) * 0.7071 - 6}
                      fill="#77736D"
                      style={{ fontSize: 12, letterSpacing: "0.14em" }}
                    >
                      {km} KM
                    </text>
                  </g>
                ))}

                {/* Places */}
                {guide.places.map((p) => {
                  const { x, y } = polar(p.bearing, p.km);
                  const visible = filter === "All" || p.category === filter;
                  const isHover = hovered === p.id;
                  return (
                    <g
                      key={p.id}
                      data-marker
                      transform={`translate(${x} ${y})`}
                      onPointerEnter={() => setHovered(p.id)}
                      onPointerLeave={() => setHovered(null)}
                      style={{ transition: "opacity .5s" }}
                      opacity={visible ? 1 : 0.12}
                      data-cursor="discover"
                    >
                      <line x1={0} y1={0} x2={C - x} y2={C - y} stroke="#A8875A" strokeOpacity={isHover ? 0.6 : 0} strokeWidth="1" />
                      <circle r={isHover ? 9 : 5} fill={isHover ? "#A8875A" : "#171717"} style={{ transition: "all .4s" }} />
                      {visible && <circle r="5" fill="none" stroke="#A8875A" className="pulse-ring" />}
                      {(isHover || (visible && filter !== "All")) && (
                        <g>
                          <rect x="14" y="-14" width={p.name.length * 7.6 + 24} height="28" fill="#171717" />
                          <text x="26" y="5" fill="#FAF9F6" style={{ fontSize: 12.5, letterSpacing: "0.04em" }}>
                            {p.name}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* The property */}
                <g transform={`translate(${C} ${C})`}>
                  <circle r="26" fill="none" stroke="#A8875A" strokeOpacity="0.5" />
                  <circle r="16" fill="#A8875A" className="pulse-ring" opacity="0.5" />
                  <rect x="-8" y="-8" width="16" height="16" fill="#0D0D0D" transform="rotate(45)" />
                  <text y="52" textAnchor="middle" fill="#0D0D0D" style={{ fontSize: 13, letterSpacing: "0.2em", fontWeight: 600 }}>
                    THE ARIA RESIDENCE
                  </text>
                </g>
              </g>
            </svg>
            <p className="meta absolute bottom-6 right-[var(--gutter)] text-[0.6rem] text-muted">
              {formatCoord(guide.coordinates.lat, "lat")} · {formatCoord(guide.coordinates.lng, "lng")}
            </p>
            <p className="meta absolute left-6 top-6 text-[0.6rem] text-muted lg:top-24">Arabian Sea</p>
          </div>
        </div>
      </div>
    </section>
  );
}
