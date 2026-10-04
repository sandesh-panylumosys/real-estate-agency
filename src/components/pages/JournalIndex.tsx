"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { SectionLabel } from "@/components/ui/Architectural";
import { Arrow } from "@/components/ui/Button";
import type { Article } from "@/data/types";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The journal as a magazine: topic filter, a cover story, then an
 * asymmetric spread of the rest. Filtering re-composes the spread.
 */
export function JournalIndex({ articles, index = "01" }: { articles: Article[]; index?: string }) {
  const uid = useId();
  const [topic, setTopic] = useState("All");
  const topics = useMemo(() => ["All", ...Array.from(new Set(articles.map((a) => a.category)))], [articles]);
  const list = articles.filter((a) => topic === "All" || a.category === topic);
  const [cover, ...rest] = list;

  return (
    <section data-nav="light" aria-labelledby="journal-index-title" className="relative bg-soft py-24 text-ink md:py-32">
      <div className="px-gutter flex flex-col justify-between gap-8 border-b border-ink/10 pb-10 lg:flex-row lg:items-end">
        <div>
          <SectionLabel index={index}>All stories</SectionLabel>
          <h2 id="journal-index-title" className="font-display mt-8 text-[clamp(2.5rem,5vw,5rem)]">
            Read by <span className="accent text-taupe">topic.</span>
          </h2>
        </div>
        <div role="group" aria-label="Filter by topic" className="flex max-w-3xl flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={topic === t}
              onClick={() => setTopic(t)}
              className="relative min-h-10 rounded-full border border-ink/15 px-4 text-[0.7rem] font-semibold tracking-[0.12em] uppercase transition-colors hover:border-ink/50"
            >
              {topic === t && (
                <motion.span
                  layoutId={`${uid}-topic`}
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className={cn("relative transition-colors", topic === t ? "text-soft" : "text-ink")}>{t}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="px-gutter meta mt-6 text-muted" aria-live="polite">
        {list.length} {list.length === 1 ? "story" : "stories"}
        {topic !== "All" && ` in ${topic}`}
      </p>

      <LayoutGroup>
        <AnimatePresence mode="wait">
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {cover && <CoverStory article={cover} />}
            {rest.length > 0 && (
              <ul className="px-gutter mt-20 grid gap-x-8 gap-y-16 md:grid-cols-12 md:gap-y-24">
                {rest.map((a, i) => {
                  const pattern = i % 5;
                  const span = [
                    "md:col-span-5",
                    "md:col-span-6 md:col-start-7 md:mt-24",
                    "md:col-span-4",
                    "md:col-span-4 md:mt-16",
                    "md:col-span-4 md:-mt-8",
                  ][pattern];
                  return (
                    <li key={a.slug} className={span}>
                      <StoryCard article={a} tall={pattern === 0 || pattern === 3} />
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}

function CoverStory({ article }: { article: Article }) {
  return (
    <article className="group relative mt-12 grid gap-10 px-[var(--gutter)] lg:grid-cols-12 lg:items-end">
      <div className="relative aspect-[4/3] overflow-hidden lg:col-span-8 lg:aspect-[16/10]">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width:1024px) 66vw, 100vw"
          className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] group-hover:scale-105"
        />
        <span className="meta absolute left-5 top-5 rounded-full bg-soft/90 px-3 py-1.5 text-[0.6rem] backdrop-blur">
          Cover story
        </span>
      </div>
      <div className="lg:col-span-4">
        <p className="meta text-bronze">{article.category}</p>
        <h3 className="font-display mt-4 text-[clamp(2.25rem,3.6vw,3.75rem)] leading-[1]">
          <Link href={`/journal/${article.slug}`} data-cursor="read" className="after:absolute after:inset-0 after:content-['']">
            {article.title}
          </Link>
        </h3>
        <p className="mt-5 text-[0.95rem] leading-[1.8] text-muted">{article.excerpt}</p>
        <p className="meta mt-6 text-[0.6rem] text-muted">
          {article.author.name} · <time dateTime={article.isoDate}>{article.date}</time> · {article.readMinutes} min read
        </p>
        <span className="mt-8 inline-flex items-center gap-3 text-[0.75rem] font-semibold tracking-[0.12em] uppercase">
          Read the story <Arrow />
        </span>
      </div>
    </article>
  );
}

function StoryCard({ article, tall }: { article: Article; tall: boolean }) {
  return (
    <article className="group relative">
      <div className={cn("relative overflow-hidden", tall ? "aspect-[4/5]" : "aspect-[4/3]")}>
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          sizes="(min-width:768px) 40vw, 100vw"
          className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] group-hover:scale-105"
        />
      </div>
      <p className="meta mt-6 text-[0.6rem] text-bronze">{article.category}</p>
      <h3 className="font-display mt-2 text-[clamp(1.75rem,2.4vw,2.4rem)] leading-[1.02]">
        <Link
          href={`/journal/${article.slug}`}
          data-cursor="read"
          className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 after:absolute after:inset-0 after:content-[''] group-hover:bg-[length:100%_1px]"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 text-[0.9rem] leading-relaxed text-muted">{article.excerpt}</p>
      <p className="meta mt-4 text-[0.6rem] text-muted">
        <time dateTime={article.isoDate}>{article.date}</time> · {article.readMinutes} min read
      </p>
    </article>
  );
}
