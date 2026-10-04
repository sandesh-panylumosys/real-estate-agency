import Link from "next/link";
import { AdvisorBand } from "@/components/layout/AdvisorBand";
import { Annotation } from "@/components/ui/Architectural";
import { Arrow } from "@/components/ui/Button";
import { RevealImage } from "@/components/ui/RevealImage";
import { RevealText } from "@/components/ui/RevealText";
import type { Article, ArticleBlock } from "@/data/types";
import { cn } from "@/lib/utils";
import { ReadingProgress, ShareStory } from "./ArticleTools";

/** A single journal story, set like a magazine feature. */
export function ArticleView({ article, related }: { article: Article; related: Article[] }) {
  const firstParagraph = article.body.findIndex((b) => b.type === "p");

  return (
    <>
      <ReadingProgress targetId="article-body" />

      <header data-nav="dark" className="relative overflow-hidden bg-ink pb-16 pt-36 text-soft md:pb-24 md:pt-44">
        <div className="px-gutter">
          <nav aria-label="Breadcrumb" className="meta flex items-center gap-3 text-[0.625rem] text-stone/80">
            <Link href="/" className="hover:text-soft">
              Home
            </Link>
            <span className="h-px w-6 bg-current opacity-50" />
            <Link href="/journal" className="hover:text-soft">
              Journal
            </Link>
            <span className="h-px w-6 bg-current opacity-50" />
            <span aria-current="page" className="text-bronze">
              {article.category}
            </span>
          </nav>
          <RevealText as="h1" by="words" delay={0.6} className="font-display mt-10 max-w-[18ch] text-[clamp(2.75rem,7vw,7.5rem)]">
            {article.title}
          </RevealText>
          <div className="mt-10 flex flex-col gap-6 border-t border-soft/10 pt-8 md:flex-row md:items-end md:justify-between">
            <p className="font-serif max-w-xl text-[clamp(1.25rem,1.8vw,1.6rem)] italic leading-snug text-stone">{article.excerpt}</p>
            <p className="meta shrink-0 text-[0.625rem] text-taupe">
              {article.author.name} · <time dateTime={article.isoDate}>{article.date}</time> · {article.readMinutes} min read
            </p>
          </div>
        </div>
        <Annotation className="right-[var(--gutter)] top-28 hidden text-taupe md:flex">The Journal · {article.category}</Annotation>
      </header>

      <div data-nav="light" className="bg-soft text-ink">
        <div className="px-gutter -mt-px pt-0">
          <RevealImage image={article.image} sizes="100vw" variant="curtain" preload className="aspect-[16/10] md:aspect-[21/9]" />
        </div>

        <article id="article-body" aria-label={article.title} className="px-gutter grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="flex flex-col gap-8 lg:sticky lg:top-28">
              <div>
                <p className="meta text-[0.6rem] text-muted">Written by</p>
                <p className="font-display mt-2 text-2xl">{article.author.name}</p>
                <p className="text-[0.85rem] text-muted">{article.author.role}</p>
              </div>
              <div>
                <p className="meta mb-3 text-[0.6rem] text-muted">Share this story</p>
                <ShareStory title={article.title} path={`/journal/${article.slug}`} />
              </div>
            </div>
          </aside>

          <div className="max-w-[44rem] lg:col-span-7 lg:col-start-5">
            {article.body.map((block, i) => (
              <Block key={i} block={block} dropCap={i === firstParagraph} />
            ))}
            <div className="mt-16 flex items-center gap-4 border-t border-ink/10 pt-8">
              <span className="h-2 w-2 rotate-45 bg-bronze" aria-hidden />
              <Link href="/journal" className="meta text-muted hover:text-ink">
                Back to the Journal
              </Link>
            </div>
          </div>
        </article>
      </div>

      {related.length > 0 && (
        <section data-nav="dark" aria-labelledby="related-stories" className="bg-ink py-24 text-soft md:py-32">
          <div className="px-gutter flex items-end justify-between gap-6">
            <h2 id="related-stories" className="font-display text-[clamp(2.25rem,4.5vw,4.5rem)]">
              Continue <span className="accent text-taupe">reading</span>
            </h2>
            <Link href="/journal" className="meta hidden items-center gap-3 text-stone hover:text-soft sm:inline-flex">
              All stories <Arrow />
            </Link>
          </div>
          <ul className="px-gutter mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
            {related.map((a, i) => (
              <li key={a.slug} className={cn(i === 1 && "md:mt-16")}>
                <article className="group relative">
                  <RevealImage image={a.image} sizes="(min-width:768px) 33vw, 100vw" variant={i % 2 ? "rise" : "sides"} className="aspect-[4/5]" parallax={false} cursor="read" />
                  <p className="meta mt-5 text-[0.6rem] text-bronze">{a.category}</p>
                  <h3 className="font-display mt-2 text-[clamp(1.6rem,2.2vw,2.25rem)] leading-[1.05]">
                    <Link href={`/journal/${a.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-stone">
                      {a.title}
                    </Link>
                  </h3>
                  <p className="meta mt-3 text-[0.6rem] text-taupe">{a.readMinutes} min read</p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}

      <AdvisorBand
        title="Questions about the market?"
        body="Our advisors are happy to talk through anything you've read — on WhatsApp or by phone."
        message={`Hello Atelier Estates, I just read "${article.title}" and had a question.`}
      />
    </>
  );
}

function Block({ block, dropCap }: { block: ArticleBlock; dropCap?: boolean }) {
  switch (block.type) {
    case "p":
      return (
        <p
          className={cn(
            "mt-6 text-[1.05rem] leading-[1.9] text-charcoal/85 first:mt-0",
            dropCap &&
              "first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[4.6rem] first-letter:leading-[0.8] first-letter:text-bronze",
          )}
        >
          {block.text}
        </p>
      );
    case "h":
      return <h2 className="font-display mt-14 text-[clamp(1.9rem,3vw,2.75rem)] leading-tight">{block.text}</h2>;
    case "quote":
      return (
        <figure className="my-14 border-l border-bronze pl-6 md:-ml-16 md:pl-14">
          <blockquote className="font-serif text-[clamp(1.75rem,3vw,2.75rem)] italic leading-[1.15]">&ldquo;{block.text}&rdquo;</blockquote>
          {block.cite && <figcaption className="meta mt-5 text-[0.6rem] text-muted">— {block.cite}</figcaption>}
        </figure>
      );
    case "image":
      return (
        <figure className="my-14 md:-mx-16">
          <RevealImage image={block.image} sizes="(min-width:1024px) 50vw, 100vw" variant="rise" className="aspect-[16/10]" cursor="view" />
          {block.caption && <figcaption className="meta mt-4 text-[0.6rem] text-muted">{block.caption}</figcaption>}
        </figure>
      );
    case "list":
      return (
        <ul className="mt-8 flex flex-col gap-4 border-y border-ink/10 py-6">
          {block.items.map((item) => (
            <li key={item} className="grid grid-cols-[1.5rem_1fr] gap-3 text-[1rem] leading-[1.8] text-charcoal/85">
              <span className="mt-[0.85em] h-px w-4 bg-bronze" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      );
  }
}
