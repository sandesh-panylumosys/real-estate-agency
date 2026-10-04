"use client";

import Image from "next/image";
import { useRef } from "react";
import { SectionLabel } from "@/components/ui/Architectural";
import { RevealImage } from "@/components/ui/RevealImage";
import { RevealText } from "@/components/ui/RevealText";
import type { WalkthroughStage } from "@/data/types";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { pad2 } from "@/lib/utils";

/**
 * Section 4 — "Walk Through The Space"
 * A continuous vertical journey: exterior → entrance → living → kitchen →
 * suite → bath → terrace → view. Each room rises into the frame from below,
 * as if you had just walked through the doorway.
 */
export function Walkthrough({ stages }: { stages: WalkthroughStage[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const layers = q("[data-room]");
        const inners = q("[data-room] [data-curtain]");
        const imgs = q("[data-room] [data-cam]");
        const texts = q("[data-room-copy]");
        const ticks = q("[data-tick]");

        const STEP = 1.2;
        const startOf = (i: number) => i * STEP - 0.4;

        // Transform-only curtain: the layer rises from below while its contents
        // counter-move, so the photograph stays still and only the edge travels.
        // (Animating clip-path on stacked full-screen layers caused stale tiles
        // and banding in Chromium; transforms stay on the compositor.)
        gsap.set(layers.slice(1), { yPercent: 100 });
        gsap.set(inners.slice(1), { yPercent: -100 });
        gsap.set(texts.slice(1), { autoAlpha: 0, y: 60 });

        let active = -1;
        const tl: gsap.core.Timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: q("[data-track]")[0],
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
          // Runs as the smoothed scrub advances, so the index matches what is on screen.
          onUpdate: () => {
            const t = tl.time();
            let next = 0;
            for (let i = 1; i < stages.length; i++) if (t >= startOf(i) + 0.6) next = i;
            if (next !== active) {
              active = next;
              ticks.forEach((tick, i) => tick.toggleAttribute("data-active", i === active));
              // Only rooms near the current one need to be painted at all.
              layers.forEach((l, i) => (l.style.visibility = i >= active - 1 && i <= active + 1 ? "visible" : "hidden"));
            }
            gsap.set(q("[data-progress]"), { scaleX: tl.progress() });
          },
        });

        tl.fromTo(imgs[0], { scale: 1.12 }, { scale: 1, duration: 1 }, 0);
        for (let i = 1; i < stages.length; i++) {
          const at = startOf(i);
          tl.fromTo(imgs[i - 1], { scale: 1 }, { scale: 1.08, duration: 1, immediateRender: false }, at)
            .fromTo(texts[i - 1], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -50, duration: 0.35, immediateRender: false }, at)
            .fromTo(layers[i], { yPercent: 100 }, { yPercent: 0, duration: 1, ease: "power2.inOut", immediateRender: false }, at)
            .fromTo(inners[i], { yPercent: -100 }, { yPercent: 0, duration: 1, ease: "power2.inOut", immediateRender: false }, at)
            .fromTo(imgs[i], { scale: 1.2 }, { scale: 1, duration: 1.2, immediateRender: false }, at)
            .fromTo(texts[i], { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.5, immediateRender: false }, at + 0.45);
        }
        tl.to({}, { duration: 0.4 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="walkthrough"
      aria-labelledby="walk-title"
      className="relative bg-ivory text-ink"
    >
      <header data-nav="light" className="px-gutter grid gap-10 pb-16 pt-32 md:pt-44 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionLabel index="03">The Aria Residence — Juhu</SectionLabel>
          <h2 id="walk-title" className="font-display mt-10 text-[clamp(3rem,8vw,8rem)]">
            <RevealText as="span" by="words" className="block">
              Walk through
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              the space.
            </RevealText>
          </h2>
        </div>
        <div className="flex items-end lg:col-span-3 lg:col-start-10">
          <RevealText className="text-[0.95rem] leading-[1.8] text-muted">
            Eight rooms, one continuous walk — from the street to the view you come home to.
          </RevealText>
        </div>
      </header>

      {/* Desktop: a single held frame, rooms arrive in sequence */}
      <div data-track className="relative hidden lg:block lg:motion-reduce:hidden" style={{ height: `${stages.length * 85}vh` }}>
        <div data-nav="dark" className="sticky top-0 h-[100svh] overflow-hidden bg-ink text-soft">
          {stages.map((s, i) => (
            <div key={s.id} data-room className="absolute inset-0 overflow-hidden bg-ink" aria-hidden={i > 0}>
              <div data-curtain className="absolute inset-0 overflow-hidden">
                <div data-cam className="absolute inset-0">
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="100vw" className="object-cover" />
                </div>
              </div>
            </div>
          ))}

          {/* One shared grade above every room, so overlapping rooms never band */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-ink/10" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />

          {stages.map((s, i) => (
            <div
              key={s.id}
              data-room-copy
              className="px-gutter absolute bottom-[14vh] left-0 max-w-[44rem]"
              aria-hidden={i > 0}
            >
              <p className="meta flex items-center gap-4 text-stone">
                <span className="text-bronze">{pad2(i + 1)}</span>
                <span className="h-px w-10 bg-stone/50" />
                {s.areaSqft ? `${s.areaSqft.toLocaleString("en-IN")} sq ft` : "—"}
                <span className="h-px w-10 bg-stone/50" />
                {s.detail}
              </p>
              <h3 className="font-display mt-6 text-[clamp(3.5rem,7vw,7.5rem)] uppercase">{s.room}</h3>
              <p className="font-serif mt-5 max-w-[30ch] text-[1.65rem] leading-snug italic text-stone">
                &ldquo;{s.description}&rdquo;
              </p>
            </div>
          ))}

          {/* Room index */}
          <ol
            aria-label="Rooms"
            className="absolute right-[var(--gutter)] top-1/2 flex -translate-y-1/2 flex-col gap-3 text-right"
          >
            {stages.map((s, i) => (
              <li
                key={s.id}
                data-tick
                {...(i === 0 ? { "data-active": "" } : {})}
                className="group meta flex items-center justify-end gap-3 text-[0.625rem] text-soft/35 transition-colors duration-500 data-[active]:text-soft"
              >
                {s.room.replace("The ", "")}
                <span className="h-px w-4 bg-current transition-all duration-500 group-data-[active]:w-10 group-data-[active]:bg-bronze" />
              </li>
            ))}
          </ol>

          <div className="px-gutter absolute inset-x-0 bottom-8 flex items-center gap-6">
            <span className="meta text-[0.6rem] text-stone">Entrance</span>
            <span className="relative h-px flex-1 bg-soft/15">
              <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-stone" />
            </span>
            <span className="meta text-[0.6rem] text-stone">View</span>
          </div>
        </div>
      </div>

      {/* Mobile & tablet: an editorial sequence */}
      <ol className="px-gutter flex flex-col gap-20 pb-28 lg:hidden lg:motion-reduce:grid lg:motion-reduce:grid-cols-2 lg:motion-reduce:gap-x-10">
        {stages.map((s, i) => (
          <li key={s.id}>
            <RevealImage image={s.image} sizes="100vw" variant={i % 2 ? "curtain" : "rise"} className="aspect-[4/5] sm:aspect-[16/10]" />
            <p className="meta mt-6 flex flex-wrap items-center gap-3 text-muted">
              <span className="text-bronze">{pad2(i + 1)}</span>
              {s.areaSqft && <span>{s.areaSqft.toLocaleString("en-IN")} sq ft</span>}
              <span>· {s.detail}</span>
            </p>
            <h3 className="font-display mt-3 text-[clamp(2.4rem,10vw,4rem)] uppercase">{s.room}</h3>
            <p className="font-serif mt-3 text-xl leading-snug italic text-charcoal/80">&ldquo;{s.description}&rdquo;</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
