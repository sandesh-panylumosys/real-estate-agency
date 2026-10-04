"use client";

import Image from "next/image";
import { useRef } from "react";
import { Annotation, Dimension, SectionLabel } from "@/components/ui/Architectural";
import { CountUp } from "@/components/ui/CountUp";
import { RevealText } from "@/components/ui/RevealText";
import { media } from "@/data/media";
import type { AgencyStat } from "@/data/types";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** Section 2 — "We Don't Just Sell Spaces." */
export function AgencyStory({ stats, index = "01" }: { stats: AgencyStat[]; index?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // The image slowly scales as the story unfolds.
        gsap.fromTo(
          q("[data-story-img]"),
          { scale: 1.18, clipPath: "inset(8% 10% 8% 10%)" },
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: q("[data-story-media]")[0], start: "top 90%", end: "bottom 30%", scrub: 1 },
          },
        );
        // Background shifts from ivory toward warm stone.
        gsap.to(root.current, {
          backgroundColor: "#ECE7DF",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 60%", end: "bottom bottom", scrub: true },
        });
        // Architectural lines travel across the section.
        q("[data-arch-line]").forEach((line, i) => {
          gsap.fromTo(
            line,
            { xPercent: i % 2 ? 30 : -30 },
            {
              xPercent: i % 2 ? -30 : 30,
              ease: "none",
              scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
        gsap.from(q("[data-stat]"), {
          y: 40,
          opacity: 0,
          duration: 1.4,
          stagger: 0.12,
          scrollTrigger: { trigger: q("[data-stats]")[0], start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="about"
      data-nav="light"
      aria-labelledby="about-title"
      className="relative overflow-hidden bg-ivory py-28 md:py-40"
    >
      {/* Travelling architectural lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 text-ink/10">
        <div data-arch-line className="absolute left-[-20%] right-[-20%] top-[18%] h-px bg-current" />
        <div data-arch-line className="absolute left-[-20%] right-[-20%] top-[62%] h-px bg-current" />
        <div data-arch-line className="absolute left-[-20%] right-[-20%] bottom-[14%] h-px bg-current" />
      </div>

      <div className="px-gutter relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pt-10">
          <SectionLabel index={index}>The Agency</SectionLabel>
          <h2 id="about-title" className="font-display mt-10 text-[clamp(2.9rem,7vw,7rem)]">
            <RevealText as="span" by="words" className="block">
              We don&apos;t just
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              sell spaces.
            </RevealText>
          </h2>
          <RevealText
            className="font-serif mt-12 max-w-[26ch] text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15] text-charcoal"
          >
            We help people discover places that become part of their story.
          </RevealText>
          <RevealText className="mt-8 max-w-md text-[0.95rem] leading-[1.8] text-muted">
            For fifteen years, Atelier has represented a small number of exceptional residences — chosen for their
            architecture, their light and the lives they make possible. We advise quietly, look closely and never
            show a home we wouldn&apos;t live in ourselves.
          </RevealText>
        </div>

        <div className="relative lg:col-span-5 lg:col-start-8">
          <div data-story-media className="relative aspect-[4/5] overflow-hidden" data-cursor="view">
            <div data-story-img className="absolute inset-0">
              <Image
                src={media.whiteModern}
                alt="White modernist residence with sculptural angled volumes"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <Dimension label="11.80 m" className="mt-4 text-muted" />
          <Annotation className="-left-4 top-10 hidden -translate-x-full text-muted lg:flex" line="right">
            Elevation A — South
          </Annotation>
        </div>
      </div>

      <dl
        data-stats
        className="px-gutter relative mt-28 grid grid-cols-2 gap-y-14 md:mt-40 md:grid-cols-4"
      >
        {stats.map((s) => (
          <div
            key={s.label}
            data-stat
            className="flex flex-col-reverse gap-3 border-l border-ink/15 pl-5 md:pl-8"
          >
            <dt className="meta text-muted">{s.label}</dt>
            <dd className="font-display text-[clamp(3.25rem,7vw,6.5rem)] leading-none">
              <CountUp value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
