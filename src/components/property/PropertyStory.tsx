"use client";

import { useRef } from "react";
import { TextLink } from "@/components/ui/Button";
import type { Property } from "@/data/types";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { formatINR, pad2 } from "@/lib/utils";
import { PropertyMedia } from "./PropertyMedia";

/**
 * A featured property told as an editorial story. On desktop the frame is
 * held in place while the photograph expands to full bleed and the details
 * arrive one by one: architecture, name, location, price, invitation.
 */
export function PropertyStory({
  property,
  index,
  total,
}: {
  property: Property;
  index: number;
  total: number;
}) {
  const root = useRef<HTMLElement>(null);
  const align = index % 2 === 0 ? "left" : "right";

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 },
        });
        tl.fromTo(
          q("[data-frame]"),
          { clipPath: align === "left" ? "inset(16% 46% 16% 8%)" : "inset(16% 8% 16% 46%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power2.inOut" },
        )
          .fromTo(q("[data-frame-inner]"), { scale: 1.25 }, { scale: 1, duration: 1.6 }, 0)
          // The caption gives way before the expanding frame reaches it.
          .to(q("[data-pre]"), { autoAlpha: 0, x: align === "left" ? 60 : -60, duration: 0.45, ease: "power2.in" }, 0.1)
          .fromTo(
            q("[data-detail]"),
            { autoAlpha: 0, x: align === "left" ? -30 : 30 },
            { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.12 },
            0.9,
          )
          // Animate the words inside their masks (not the masks themselves).
          .fromTo(q("[data-name-word]"), { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.08 }, 1.0)
          .fromTo(q("[data-info]"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.1 }, 1.2)
          .to({}, { duration: 0.5 });
      });

      mm.add(MQ.mobile, () => {
        gsap.fromTo(
          q("[data-frame]"),
          { clipPath: "inset(12% 12% 12% 12%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: q("[data-frame]")[0], start: "top 85%", once: true },
          },
        );
        gsap.from(q("[data-info], [data-detail]"), {
          autoAlpha: 0,
          y: 24,
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-copy]")[0], start: "top 88%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const price = `${formatINR(property.price)}${property.priceSuffix ? ` ${property.priceSuffix}` : ""}`;
  const words = property.name.split(" ");

  return (
    <article
      ref={root}
      aria-labelledby={`prop-${property.slug}`}
      data-nav="dark"
      className="relative bg-ink text-soft lg:h-[230vh] lg:motion-reduce:h-[100svh]"
    >
      <div className="relative lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden">
        {/* Pre-expansion caption, in the open column beside the framed window
            (the window spans 8%–54% of the width, so the caption starts at 60%). */}
        <div
          data-pre
          aria-hidden
          className={`pointer-events-none absolute inset-y-0 hidden w-[32%] flex-col justify-center lg:flex lg:motion-reduce:hidden ${
            align === "left" ? "left-[60%] items-start" : "right-[60%] items-end text-right"
          }`}
        >
          <span className="meta flex items-center gap-4 text-taupe">
            <span className="text-bronze">{pad2(index + 1)}</span>
            <span className="h-px w-10 bg-current opacity-50" />
            {pad2(total)}
          </span>
          <span className="meta mt-10 text-stone/70">
            {property.neighborhood}, {property.city}
          </span>
          <span className="font-display mt-4 text-[clamp(2.25rem,3.4vw,3.75rem)] leading-[0.95] text-soft">
            {property.name}
          </span>
          <span className="font-serif mt-6 max-w-[22ch] text-[clamp(1.1rem,1.4vw,1.4rem)] italic leading-snug text-stone/80">
            {property.tagline}
          </span>
          <span className="meta mt-10 flex items-center gap-3 text-[0.6rem] text-taupe">
            Scroll to enter <span className="h-px w-8 bg-current" />
          </span>
        </div>

        <div data-frame className="relative h-[72svh] w-full lg:absolute lg:inset-0 lg:h-full">
          <div data-frame-inner className="absolute inset-0">
            <PropertyMedia
              image={property.hero}
              coordinates={property.coordinates}
              sizes="100vw"
              className="h-full w-full"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/30" />
            </PropertyMedia>
          </div>
        </div>

        {/* Details */}
        <div
          data-copy
          className={`px-gutter relative flex flex-col gap-10 py-12 lg:pointer-events-none lg:absolute lg:inset-0 lg:justify-end lg:py-16 ${
            align === "right" ? "lg:items-end lg:text-right" : ""
          }`}
        >
          <ul
            className={`flex flex-wrap gap-x-6 gap-y-2 lg:absolute lg:top-28 ${align === "right" ? "lg:left-[var(--gutter)]" : "lg:right-[var(--gutter)]"}`}
          >
            {[property.type, property.status, property.architect && `Architect — ${property.architect}`]
              .filter(Boolean)
              .map((d) => (
                <li key={d as string} data-detail className="meta flex items-center gap-2 text-stone">
                  <span className="h-px w-4 bg-bronze" />
                  {d}
                </li>
              ))}
          </ul>

          <div className="lg:pointer-events-auto">
            <p data-info className="meta mb-5 text-stone">
              {pad2(index + 1)} — {property.neighborhood}, {property.city}
            </p>
            <h3
              id={`prop-${property.slug}`}
              data-name
              className="font-display text-[clamp(2.8rem,8.5vw,8.5rem)] uppercase"
            >
              {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <span data-name-word className="inline-block">
                    {w}&nbsp;
                  </span>
                </span>
              ))}
            </h3>
            <p data-info className="font-serif mt-4 max-w-xl text-[clamp(1.2rem,1.8vw,1.6rem)] italic text-stone">
              {property.tagline}
            </p>

            <dl
              data-info
              className={`mt-10 grid max-w-2xl grid-cols-2 gap-6 border-t border-soft/15 pt-6 sm:grid-cols-4 ${
                align === "right" ? "lg:ml-auto" : ""
              }`}
            >
              <Fact label="Price" value={price} />
              <Fact label="Residence" value={`${property.bedrooms} Bedroom`} />
              <Fact label="Interior" value={`${property.areaSqft.toLocaleString("en-IN")} sq ft`} />
              <Fact label="Location" value={property.city} />
            </dl>
            <div data-info className="mt-8">
              <TextLink href={`/properties/${property.slug}`} tone="dark" cursor="explore">
                Explore Residence
              </TextLink>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="meta text-[0.6rem] text-taupe">{label}</dt>
      <dd className="mt-2 text-[0.95rem] font-medium">{value}</dd>
    </div>
  );
}
