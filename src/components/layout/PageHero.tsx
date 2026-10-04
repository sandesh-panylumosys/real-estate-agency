"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Annotation } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";
import type { ImageAsset } from "@/data/types";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/**
 * Hero for inner pages. Same visual language as the home hero but quieter:
 * a framed photograph that opens from a horizontal slit, an editorial title
 * and a breadcrumb. Scroll gently pushes the camera in.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  image,
  annotation,
  stats,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  intro: string;
  image: ImageAsset;
  annotation?: string;
  stats?: { label: string; value: string }[];
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-ph-frame]"),
          { clipPath: "inset(49% 0% 49% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut", delay: 0.2 },
        );
        gsap.fromTo(q("[data-ph-img]"), { scale: 1.3 }, { scale: 1.08, duration: 2.6, ease: "expo.out", delay: 0.2 });
        gsap.to(q("[data-ph-img]"), {
          scale: 1.2,
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.fromTo(
          q("[data-ph-fade]"),
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1, delay: 1.1 },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-nav="dark"
      aria-labelledby="page-title"
      className="relative flex min-h-[88svh] flex-col justify-end overflow-hidden bg-ink pb-14 pt-36 text-soft md:min-h-[92svh] md:pb-20"
    >
      <div data-ph-frame className="absolute inset-0">
        <div data-ph-img className="absolute inset-0">
          <Image src={image.src} alt={image.alt} fill preload sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      </div>

      <div className="px-gutter relative">
        <nav data-ph-fade aria-label="Breadcrumb" className="meta mb-8 flex items-center gap-3 text-[0.625rem] text-stone/80">
          <Link href="/" className="hover:text-soft">
            Home
          </Link>
          <span className="h-px w-6 bg-current opacity-50" />
          <span aria-current="page" className="text-soft">
            {eyebrow}
          </span>
        </nav>
        <RevealText as="h1" by="words" id="page-title" delay={0.9} className="font-display max-w-[15ch] text-[clamp(3rem,9vw,9rem)]">
          {title} {accent && <span className="accent text-stone">{accent}</span>}
        </RevealText>
        <div className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p data-ph-fade className="max-w-md text-[0.95rem] leading-[1.8] text-stone/90">
            {intro}
          </p>
          {stats && (
            <dl data-ph-fade className="flex flex-wrap gap-x-10 gap-y-6">
              {stats.map((s) => (
                <div key={s.label} className="border-l border-soft/20 pl-4">
                  <dt className="meta text-[0.6rem] text-taupe">{s.label}</dt>
                  <dd className="font-display mt-1 text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {annotation && (
        <Annotation className="right-[var(--gutter)] top-28 hidden text-stone md:flex">{annotation}</Annotation>
      )}
    </section>
  );
}
