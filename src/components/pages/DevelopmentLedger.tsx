import { Dimension, SectionLabel } from "@/components/ui/Architectural";
import { RevealImage } from "@/components/ui/RevealImage";
import { RevealText } from "@/components/ui/RevealText";
import type { Development } from "@/data/types";
import { whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

const PHASES = [
  { label: "Foundation", at: 0 },
  { label: "Structure", at: 25 },
  { label: "Facade", at: 50 },
  { label: "Interiors", at: 75 },
  { label: "Handover", at: 100 },
];

/** Each development as a detailed editorial entry with its construction phase. */
export function DevelopmentLedger({ developments, index = "02" }: { developments: Development[]; index?: string }) {
  return (
    <section data-nav="light" aria-labelledby="ledger-title" className="relative bg-ivory py-28 text-ink md:py-40">
      <div className="px-gutter grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index={index}>In detail</SectionLabel>
          <h2 id="ledger-title" className="font-display mt-10 text-[clamp(2.75rem,6vw,6rem)]">
            <RevealText as="span" by="words" className="block">
              Where each one
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              stands today.
            </RevealText>
          </h2>
        </div>
      </div>

      <ol className="px-gutter mt-20 flex flex-col gap-28 md:gap-40">
        {developments.map((d, i) => {
          const phase = PHASES.reduce((acc, p, k) => (d.progress >= p.at ? k : acc), 0);
          const flip = i % 2 === 1;
          return (
            <li key={d.slug} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <div className={cn("lg:col-span-7", flip && "lg:order-2 lg:col-start-6")}>
                <RevealImage
                  image={d.image}
                  sizes="(min-width:1024px) 58vw, 100vw"
                  variant={flip ? "sides" : "blueprint"}
                  className="aspect-[4/3]"
                  cursor="view"
                />
                <Dimension label={d.residences} className="mt-4 text-muted" />
              </div>
              <article className={cn("lg:col-span-4", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9")}>
                <p className="meta flex items-center gap-3 text-muted">
                  <span className="text-bronze">{d.index}</span>
                  <span className="h-px w-8 bg-current opacity-40" />
                  {d.neighborhood}, {d.city}
                </p>
                <h3 className="font-display mt-5 text-[clamp(2.5rem,4.5vw,4.5rem)] leading-none">{d.name}</h3>
                <p className="mt-6 text-[0.95rem] leading-[1.8] text-muted">{d.summary}</p>

                <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-ink/10 pt-6">
                  <div>
                    <dt className="meta text-[0.6rem] text-muted">Completion</dt>
                    <dd className="font-display mt-1 text-3xl">{d.completion}</dd>
                  </div>
                  <div>
                    <dt className="meta text-[0.6rem] text-muted">Progress</dt>
                    <dd className="font-display mt-1 text-3xl">{d.progress}%</dd>
                  </div>
                </dl>

                {/* Construction phases */}
                <ol className="mt-8 grid grid-cols-5 gap-1.5" aria-label={`${d.name} construction phase: ${PHASES[phase].label}`}>
                  {PHASES.map((p, k) => (
                    <li key={p.label}>
                      <span className={cn("block h-[3px]", k < phase ? "bg-ink" : k === phase ? "bg-bronze" : "bg-ink/10")} />
                      <span
                        className={cn(
                          "meta mt-2 hidden text-[0.55rem] sm:block",
                          k === phase ? "text-ink" : "text-muted/70",
                        )}
                      >
                        {p.label}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="meta mt-3 text-[0.6rem] text-muted sm:hidden">
                  Current phase — <span className="text-ink">{PHASES[phase].label}</span>
                </p>

                <a
                  href={whatsappHref(`Hello Atelier Estates, I'd like early access details for ${d.name}, ${d.neighborhood}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="open"
                  className="meta mt-10 inline-flex min-h-11 items-center gap-3 border-b border-ink pb-1 text-ink transition-colors hover:text-bronze"
                >
                  Request early access on WhatsApp
                  <span className="sr-only">(opens WhatsApp)</span>
                </a>
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
