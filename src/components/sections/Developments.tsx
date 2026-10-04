"use client";

import Image from "next/image";
import { useRef } from "react";
import { Dimension, SectionLabel } from "@/components/ui/Architectural";
import type { Development } from "@/data/types";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Section 10 — "The Next Chapter Of The City"
 * Desktop: a pinned horizontal narrative driven by vertical scroll.
 * Touch / small screens: a native swipe rail with scroll snapping.
 */
export function Developments({ developments, index = "10" }: { developments: Development[]; index?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const track = q("[data-h-track]")[0] as HTMLElement;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-h-pin]")[0],
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => gsap.set(q("[data-h-progress]"), { scaleX: self.progress }),
          },
        });
        // Each panel's image drifts against the movement and its progress bar fills.
        q("[data-dev]").forEach((panel) => {
          gsap.fromTo(
            panel.querySelector("[data-dev-img]"),
            { xPercent: 10, scale: 1.15 },
            {
              xPercent: -10,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(panel.querySelector("[data-dev-bar]"), {
            scaleX: 0,
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 70%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="developments" data-nav="dark" aria-labelledby="dev-title" className="relative bg-ink text-soft">
      <div data-h-pin className="relative overflow-hidden lg:h-[100svh]">
        <div
          data-h-track
          className="rail flex h-full snap-x snap-mandatory scroll-px-[var(--gutter)] items-stretch gap-6 overflow-x-auto px-[var(--gutter)] py-28 lg:snap-none lg:gap-[4vw] lg:overflow-visible lg:py-0 lg:motion-reduce:overflow-x-auto"
          aria-label="Upcoming developments"
        >
          {/* Intro panel */}
          <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-center sm:w-[60vw] lg:w-[34vw]">
            <SectionLabel index={index} tone="dark">
              Developments
            </SectionLabel>
            <h2 id="dev-title" className="font-display mt-10 text-[clamp(2.75rem,5.5vw,6rem)]">
              The next chapter <span className="accent block text-taupe">of the city.</span>
            </h2>
            <p className="mt-8 max-w-sm text-[0.95rem] leading-[1.8] text-stone/80">
              New residences in early stages — available to our clients before public release.
            </p>
            <p className="meta mt-10 hidden items-center gap-3 text-taupe lg:flex">
              Scroll <span className="h-px w-12 bg-current" /> to travel
            </p>
            <p className="meta mt-10 flex items-center gap-3 text-taupe lg:hidden">
              Swipe <span className="h-px w-12 bg-current" />
            </p>
          </div>

          {developments.map((d) => (
            <article
              key={d.slug}
              data-dev
              aria-labelledby={`dev-${d.slug}`}
              className="flex w-[82vw] shrink-0 snap-start flex-col justify-center sm:w-[64vw] lg:w-[58vw]"
            >
              <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11] lg:aspect-auto lg:h-[58vh]" data-cursor="view">
                <div data-dev-img className="absolute -inset-x-[12%] inset-y-0">
                  <Image src={d.image.src} alt={d.image.alt} fill sizes="(min-width:1024px) 60vw, 85vw" className="object-cover" />
                </div>
                <span className="font-display absolute left-5 top-3 text-[clamp(4rem,9vw,9rem)] leading-none text-soft/85 mix-blend-overlay">
                  {d.index}
                </span>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
                <div>
                  <p className="meta text-taupe">
                    {d.neighborhood}, {d.city}
                  </p>
                  <h3 id={`dev-${d.slug}`} className="font-display mt-2 text-[clamp(2.2rem,3.6vw,3.5rem)]">
                    {d.name}
                  </h3>
                  <p className="mt-3 max-w-md text-[0.9rem] leading-relaxed text-stone/75">{d.summary}</p>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 self-end">
                  <div>
                    <dt className="meta text-[0.6rem] text-taupe">Completion</dt>
                    <dd className="mt-1 text-[0.95rem]">{d.completion}</dd>
                  </div>
                  <div>
                    <dt className="meta text-[0.6rem] text-taupe">Residences</dt>
                    <dd className="mt-1 text-[0.95rem]">{d.residences}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="meta flex justify-between text-[0.6rem] text-taupe">
                      <span>Construction</span>
                      <span>{d.progress}%</span>
                    </dt>
                    <dd className="relative mt-3 h-px bg-soft/15">
                      <span
                        data-dev-bar
                        className="absolute inset-y-0 left-0 origin-left bg-bronze"
                        style={{ width: `${d.progress}%` }}
                        role="progressbar"
                        aria-valuenow={d.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${d.name} construction progress`}
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}

          <div className="flex w-[60vw] shrink-0 snap-start flex-col justify-center sm:w-[40vw] lg:w-[26vw]">
            <Dimension label="Masterplan 2026–2029" className="text-taupe" />
            <p className="font-serif mt-8 text-3xl italic text-stone">Register for early access to new releases.</p>
            <a href="#enquire" className="meta mt-8 inline-flex min-h-11 items-center gap-3 border-b border-soft/40 pb-1 text-soft">
              Request the brochure
            </a>
          </div>
        </div>

        <div className="px-gutter pointer-events-none absolute inset-x-0 bottom-8 hidden items-center gap-6 lg:flex lg:motion-reduce:hidden">
          <span className="meta text-[0.6rem] text-taupe">01</span>
          <span className="relative h-px flex-1 bg-soft/15">
            <span data-h-progress className="absolute inset-0 origin-left scale-x-0 bg-stone" />
          </span>
          <span className="meta text-[0.6rem] text-taupe">0{developments.length}</span>
        </div>
      </div>
    </section>
  );
}
