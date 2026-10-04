import Link from "next/link";
import { SectionLabel } from "@/components/ui/Architectural";
import { RevealImage } from "@/components/ui/RevealImage";
import { RevealText } from "@/components/ui/RevealText";
import type { Article } from "@/data/types";
import { cn } from "@/lib/utils";

/** Section 12 — the Journal, laid out like a magazine spread. */
export function Journal({ articles, index = "12" }: { articles: Article[]; index?: string }) {
  const [feature, ...rest] = articles;
  const topics = ["Market Insights", "Architecture", "Neighbourhood Guides", "Buying Guides", "Investment", "Interior Design", "New Developments"];

  return (
    <section id="journal" data-nav="light" aria-labelledby="journal-title" className="relative bg-soft py-28 text-ink md:py-40">
      <div className="px-gutter flex flex-col justify-between gap-10 border-b border-ink/10 pb-10 md:flex-row md:items-end">
        <div>
          <SectionLabel index={index}>The Journal</SectionLabel>
          <h2 id="journal-title" className="font-display mt-8 text-[clamp(3rem,8vw,8rem)]">
            <RevealText as="span" by="words">
              Notes on living well.
            </RevealText>
          </h2>
        </div>
        <ul className="flex max-w-md flex-wrap gap-x-5 gap-y-2" aria-label="Topics">
          {topics.map((t) => (
            <li key={t} className="meta text-[0.625rem] text-muted">
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-gutter mt-16 grid gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Featured story */}
        <article className="group relative lg:col-span-7">
          <RevealImage image={feature.image} sizes="(min-width:1024px) 58vw, 100vw" variant="curtain" className="aspect-[4/3]" cursor="read" />
          <div className="mt-8 grid gap-6 md:grid-cols-[auto_1fr] md:gap-12">
            <p className="meta text-bronze">{feature.category}</p>
            <div>
              <h3 className="font-display text-[clamp(2.2rem,4vw,4rem)] transition-colors group-hover:text-charcoal/80">
                {/* Stretched link: the whole card opens the story without changing its layout */}
                <Link href={`/journal/${feature.slug}`} data-cursor="read" className="after:absolute after:inset-0 after:content-['']">
                  {feature.title}
                </Link>
              </h3>
              <p className="mt-4 max-w-lg text-[0.95rem] leading-[1.8] text-muted">{feature.excerpt}</p>
              <p className="meta mt-6 text-[0.625rem] text-muted">
                {feature.date} · {feature.readMinutes} min read
              </p>
            </div>
          </div>
        </article>

        {/* Secondary stories in an offset column */}
        <div className="flex flex-col gap-14 lg:col-span-4 lg:col-start-9 lg:pt-24">
          {rest.map((a, i) => (
            <article key={a.slug} className={cn("group relative grid grid-cols-[38%_1fr] items-start gap-5", i === 1 && "lg:ml-[-18%]")}>
              <RevealImage image={a.image} sizes="(min-width:1024px) 14vw, 38vw" variant={i % 2 ? "rise" : "sides"} className="aspect-[4/5]" parallax={false} cursor="read" />
              <div>
                <p className="meta text-[0.6rem] text-bronze">{a.category}</p>
                <h3 className="font-display mt-2 text-[1.75rem] leading-[1.02]">
                  <Link
                    href={`/journal/${a.slug}`}
                    data-cursor="read"
                    className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 after:absolute after:inset-0 after:content-[''] group-hover:bg-[length:100%_1px]"
                  >
                    {a.title}
                  </Link>
                </h3>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">{a.excerpt}</p>
                <p className="meta mt-3 text-[0.6rem] text-muted">{a.readMinutes} min read</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
