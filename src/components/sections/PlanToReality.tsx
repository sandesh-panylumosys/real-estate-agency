import { FloorPlan } from "@/components/property/FloorPlan";
import { Annotation, SectionLabel } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";
import type { FloorPlan as FloorPlanData } from "@/data/types";

/** Floor plan → real space. */
export function PlanToReality({ plan }: { plan: FloorPlanData }) {
  return (
    <section
      id="floor-plan"
      data-nav="dark"
      aria-labelledby="plan-title"
      className="relative overflow-hidden bg-charcoal py-28 text-soft md:py-40"
    >
      <div className="px-gutter grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index="04" tone="dark">
            Plan · Architecture · Reality
          </SectionLabel>
          <h2 id="plan-title" className="font-display mt-10 text-[clamp(2.75rem,6.5vw,6.5rem)]">
            <RevealText as="span" by="words" className="block">
              From the drawing
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              to the room.
            </RevealText>
          </h2>
        </div>
        <div className="flex items-end lg:col-span-4 lg:col-start-9">
          <RevealText className="text-[0.95rem] leading-[1.8] text-stone/80">
            Select a space on the plan to see it as it really is. Every line on the drawing becomes light, material
            and volume.
          </RevealText>
        </div>
      </div>
      <div className="px-gutter mt-16 md:mt-24">
        <FloorPlan plan={plan} />
      </div>
      <Annotation className="right-[var(--gutter)] top-16 hidden text-taupe md:flex">
        Scale 1:100 · Level 01
      </Annotation>
    </section>
  );
}
