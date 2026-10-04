"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { site } from "@/data/site";

/**
 * Architectural loader: a single line is drawn → it becomes a floor plan →
 * the plan extrudes into a building outline → the page opens.
 * ~2.4s on first visit, skipped on repeat visits within a session, and a
 * short static fade for reduced motion.
 */
export function Loader() {
  const { markReady } = useExperience();
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = root.current!;
    const finish = () => {
      try {
        sessionStorage.setItem("atelier:intro", "1");
      } catch {}
      setDone(true);
      markReady();
    };

    let seen = false;
    try {
      seen = sessionStorage.getItem("atelier:intro") === "1";
    } catch {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || seen) {
      const t = gsap.to(el, { opacity: 0, duration: reduced ? 0.4 : 0.6, delay: 0.15, onComplete: finish });
      // Let the page start revealing while the veil fades.
      markReady();
      return () => {
        t.kill();
      };
    }

    const q = gsap.utils.selector(el);
    const prep = (sel: string) =>
      q(sel).forEach((p) => {
        const len = (p as unknown as SVGGeometryElement).getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
    prep("[data-l1]");
    prep("[data-l2]");
    prep("[data-l3]");

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tl.to(q("[data-l1]"), { strokeDashoffset: 0, duration: 0.6 })
      .to(q("[data-l2]"), { strokeDashoffset: 0, duration: 0.7, stagger: 0.05 }, "-=0.1")
      .to(q("[data-plan]"), { scaleY: 0.18, opacity: 0.5, transformOrigin: "50% 100%", duration: 0.6, ease: "expo.inOut" }, "+=0.05")
      .to(q("[data-l3]"), { strokeDashoffset: 0, duration: 0.7, stagger: 0.04 }, "-=0.25")
      .to(q("[data-count]"), { textContent: 100, snap: { textContent: 1 }, duration: 2.1, ease: "power2.inOut" }, 0)
      .to(q("[data-mark]"), { opacity: 0, y: -16, duration: 0.5, ease: "power2.in" }, "+=0.15")
      .to(q("[data-panel-top]"), { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.1")
      .to(q("[data-panel-bottom]"), { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "<")
      .add(() => markReady(), "<0.15")
      .add(finish);

    return () => {
      tl.kill();
    };
  }, [markReady]);

  if (done) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${site.name}`}
      className="fixed inset-0 z-[400] text-stone"
    >
      <div data-panel-top className="absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div data-panel-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-ink" />

      <div data-mark className="absolute inset-0 flex flex-col items-center justify-center">
        <svg viewBox="0 0 240 200" className="w-[min(56vw,240px)]" aria-hidden>
          <g fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
            {/* The line */}
            <path data-l1 d="M20 160 H220" />
            {/* The plan (squashes into the footprint, then the walls rise) */}
            <g data-plan>
              <path data-l2 d="M40 160 V60 H200 V160" />
              <path data-l2 d="M110 60 V115 H40" />
              <path data-l2 d="M150 160 V100 H200" />
              <path data-l2 d="M110 140 V160" />
            </g>
            {/* The building */}
            <path data-l3 d="M48 160 V88 H128 V160" />
            <path data-l3 d="M104 88 V44 H192 V160" />
            <path data-l3 d="M60 104 H116 M60 124 H116 M60 144 H116" />
            <path data-l3 d="M116 60 H180 M116 76 H180 M140 104 H180 M140 124 H180 M140 144 H180" />
            <path data-l3 d="M20 160 H220" stroke="#A8875A" />
          </g>
        </svg>
        <div className="mt-10 flex items-center gap-4 meta text-[0.625rem] text-taupe">
          <span>{site.name}</span>
          <span className="h-px w-8 bg-current" />
          <span>
            <span data-count>0</span>%
          </span>
        </div>
      </div>
    </div>
  );
}
