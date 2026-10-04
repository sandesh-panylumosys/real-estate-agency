import { PropertyCard } from "@/components/property/PropertyCard";
import { Annotation, SectionLabel } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";
import type { Property } from "@/data/types";
import { cn } from "@/lib/utils";

/** The season's featured residences as a staggered editorial spread. */
export function SeasonSelection({ properties, index = "02" }: { properties: Property[]; index?: string }) {
  const layout = [
    "md:col-span-7",
    "md:col-span-4 md:col-start-9 md:mt-40",
    "md:col-span-5 md:col-start-2 md:-mt-10",
    "md:col-span-6 md:col-start-7 md:mt-24",
  ];
  return (
    <section data-nav="dark" aria-labelledby="season-title" className="relative bg-ink py-28 text-soft md:py-40">
      <div className="px-gutter flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <SectionLabel index={index} tone="dark">
            Selection · Autumn 2026
          </SectionLabel>
          <h2 id="season-title" className="font-display mt-10 text-[clamp(2.75rem,6vw,6rem)]">
            <RevealText as="span" by="words" className="block">
              This season&apos;s
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              residences.
            </RevealText>
          </h2>
        </div>
        <p className="max-w-sm text-[0.95rem] leading-[1.8] text-stone/75">
          Four homes our advisors would show first — chosen for their architecture, their light and their setting.
        </p>
      </div>
      <ul className="px-gutter mt-20 grid gap-x-8 gap-y-20 md:grid-cols-12 [&_h3]:text-soft [&_.text-muted]:text-taupe">
        {properties.map((p, i) => (
          <li key={p.slug} className={cn(layout[i % layout.length])}>
            <PropertyCard property={p} size={i % 3 === 0 ? "lg" : "md"} />
          </li>
        ))}
      </ul>
      <Annotation className="right-[var(--gutter)] top-16 hidden text-taupe md:flex">Curated · {String(properties.length).padStart(2, "0")} residences</Annotation>
    </section>
  );
}
