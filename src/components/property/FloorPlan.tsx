"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { CornerMarks } from "@/components/ui/Architectural";
import type { FloorPlan as FloorPlanData } from "@/data/types";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn, pad2 } from "@/lib/utils";

/**
 * Interactive floor plan: choose a room on the plan (or from the list) and
 * the real space appears beside it. Plan → Architecture → Reality.
 */
export function FloorPlan({ plan, tone = "dark" }: { plan: FloorPlanData; tone?: "dark" | "light" }) {
  const [activeId, setActiveId] = useState(plan.rooms[0].id);
  const active = plan.rooms.find((r) => r.id === activeId)!;
  const root = useRef<HTMLDivElement>(null);

  // Draw the plan when it scrolls into view.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const lines = q("[data-wall]") as unknown as SVGGeometryElement[];
        lines.forEach((l) => {
          const len = l.getTotalLength();
          gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
        });
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%", once: true } });
        tl.to(lines, { strokeDashoffset: 0, duration: 1.6, stagger: 0.05, ease: "power2.inOut" })
          .from(q("[data-room-fill]"), { opacity: 0, duration: 0.8, stagger: 0.06 }, "-=0.6")
          .from(q("[data-room-label]"), { opacity: 0, y: 8, duration: 0.6, stagger: 0.05 }, "<");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const dark = tone === "dark";
  const stroke = dark ? "#D8D0C4" : "#171717";

  return (
    <div ref={root} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className={cn("relative p-4 sm:p-8", dark ? "text-stone" : "text-ink")}>
          <CornerMarks className="opacity-50" />
          <div className="blueprint-grid absolute inset-0 opacity-[0.05]" aria-hidden />
          <svg viewBox="0 0 1000 640" className="relative w-full" role="group" aria-label={`${plan.title} floor plan`}>
            {/* Outer walls & internal partitions */}
            <g fill="none" stroke={stroke} strokeLinecap="square">
              <path data-wall d="M60 60 H940 V580 H60 Z" strokeWidth="6" />
              <path data-wall d="M520 60 V580" strokeWidth="3" />
              <path data-wall d="M760 60 V400" strokeWidth="3" />
              <path data-wall d="M60 360 H520" strokeWidth="3" />
              <path data-wall d="M340 360 V580" strokeWidth="3" />
              <path data-wall d="M520 400 H940" strokeWidth="3" />
              {/* Door swings */}
              <path data-wall d="M430 360 A60 60 0 0 1 370 420" strokeWidth="1" opacity="0.6" />
              <path data-wall d="M520 300 A60 60 0 0 0 580 360" strokeWidth="1" opacity="0.6" />
              <path data-wall d="M760 330 A50 50 0 0 1 810 380" strokeWidth="1" opacity="0.6" />
              {/* Glazing along the terrace */}
              <path data-wall d="M560 580 H900" strokeWidth="1.5" strokeDasharray="10 6" opacity="0.7" />
              {/* Stair */}
              <path data-wall d="M360 380 H500 M360 400 H500 M360 420 H500 M360 440 H500 M360 460 H500 M360 480 H500" strokeWidth="1" opacity="0.5" />
            </g>

            {plan.rooms.map((room) => {
              const isActive = room.id === activeId;
              return (
                <g
                  key={room.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={`${room.name}, ${room.areaSqft} square feet`}
                  data-cursor="discover"
                  onClick={() => setActiveId(room.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveId(room.id);
                    }
                  }}
                  className="group outline-none"
                >
                  <path
                    data-room-fill
                    d={room.path}
                    className="transition-[fill,fill-opacity] duration-500"
                    fill={isActive ? "#A8875A" : stroke}
                    fillOpacity={isActive ? 0.28 : 0.02}
                  />
                  <path
                    d={room.path}
                    fill="none"
                    stroke="#A8875A"
                    strokeWidth="2"
                    className={cn(
                      "transition-opacity duration-500 group-hover:opacity-60 group-focus-visible:opacity-100",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <g data-room-label className="pointer-events-none" fill={stroke}>
                    <text
                      x={room.label.x}
                      y={room.label.y - 6}
                      textAnchor="middle"
                      className="font-sans"
                      style={{ fontSize: 15, letterSpacing: "0.18em", fontWeight: 600 }}
                    >
                      {room.name.toUpperCase()}
                    </text>
                    <text
                      x={room.label.x}
                      y={room.label.y + 18}
                      textAnchor="middle"
                      opacity="0.6"
                      style={{ fontSize: 13, letterSpacing: "0.12em" }}
                    >
                      {room.areaSqft} SQ FT
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Dimension strings */}
            <g stroke={stroke} opacity="0.5" strokeWidth="1">
              <path d="M60 28 H940 M60 20 V36 M940 20 V36" />
              <path d="M972 60 V580 M964 60 H980 M964 580 H980" />
            </g>
            <g fill={stroke} opacity="0.6" style={{ fontSize: 12, letterSpacing: "0.16em" }}>
              <text x="500" y="20" textAnchor="middle">
                24.40 M
              </text>
              <text x="990" y="324" textAnchor="middle" transform="rotate(90 990 324)">
                14.60 M
              </text>
            </g>
            {/* North arrow */}
            <g transform="translate(110 620)" stroke={stroke} fill="none" opacity="0.6">
              <circle r="12" />
              <path d="M0 -9 L4 6 L0 3 L-4 6 Z" fill={stroke} />
            </g>
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:col-span-5">
        <div className="relative aspect-[4/3] overflow-hidden bg-charcoal" data-cursor="view">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={active.id}
              className="absolute inset-0"
              initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={active.image.src} alt={active.image.alt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div aria-live="polite">
          <p className={cn("meta", dark ? "text-taupe" : "text-muted")}>
            {active.areaSqft} sq ft · {plan.title}
          </p>
          <p className="font-display mt-3 text-[clamp(2rem,3.5vw,3.25rem)]">{active.name}</p>
          <p className={cn("mt-2 text-[0.95rem] leading-relaxed", dark ? "text-stone/80" : "text-muted")}>{active.note}</p>
        </div>

        <ul className="flex flex-wrap gap-2" aria-label="Select a room">
          {plan.rooms.map((room, i) => {
            const isActive = room.id === activeId;
            return (
              <li key={room.id}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveId(room.id)}
                  data-cursor="discover"
                  className={cn(
                    "min-h-11 rounded-full border px-4 text-[0.75rem] font-medium tracking-[0.1em] uppercase transition-colors duration-500",
                    dark
                      ? isActive
                        ? "border-stone bg-stone text-ink"
                        : "border-soft/20 text-stone hover:border-stone"
                      : isActive
                        ? "border-ink bg-ink text-soft"
                        : "border-ink/20 text-ink hover:border-ink",
                  )}
                >
                  <span className="mr-2 opacity-50">{pad2(i + 1)}</span>
                  {room.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
