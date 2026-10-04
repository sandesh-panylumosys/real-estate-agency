"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Minimal architectural cursor. Any element can request a state with
 * data-cursor="explore" | "view" | "open" | "discover" (or any short label).
 * Only mounts for fine pointers; touch devices keep the native behaviour.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.15, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.15, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3.out" });

    let current: string | null = null;
    const onMove = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      setHidden(false);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const next = el?.dataset.cursor ?? (isInteractive(e.target) ? "" : null);
      if (next !== current) {
        current = next;
        setLabel(next);
      }
    };
    const onLeave = () => setHidden(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  const hasLabel = !!label;
  const isHover = label === "";

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[300] mix-blend-difference">
      <div
        ref={ring}
        className="absolute left-0 top-0 transition-opacity duration-300"
        style={{ opacity: hidden ? 0 : 1 }}
      >
        <div
          className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 text-white transition-[width,height,background-color,border-color] duration-500 ease-[var(--ease-out-expo)]"
          style={{
            width: hasLabel ? 92 : isHover ? 52 : 30,
            height: hasLabel ? 92 : isHover ? 52 : 30,
            backgroundColor: hasLabel ? "rgba(255,255,255,1)" : "transparent",
          }}
        >
          <span
            className="meta text-[0.6rem] tracking-[0.2em] text-black transition-opacity duration-300"
            style={{ opacity: hasLabel ? 1 : 0 }}
          >
            {label}
          </span>
        </div>
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 transition-opacity duration-200"
        style={{ opacity: hidden || hasLabel ? 0 : 1 }}
      >
        {/* A tiny crosshair: the architect's datum point */}
        <svg width="11" height="11" viewBox="0 0 11 11" className="-translate-x-1/2 -translate-y-1/2 text-white">
          <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

function isInteractive(target: EventTarget | null) {
  return !!(target as HTMLElement | null)?.closest?.("a, button, [role='button'], label, select");
}
