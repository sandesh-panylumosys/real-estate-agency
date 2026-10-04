"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/data/types";

type Variant = "curtain" | "rise" | "sides" | "blueprint";

type Props = {
  image: ImageAsset;
  sizes: string;
  className?: string;
  variant?: Variant;
  preload?: boolean;
  parallax?: boolean;
  cursor?: string;
  imgClassName?: string;
};

/**
 * Architectural image reveal. Never a plain fade:
 *  - curtain:   a horizontal wipe, like a blind being drawn
 *  - rise:      the image rises out of a vertical crop
 *  - sides:     two panels part from the centre, like doors
 *  - blueprint: line drawing first, then the photograph fills the frame
 */
export function RevealImage({
  image,
  sizes,
  className,
  variant = "rise",
  preload,
  parallax = true,
  cursor,
  imgClassName,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = root.current!;
        const media = el.querySelector<HTMLElement>("[data-media]");
        const lines = el.querySelectorAll<SVGGeometryElement>("[data-line]");
        const from: Record<Variant, string> = {
          curtain: "inset(0% 100% 0% 0%)",
          rise: "inset(100% 0% 0% 0%)",
          sides: "inset(0% 50% 0% 50%)",
          blueprint: "inset(0% 0% 100% 0%)",
        };
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
        if (variant === "blueprint" && lines.length) {
          lines.forEach((l) => {
            const len = l.getTotalLength();
            gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
          });
          tl.to(lines, { strokeDashoffset: 0, duration: 1.1, stagger: 0.06, ease: "power2.inOut" });
        }
        tl.fromTo(
          media,
          { clipPath: from[variant] },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
          variant === "blueprint" ? "-=0.35" : 0,
        ).from(media!.querySelector("img"), { scale: 1.3, duration: 2.2, ease: "expo.out" }, "<");
        if (variant === "blueprint") tl.to(el.querySelector("[data-blueprint]"), { opacity: 0, duration: 0.8 }, "-=1");

        if (parallax) {
          gsap.fromTo(
            media!.querySelector("[data-parallax]"),
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={cn("relative overflow-hidden", className)} data-cursor={cursor}>
      {variant === "blueprint" && <BlueprintSketch />}
      <div data-media className="absolute inset-0 overflow-hidden">
        <div data-parallax className="absolute -inset-y-[8%] inset-x-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            preload={preload}
            className={cn("object-cover", imgClassName)}
          />
        </div>
      </div>
    </div>
  );
}

/** A generic elevation drawing used as the "plan" before the photograph appears. */
function BlueprintSketch() {
  return (
    <div data-blueprint aria-hidden className="absolute inset-0 bg-ink text-stone/50">
      <div className="blueprint-grid absolute inset-0 opacity-[0.06]" />
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <g fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke">
          <path data-line d="M20 250 H380" />
          <path data-line d="M60 250 V120 H230 V250" />
          <path data-line d="M180 120 V60 H340 V250" />
          <path data-line d="M80 150 H140 V230 H80 Z" />
          <path data-line d="M200 80 H320 V110 H200 Z" />
          <path data-line d="M250 150 H320 V250" />
          <path data-line d="M20 270 H380 M20 265 V275 M380 265 V275" />
        </g>
      </svg>
    </div>
  );
}
