"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const MILESTONES = [
  { year: "2011", title: "A studio in Bandra", body: "Atelier opens with two advisors and a handful of sea-facing apartments." },
  { year: "2015", title: "Beyond Mumbai", body: "Our first villas in Goa and Alibaug, chosen for their architects as much as their views." },
  { year: "2018", title: "New developments", body: "We begin advising architects and developers on residences before they are built." },
  { year: "2021", title: "Bengaluru & Pune", body: "Two new studios, and a private-listings service for discreet sales." },
  { year: "2024", title: "Investment advisory", body: "A dedicated team for yield, appreciation and portfolio planning." },
  { year: "2026", title: "Eighteen locations", body: "Five hundred clients advised — and still a deliberately small practice." },
];

/** A timeline drawn as a single line that extends as you scroll. */
export function Milestones({ index = "03" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-ms-line]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: q("[data-ms-list]")[0], start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        q("[data-ms-item]").forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, x: -24 },
            { autoAlpha: 1, x: 0, duration: 1.2, scrollTrigger: { trigger: el, start: "top 80%", once: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-nav="light" aria-labelledby="ms-title" className="relative bg-soft py-28 text-ink md:py-40">
      <div className="px-gutter grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index={index}>Our story</SectionLabel>
          <h2 id="ms-title" className="font-display mt-10 text-[clamp(2.75rem,5.5vw,5.75rem)]">
            <RevealText as="span" by="words" className="block">
              Fifteen years,
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              one address at a time.
            </RevealText>
          </h2>
        </div>
        <ol data-ms-list className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="absolute bottom-0 left-[5.5rem] top-0 hidden w-px bg-ink/10 sm:block">
            <span data-ms-line className="absolute inset-0 origin-top bg-bronze" />
          </span>
          {MILESTONES.map((m) => (
            <li key={m.year} data-ms-item className="relative grid gap-2 pb-14 sm:grid-cols-[5.5rem_1fr] sm:gap-10">
              <span className="font-display text-3xl text-bronze">{m.year}</span>
              <div className="sm:pl-6">
                <span aria-hidden className="absolute left-[5.5rem] top-3 hidden h-2 w-2 -translate-x-1/2 rounded-full bg-ink sm:block" />
                <h3 className="font-display text-3xl">{m.title}</h3>
                <p className="mt-2 max-w-md text-[0.9rem] leading-[1.8] text-muted">{m.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
