"use client";

import Image from "next/image";
import { useRef } from "react";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { Annotation } from "@/components/ui/Architectural";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { formatCoord } from "@/lib/utils";

/**
 * Section 1 — "A Place Worth Discovering"
 *
 * A virtual camera built from four photographic layers. Scroll drives the
 * camera from the city, toward the building, through the entrance and into
 * the interior; each threshold is a different architectural mask.
 */
const SHOTS = [
  { id: "city", label: "The City", src: media.skylineSunset, alt: "City skyline at sunset" },
  { id: "architecture", label: "The Architecture", src: media.villaDuskTrees, alt: "Modern timber and glass residence among trees at dusk" },
  { id: "entrance", label: "The Entrance", src: media.entranceTimber, alt: "Timber-clad entrance of a contemporary home" },
  { id: "interior", label: "The Interior", src: media.livingOpenStairs, alt: "Open-plan living room with a sculptural staircase" },
];

const CHAPTERS = [
  { eyebrow: "02 — Architecture", title: ["Form,", "shaped by light."] },
  { eyebrow: "03 — Arrival", title: ["Every threshold", "is a promise."] },
  { eyebrow: "04 — Interior", title: ["Now,", "step inside."] },
];

export function Hero() {
  const { ready } = useExperience();
  const root = useRef<HTMLElement>(null);

  // Camera intro + scroll choreography.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const layers = q("[data-shot]");
      const imgs = q("[data-shot] [data-cam]");
      const mm = gsap.matchMedia();

      mm.add(MQ.reduced, () => {
        gsap.set(layers[0], { clipPath: "inset(0% 0% 0% 0%)" });
      });

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };

        // Masks for each threshold. Every clip-path tween is an explicit fromTo with
        // four-value insets: browsers shorten computed values (e.g. "inset(50%)"),
        // and GSAP can only interpolate strings whose numbers line up.
        const FULL = "inset(0% 0% 0% 0%)";
        gsap.set(layers[1], { clipPath: "inset(50% 50% 50% 50%)" });
        gsap.set(layers[2], { clipPath: "inset(0% 50% 0% 50%)" });
        gsap.set(layers[3], { clipPath: "circle(0% at 50% 58%)" });
        gsap.set(q("[data-chapter]"), { autoAlpha: 0, y: 40 });

        const tl: gsap.core.Timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: desktop ? "+=360%" : "+=240%",
            pin: true,
            scrub: desktop ? 1.2 : 0.8,
            anticipatePin: 1,
          },
          // Follows the smoothed scrub so the rail matches the shot on screen.
          onUpdate: () => {
            const t = tl.time();
            const stage = t >= 7.6 ? 3 : t >= 5 ? 2 : t >= 2.2 ? 1 : 0;
            q("[data-rail-item]").forEach((el, i) => el.toggleAttribute("data-active", i === stage));
            gsap.set(q("[data-rail-fill]"), { scaleY: tl.progress() });
          },
        });

        // Stage 1 → 2: the camera pushes in on the city; the intro gives way.
        tl.to(imgs[0], { scale: 1.32, duration: 2.4 }, 0)
          .to(q("[data-intro]"), { autoAlpha: 0, y: -80, duration: 1.2 }, 0.3)
          .to(q("[data-scroll-cue]"), { autoAlpha: 0, duration: 0.4 }, 0)
          // Stage 2: the architecture emerges through a window in the skyline.
          .fromTo(
            layers[1],
            { clipPath: "inset(50% 50% 50% 50%)" },
            { clipPath: "inset(30% 36% 30% 36%)", duration: 0.7, ease: "power2.out" },
            0.9,
          )
          .fromTo(
            layers[1],
            { clipPath: "inset(30% 36% 30% 36%)" },
            { clipPath: FULL, duration: 1.5, ease: "power2.inOut", immediateRender: false },
            1.6,
          )
          .fromTo(imgs[1], { scale: 1.45 }, { scale: 1.08, duration: 2.2 }, 1.4)
          .to(q("[data-chapter='0']"), { autoAlpha: 1, y: 0, duration: 0.7 }, 2.6)
          // Stage 3: approach the entrance — the doors part.
          .to(imgs[1], { scale: 1.3, duration: 1.4 }, 3.6)
          .to(q("[data-chapter='0']"), { autoAlpha: 0, y: -40, duration: 0.6 }, 4.0)
          .fromTo(
            layers[2],
            { clipPath: "inset(0% 50% 0% 50%)" },
            { clipPath: FULL, duration: 1.6, ease: "power3.inOut", immediateRender: false },
            4.4,
          )
          .fromTo(imgs[2], { scale: 1.35 }, { scale: 1.04, duration: 2 }, 4.4)
          .to(q("[data-chapter='1']"), { autoAlpha: 1, y: 0, duration: 0.7 }, 5.4)
          // Stage 4: the interior opens like light through an aperture.
          .to(imgs[2], { scale: 1.22, duration: 1.4 }, 6.4)
          .to(q("[data-chapter='1']"), { autoAlpha: 0, y: -40, duration: 0.6 }, 6.6)
          .fromTo(
            layers[3],
            { clipPath: "circle(0% at 50% 58%)" },
            { clipPath: "circle(80% at 50% 58%)", duration: 1.8, ease: "power2.inOut", immediateRender: false },
            7,
          )
          .fromTo(imgs[3], { scale: 1.3 }, { scale: 1, duration: 2.4 }, 7)
          .to(q("[data-chapter='2']"), { autoAlpha: 1, y: 0, duration: 0.7 }, 8.2)
          .to({}, { duration: 0.8 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // Opening shot, played once the loader hands over.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const frame = q("[data-frame]");
        if (!ready) {
          gsap.set(frame, { clipPath: "inset(50% 50% 50% 50%)" });
          gsap.set(q("[data-fade]"), { autoAlpha: 0, y: 24 });
          gsap.set(q("[data-hline]"), { scaleX: 0 });
          return;
        }
        const tl = gsap.timeline();
        tl.to(q("[data-hline]"), { scaleX: 1, duration: 0.9, ease: "expo.inOut" })
          .to(q("[data-hline]"), { autoAlpha: 0, duration: 0.3 })
          .fromTo(
            frame,
            { clipPath: "inset(49.85% 20% 49.85% 20%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", immediateRender: false },
            "<",
          )
          .fromTo(q("[data-intro-cam]"), { scale: 1.35 }, { scale: 1, duration: 3.2, ease: "expo.out" }, "<")
          .to(q("[data-fade]"), { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }, "-=2.2");
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section
      ref={root}
      id="top"
      data-nav="dark"
      aria-label="Introduction"
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-soft"
    >
      {/* Opening frame: a single line that opens into the city */}
      <div data-frame className="absolute inset-0">
        <div data-intro-cam className="absolute inset-0">
          {SHOTS.map((shot, i) => (
            <div
              key={shot.id}
              data-shot
              className="absolute inset-0 overflow-hidden"
              style={i > 0 ? { clipPath: i === 3 ? "circle(0% at 50% 58%)" : "inset(50% 50% 50% 50%)" } : undefined}
              aria-hidden={i > 0}
            >
              <div data-cam className="absolute inset-0 will-change-transform">
                <Image
                  src={shot.src}
                  alt={i === 0 ? shot.alt : ""}
                  fill
                  preload={i === 0}
                  sizes="100vw"
                  quality={75}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Cinematic grade for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/10 to-ink/75" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(13,13,13,0.55),transparent_60%)]" />
      </div>

      <span
        data-hline
        aria-hidden
        className="absolute left-[20%] right-[20%] top-1/2 h-px origin-center bg-stone"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Intro copy */}
      <div data-intro className="px-gutter absolute inset-x-0 bottom-0 pb-[max(4.5rem,9vh)]">
        <p data-fade className="eyebrow mb-6 flex items-center gap-4 text-stone">
          <span className="h-px w-10 bg-bronze" />
          The space reveals itself
        </p>
        <RevealText
          as="h1"
          by="words"
          play={ready}
          delay={0.9}
          className="font-display max-w-[14ch] text-[clamp(3.1rem,9.4vw,9.75rem)]"
        >
          Find a place <br />
          that feels like <span className="accent text-stone">yours.</span>
        </RevealText>
        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p data-fade className="max-w-sm text-[0.95rem] leading-relaxed text-stone/90">
            Exceptional properties. Distinctive architecture. Thoughtfully selected spaces.
          </p>
          <div data-fade className="flex flex-wrap items-center gap-3">
            <Button href="#properties" tone="dark" variant="solid">
              Explore Properties
            </Button>
            <Button href="#location" tone="dark" variant="outline" arrow={false}>
              View Locations
            </Button>
          </div>
        </div>
      </div>

      {/* Camera chapters */}
      {CHAPTERS.map((c, i) => (
        <div
          key={c.eyebrow}
          data-chapter={i}
          aria-hidden
          className="px-gutter pointer-events-none absolute inset-x-0 bottom-0 pb-[max(4.5rem,10vh)] opacity-0"
        >
          <p className="eyebrow mb-5 text-stone">{c.eyebrow}</p>
          <p className="font-display text-[clamp(2.75rem,8vw,8rem)]">
            {c.title[0]}
            <br />
            <span className="accent text-stone">{c.title[1]}</span>
          </p>
        </div>
      ))}

      {/* Stage rail */}
      <ol
        aria-hidden
        className="pointer-events-none absolute right-[var(--gutter)] top-1/2 hidden -translate-y-1/2 flex-col gap-5 md:flex"
      >
        <span className="absolute -left-5 top-0 h-full w-px bg-soft/20">
          <span data-rail-fill className="absolute inset-0 origin-top scale-y-0 bg-bronze" />
        </span>
        {SHOTS.map((s, i) => (
          <li
            key={s.id}
            data-rail-item
            {...(i === 0 ? { "data-active": "" } : {})}
            className="meta text-[0.625rem] text-soft/40 transition-colors duration-500 data-[active]:text-soft"
          >
            0{i + 1} {s.label}
          </li>
        ))}
      </ol>

      <Annotation className="left-[var(--gutter)] top-28 hidden text-stone md:flex" line="right">
        {formatCoord(site.coordinates.lat, "lat")} · {formatCoord(site.coordinates.lng, "lng")}
      </Annotation>
      <Annotation className="right-[var(--gutter)] top-28 hidden text-stone md:flex" line="left">
        Golden hour · 18:42 IST
      </Annotation>

      <div
        data-scroll-cue
        aria-hidden
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-stone md:flex"
      >
        <span className="meta text-[0.6rem]">Scroll to enter</span>
        <span className="relative h-10 w-px overflow-hidden bg-soft/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.77,0,0.175,1)_infinite] bg-soft" />
        </span>
      </div>
    </section>
  );
}
