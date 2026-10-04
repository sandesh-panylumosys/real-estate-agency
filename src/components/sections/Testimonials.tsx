"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { SectionLabel } from "@/components/ui/Architectural";
import type { Testimonial } from "@/data/types";
import { cn, pad2 } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Section 11 — "People Who Found Their Place" */
export function Testimonials({ testimonials, label = "11" }: { testimonials: Testimonial[]; label?: string }) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const t = testimonials[index];

  const go = useCallback(
    (next: number) => {
      setDir(next > index || (index === testimonials.length - 1 && next === 0) ? 1 : -1);
      setIndex((next + testimonials.length) % testimonials.length);
    },
    [index, testimonials.length],
  );

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setTimeout(() => go(index + 1), 9000);
    return () => window.clearTimeout(id);
  }, [index, paused, reduce, go]);

  return (
    <section
      id="stories"
      data-nav="light"
      aria-labelledby="stories-title"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-ivory py-28 text-ink md:py-40"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="px-gutter flex items-end justify-between gap-6">
        <div>
          <SectionLabel index={label}>Client Stories</SectionLabel>
          <h2 id="stories-title" className="font-display mt-8 text-[clamp(2.2rem,4vw,3.75rem)]">
            People who found <span className="accent text-taupe">their place.</span>
          </h2>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <NavButton label="Previous story" onClick={() => go(index - 1)} flip />
          <NavButton label="Next story" onClick={() => go(index + 1)} />
        </div>
      </div>

      <div className="px-gutter mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-10">
        <div className="relative aspect-[4/5] overflow-hidden lg:col-span-4" data-cursor="view">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={t.id}
              custom={dir}
              className="absolute inset-0"
              initial={{ clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0.6 }}
              transition={{ duration: 1.4, ease: [0.77, 0, 0.175, 1] }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.2, x: dir * 40 }}
                animate={{ scale: 1.04, x: 0 }}
                transition={{ duration: 6, ease: EASE }}
              >
                <Image src={t.image.src} alt={t.image.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          className="relative flex min-h-[26rem] flex-col justify-between lg:col-span-7 lg:col-start-6"
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${testimonials.length}`}
        >
          <span aria-hidden className="font-display absolute -left-2 -top-16 text-[12rem] leading-none text-bronze/25 md:-left-10">
            &ldquo;
          </span>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, x: dir * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -60 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="relative"
            >
              <blockquote className="font-display text-[clamp(2rem,4.4vw,4.4rem)] leading-[1.02]">{t.quote}</blockquote>
              <p className="mt-8 max-w-xl text-[0.95rem] leading-[1.8] text-muted">{t.story}</p>
              <figcaption className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 pt-6">
                <span className="font-serif text-2xl italic">{t.client}</span>
                <span className="meta text-muted">
                  {t.property} · {t.location}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          <div className="mt-12 flex items-center gap-6">
            <span className="meta tabular-nums text-muted">
              {pad2(index + 1)} / {pad2(testimonials.length)}
            </span>
            <div className="flex flex-1 gap-2">
              {testimonials.map((x, i) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show story ${i + 1}: ${x.client}`}
                  aria-current={i === index}
                  className="group relative h-11 flex-1"
                >
                  <span className="absolute inset-x-0 top-1/2 h-px bg-ink/15" />
                  <span
                    className={cn("absolute left-0 top-1/2 h-px bg-ink", i === index ? "w-full" : "w-0")}
                    key={i === index ? `${index}-${paused}` : undefined}
                    style={i === index && !paused && !reduce ? { animation: "grow 9s linear forwards" } : undefined}
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-3 sm:hidden">
              <NavButton label="Previous story" onClick={() => go(index - 1)} flip />
              <NavButton label="Next story" onClick={() => go(index + 1)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NavButton({ label, onClick, flip }: { label: string; onClick: () => void; flip?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-cursor=""
      className="group flex h-12 w-12 items-center justify-center rounded-full border border-ink/20 transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-soft"
    >
      <svg viewBox="0 0 20 12" className={cn("h-3 w-5 transition-transform duration-500 group-hover:translate-x-0.5", flip && "rotate-180 group-hover:-translate-x-0.5")}>
        <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
  );
}
