"use client";

import Image from "next/image";
import { useRef } from "react";
import { Annotation } from "@/components/ui/Architectural";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { media } from "@/data/media";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** Section 13 — "Perhaps Your Next Address Is Here." */
export function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-cta-frame]"),
          { clipPath: "inset(14% 14% 14% 14%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: 1 },
          },
        );
        gsap.fromTo(
          q("[data-cta-img]"),
          { scale: 1.3 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="next-address"
      data-nav="dark"
      aria-labelledby="cta-title"
      className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink text-soft"
    >
      <div data-cta-frame className="absolute inset-0">
        <div data-cta-img className="absolute inset-0">
          <Image src={media.houseNight} alt="Contemporary residence glowing at dusk" fill sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/40" />
      </div>

      <div className="px-gutter relative flex h-full flex-col items-center justify-center text-center">
        <p className="eyebrow text-stone">The next step</p>
        <RevealText as="h2" by="words" id="cta-title" className="font-display mt-8 max-w-[13ch] text-[clamp(3rem,8.5vw,9rem)]">
          Perhaps your next address is here.
        </RevealText>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Button href="#discover" tone="dark">
            Explore Properties
          </Button>
          <Button href="#enquire" tone="dark" variant="outline" arrow={false}>
            Talk to an Advisor
          </Button>
        </div>
        <p className="font-serif mt-14 text-xl italic text-stone">Let&apos;s find the place that fits your next chapter.</p>
      </div>

      <Annotation className="bottom-8 left-[var(--gutter)] text-stone" line="right">
        Sunset · 18:51 IST
      </Annotation>
    </section>
  );
}
