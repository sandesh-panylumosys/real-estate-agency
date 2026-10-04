"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useLenis } from "@/components/providers/SmoothScroll";
import { DISCOVER_EVENT, type DiscoverFilter } from "@/components/sections/PropertyDiscovery";
import { Arrow } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";
import type { Property, PropertyType } from "@/data/types";
import { gsap } from "@/lib/gsap";
import { formatINR, pad2 } from "@/lib/utils";

/**
 * Browse by type — an editorial index. Hovering a row floats a preview of a
 * residence beside the cursor; choosing one filters the search below.
 */
export function TypeIndex({ properties, index = "01" }: { properties: Property[]; index?: string }) {
  const lenis = useLenis();
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<PropertyType | null>(null);

  const groups = (["Villa", "Penthouse", "Apartment", "Farmhouse", "Commercial", "Plot"] as PropertyType[])
    .map((type) => {
      const items = properties.filter((p) => p.type === type);
      const sale = items.filter((p) => !p.priceSuffix);
      return {
        type,
        count: items.length,
        from: sale.length ? Math.min(...sale.map((p) => p.price)) : null,
        image: items[0]?.hero,
      };
    })
    .filter((g) => g.count > 0);

  const choose = (type: PropertyType) => {
    window.dispatchEvent(new CustomEvent<DiscoverFilter>(DISCOVER_EVENT, { detail: { type, purpose: "Buy" } }));
    const target = document.getElementById("discover");
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else target.scrollIntoView();
  };

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !preview.current) return;
    gsap.to(preview.current, { x: e.clientX + 32, y: e.clientY - 140, duration: 0.6, ease: "power3.out" });
  };

  return (
    <section
      data-nav="light"
      aria-labelledby="types-title"
      className="relative bg-soft py-28 text-ink md:py-36"
      onPointerMove={move}
      onPointerLeave={() => setHovered(null)}
    >
      <div className="px-gutter grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionLabel index={index}>Browse by type</SectionLabel>
          <h2 id="types-title" className="font-display mt-10 text-[clamp(2.75rem,6vw,6rem)]">
            <RevealText as="span" by="words" className="block">
              Every kind
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              of address.
            </RevealText>
          </h2>
        </div>
        <div className="flex items-end lg:col-span-4 lg:col-start-9">
          <p className="text-[0.95rem] leading-[1.8] text-muted">
            Choose a type to see every residence we represent in it — the search below updates instantly.
          </p>
        </div>
      </div>

      <ul className="px-gutter mt-16 border-t border-ink/10">
        {groups.map((g, i) => (
          <li key={g.type} className="border-b border-ink/10">
            <button
              type="button"
              onClick={() => choose(g.type)}
              onPointerEnter={() => setHovered(g.type)}
              onFocus={() => setHovered(g.type)}
              onBlur={() => setHovered(null)}
              data-cursor="view"
              className="group grid w-full grid-cols-[auto_1fr_auto] items-baseline gap-4 py-6 text-left md:grid-cols-[4rem_1fr_10rem_10rem_auto] md:gap-8 md:py-8"
            >
              <span className="meta text-muted">{pad2(i + 1)}</span>
              <span className="font-display text-[clamp(2.25rem,5.5vw,5.5rem)] leading-none transition-[transform,color] duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-4 group-hover:text-charcoal/70 group-focus-visible:translate-x-4">
                {g.type === "Commercial" ? "Commercial" : `${g.type}s`}
              </span>
              <span className="meta hidden text-muted md:block">
                {g.count} {g.count === 1 ? "residence" : "residences"}
              </span>
              <span className="meta hidden text-muted md:block">{g.from ? `From ${formatINR(g.from)}` : "On request"}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-soft">
                <Arrow />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Cursor-following preview (fine pointers only) */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-[280px] w-[220px] overflow-hidden [@media(hover:hover)]:block"
        style={{
          opacity: hovered ? 1 : 0,
          clipPath: hovered ? "inset(0% 0% 0% 0%)" : "inset(50% 0% 50% 0%)",
          transition: "opacity .4s, clip-path .7s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {groups.map(
          (g) =>
            g.image && (
              <Image
                key={g.type}
                src={g.image.src}
                alt=""
                fill
                sizes="220px"
                className="object-cover transition-opacity duration-500"
                style={{ opacity: hovered === g.type ? 1 : 0 }}
              />
            ),
        )}
      </div>
    </section>
  );
}
