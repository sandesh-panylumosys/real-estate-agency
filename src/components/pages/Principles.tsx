import { SectionLabel } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";

const PRINCIPLES = [
  {
    title: "Fewer, better homes",
    body: "We represent a small number of residences each season, so each one receives our full attention — and yours.",
  },
  {
    title: "Architecture first",
    body: "We judge a home by its light, proportion and materials before its square footage. It is why our homes hold their value.",
  },
  {
    title: "Honest numbers",
    body: "Prices, yields and timelines are explained plainly, with the context behind them. Never persuasion dressed as advice.",
  },
  {
    title: "Discretion, always",
    body: "Many of our residences are offered privately. Clients, sellers and their families can rely on our confidence.",
  },
];

/** The practice's principles as a large typographic list. */
export function Principles({ index = "02" }: { index?: string }) {
  return (
    <section data-nav="dark" aria-labelledby="principles-title" className="relative bg-ink py-28 text-soft md:py-40">
      <div className="px-gutter grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index={index} tone="dark">
              What we believe
            </SectionLabel>
            <h2 id="principles-title" className="font-display mt-10 text-[clamp(2.75rem,5vw,5.25rem)]">
              <RevealText as="span" by="words" className="block">
                Four quiet
              </RevealText>
              <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
                principles.
              </RevealText>
            </h2>
          </div>
        </div>
        <ol className="lg:col-span-7 lg:col-start-6">
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className="group grid gap-4 border-t border-soft/10 py-10 md:grid-cols-[5rem_1fr] md:py-14">
              <span className="meta pt-3 text-bronze">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-display text-[clamp(2.25rem,4vw,4rem)] leading-none transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                  {p.title}
                </h3>
                <RevealText className="mt-5 max-w-lg text-[0.95rem] leading-[1.8] text-stone/75">{p.body}</RevealText>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
