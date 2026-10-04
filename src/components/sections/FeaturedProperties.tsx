import { PropertyStory } from "@/components/property/PropertyStory";
import { Annotation, SectionLabel } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";
import type { Property } from "@/data/types";

/** Section 3 — "Spaces Worth Entering" */
export function FeaturedProperties({ properties }: { properties: Property[] }) {
  return (
    <section id="properties" aria-labelledby="properties-title" className="relative bg-ink text-soft">
      <header data-nav="dark" className="px-gutter relative grid gap-10 pb-20 pt-32 md:pb-28 md:pt-44 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index="02" tone="dark">
            Featured Residences
          </SectionLabel>
          <h2 id="properties-title" className="font-display mt-10 text-[clamp(3rem,8vw,8rem)]">
            <RevealText as="span" by="words" className="block">
              Spaces worth
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              entering.
            </RevealText>
          </h2>
        </div>
        <div className="flex items-end lg:col-span-4 lg:col-start-9">
          <RevealText className="max-w-sm text-[0.95rem] leading-[1.8] text-stone/80">
            Each residence is presented as its own story — the architecture, the light, the setting. Four of the
            homes we represent this season.
          </RevealText>
        </div>
        <Annotation className="bottom-10 right-[var(--gutter)] hidden text-taupe md:flex">
          Selection · Autumn 2026
        </Annotation>
      </header>

      {properties.map((p, i) => (
        <PropertyStory key={p.slug} property={p} index={i} total={properties.length} />
      ))}
    </section>
  );
}
