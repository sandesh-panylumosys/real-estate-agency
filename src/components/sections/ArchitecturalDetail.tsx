"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/Architectural";
import { RevealImage } from "@/components/ui/RevealImage";
import { RevealText } from "@/components/ui/RevealText";
import type { MaterialDetail } from "@/data/types";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { pad2 } from "@/lib/utils";

/**
 * Section 5 — "Architecture Is In The Details"
 * Material → Architecture → Interior → Detail. Large close-ups, each with a
 * drawn annotation, while a held index tracks the chapter.
 */
export function ArchitecturalDetail({ details }: { details: MaterialDetail[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const chapters = q("[data-chapter-item]");
      q("[data-detail]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && chapters.forEach((c, k) => c.toggleAttribute("data-active", k === i)),
        });
      });

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        q("[data-detail]").forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 60%", once: true } });
          tl.from(el.querySelector("[data-pin-dot]"), { scale: 0, duration: 0.6, ease: "back.out(2)" }, 0.9)
            .from(el.querySelector("[data-pin-line]"), { scaleX: 0, duration: 0.8, ease: "expo.inOut" }, 1.1)
            .from(el.querySelectorAll("[data-pin-text] > *"), { autoAlpha: 0, y: 12, stagger: 0.08, duration: 0.8 }, 1.5);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="details"
      data-nav="light"
      aria-labelledby="details-title"
      className="relative bg-soft py-28 text-ink md:py-40"
    >
      <div className="px-gutter grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index="05">Craft</SectionLabel>
            <h2 id="details-title" className="font-display mt-10 text-[clamp(2.75rem,5.5vw,5.75rem)]">
              <RevealText as="span" by="words" className="block">
                Architecture is
              </RevealText>
              <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
                in the details.
              </RevealText>
            </h2>
            <ol className="mt-14 hidden flex-col gap-4 lg:flex" aria-hidden>
              {details.map((d, i) => (
                <li
                  key={d.id}
                  data-chapter-item
                  {...(i === 0 ? { "data-active": "" } : {})}
                  className="group flex items-center gap-4 text-muted/60 transition-colors duration-500 data-[active]:text-ink"
                >
                  <span className="meta text-[0.625rem]">{pad2(i + 1)}</span>
                  <span className="h-px w-6 bg-current transition-all duration-700 group-data-[active]:w-14 group-data-[active]:bg-bronze" />
                  <span className="font-display text-3xl">{d.chapter}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-24 md:gap-40 lg:col-span-7 lg:col-start-6">
          {details.map((d, i) => (
            <article key={d.id} data-detail aria-labelledby={`detail-${d.id}`} className="relative">
              <div className="relative">
                <RevealImage
                  image={d.image}
                  sizes="(min-width:1024px) 55vw, 100vw"
                  variant={(["curtain", "sides", "rise", "blueprint"] as const)[i % 4]}
                  className={i % 2 ? "aspect-[4/5]" : "aspect-[5/4]"}
                  cursor="view"
                />
                {/* Annotation pinned to the material */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute flex items-center"
                  style={{ left: `${d.pin.x}%`, top: `${d.pin.y}%` }}
                >
                  <span data-pin-dot className="relative block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-soft bg-soft/30 backdrop-blur-sm">
                    <span className="absolute inset-[3px] rounded-full bg-soft" />
                  </span>
                  <span data-pin-line className="-translate-y-1/2 block h-px w-[clamp(2.5rem,8vw,7rem)] origin-left bg-soft" />
                  <span data-pin-text className="-translate-y-1/2 pl-3 text-soft">
                    <span className="meta block whitespace-nowrap bg-ink/45 px-2.5 py-1.5 text-[0.625rem] backdrop-blur-sm">{d.label}</span>
                  </span>
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-10">
                <p className="meta text-muted">
                  {pad2(i + 1)} — {d.chapter}
                </p>
                <div>
                  <h3 id={`detail-${d.id}`} className="font-display text-[clamp(2rem,3.5vw,3.25rem)]">
                    {d.label}
                  </h3>
                  <p className="meta mt-2 text-bronze">{d.spec}</p>
                  <p className="mt-4 max-w-md text-[0.95rem] leading-[1.8] text-muted">{d.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
