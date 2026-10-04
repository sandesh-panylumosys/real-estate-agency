"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Coordinates, ImageAsset } from "@/data/types";
import { cn, formatCoord } from "@/lib/utils";

/**
 * Property image with restrained hover behaviour: a slight perspective shift
 * toward the cursor, a slow zoom, and an architectural blueprint overlay with
 * the site coordinates. Pointer-only; touch shows the plain photograph.
 */
export function PropertyMedia({
  image,
  coordinates,
  sizes,
  className,
  preload,
  blueprint = true,
  children,
}: {
  image: ImageAsset;
  coordinates?: Coordinates;
  sizes: string;
  className?: string;
  preload?: boolean;
  blueprint?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  // Written straight to style to avoid re-rendering on every pointer move.
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current || !layer.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    layer.current.style.transform = `rotateY(${x * 3}deg) rotateX(${-y * 3}deg) scale(1.06) translate3d(${x * -14}px, ${y * -14}px, 0)`;
  };

  return (
    <div
      ref={ref}
      data-cursor="explore"
      onPointerMove={onMove}
      onPointerLeave={() => {
        if (layer.current) layer.current.style.transform = "none";
      }}
      className={cn("group relative overflow-hidden [perspective:1400px]", className)}
    >
      <div
        ref={layer}
        className="absolute inset-0 transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none"
      >
        <Image src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} className="object-cover" />
      </div>

      {blueprint && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-soft opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        >
          <div className="blueprint-grid absolute inset-0 opacity-[0.07]" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <g fill="none" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" opacity="0.7">
              <path
                d="M8 8 H92 V92 H8 Z"
                pathLength={1}
                className="[stroke-dasharray:1] [stroke-dashoffset:1] transition-[stroke-dashoffset] duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:[stroke-dashoffset:0]"
              />
              <path d="M8 50 H20 M80 50 H92 M50 8 V18 M50 82 V92" />
            </g>
          </svg>
          {coordinates && (
            <span className="meta absolute bottom-5 left-5 text-[0.6rem] text-soft/90 transition-transform duration-700 group-hover:translate-y-0 md:bottom-7 md:left-7">
              {formatCoord(coordinates.lat, "lat")} &nbsp; {formatCoord(coordinates.lng, "lng")}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
