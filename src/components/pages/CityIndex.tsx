"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/Architectural";
import { Arrow } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import type { City } from "@/data/types";
import { cn, formatCoord, pad2 } from "@/lib/utils";

/**
 * City index: a list on the left, a held photograph on the right that
 * changes with the city under the cursor (or focus). On small screens each
 * city becomes its own card.
 */
export function CityIndex({
  cities,
  counts,
  index = "01",
}: {
  cities: City[];
  counts: Record<string, number>;
  index?: string;
}) {
  const [active, setActive] = useState(0);
  const city = cities[active];

  return (
    <section data-nav="light" aria-labelledby="cities-title" className="relative bg-ivory py-28 text-ink md:py-40">
      <div className="px-gutter grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index={index}>Where we work</SectionLabel>
          <h2 id="cities-title" className="font-display mt-10 text-[clamp(2.75rem,6vw,6rem)]">
            <RevealText as="span" by="words" className="block">
              Five cities,
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              one way of seeing.
            </RevealText>
          </h2>
        </div>
      </div>

      <div className="px-gutter mt-16 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <ul className="border-t border-ink/10 lg:col-span-6">
          {cities.map((c, i) => (
            <li key={c.slug} className="border-b border-ink/10">
              <Link
                href={`/properties?city=${encodeURIComponent(c.name)}#discover`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                data-cursor="explore"
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 md:py-8"
              >
                <span className="meta text-muted">{pad2(i + 1)}</span>
                <span>
                  <span
                    className={cn(
                      "font-display block text-[clamp(2.5rem,5vw,4.75rem)] leading-none transition-[transform,color] duration-700 ease-[var(--ease-out-expo)]",
                      // Hover-driven emphasis on desktop only; phones show every city at full strength.
                      i === active ? "text-ink lg:translate-x-3" : "text-ink lg:text-ink/45",
                    )}
                  >
                    {c.name}
                  </span>
                  <span className="meta mt-3 block text-[0.6rem] text-muted">
                    {c.state} · {counts[c.name] ?? 0} {counts[c.name] === 1 ? "residence" : "residences"}
                  </span>
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-soft">
                  <Arrow />
                </span>
              </Link>
              {/* Mobile: inline photograph and details */}
              <div className="pb-8 lg:hidden">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={c.image.src} alt={c.image.alt} fill sizes="100vw" className="object-cover" />
                </div>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">{c.summary}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Desktop: held photograph */}
        <div className="relative hidden lg:col-span-5 lg:col-start-8 lg:block">
          <div className="sticky top-28">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
              {cities.map((c, i) => (
                <div
                  key={c.slug}
                  className="absolute inset-0 transition-[clip-path,transform] duration-[1100ms] ease-[var(--ease-arch)]"
                  style={{
                    clipPath: i === active ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                    zIndex: i === active ? 2 : 1,
                  }}
                >
                  <Image
                    src={c.image.src}
                    alt={i === active ? c.image.alt : ""}
                    fill
                    sizes="40vw"
                    className={cn("object-cover transition-transform duration-[1800ms] ease-[var(--ease-out-expo)]", i === active ? "scale-100" : "scale-110")}
                  />
                </div>
              ))}
              <span className="meta absolute bottom-5 left-5 z-10 text-[0.6rem] text-soft drop-shadow">
                {formatCoord(city.coordinates.lat, "lat")} · {formatCoord(city.coordinates.lng, "lng")}
              </span>
            </div>
            <p className="mt-6 max-w-md text-[0.95rem] leading-[1.8] text-muted" aria-live="polite">
              {city.summary}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {city.neighbourhoods.map((n) => (
                <li key={n} className="meta rounded-full border border-ink/15 px-3 py-1.5 text-[0.6rem] text-muted">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
