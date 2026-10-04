"use client";

import { useRef } from "react";
import SplitType from "split-type";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

type Tag = "h1" | "h2" | "h3" | "p" | "blockquote" | "span" | "div";

type Props = {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  /** "lines" for editorial paragraphs, "words" for display headings. */
  by?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  start?: string;
  /** When provided, the reveal waits for this flag instead of scroll. */
  play?: boolean;
  id?: string;
};

/**
 * Editorial text reveal: SplitType breaks the copy into lines/words, each
 * rising out of its own mask. The real text stays in the DOM for screen
 * readers, and nothing is hidden when motion is reduced.
 */
export function RevealText({
  as: Tag = "p",
  children,
  className,
  by = "lines",
  delay = 0,
  stagger,
  start = "top 85%",
  play,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (play === false) return;
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        let split: SplitType | null = null;
        let tween: gsap.core.Tween | null = null;
        let done = false;
        let cancelled = false;

        const teardown = () => {
          tween?.scrollTrigger?.kill();
          tween?.kill();
          split?.revert();
          split = null;
          tween = null;
        };

        const build = () => {
          split = new SplitType(el, {
            types: by === "lines" ? "lines" : by === "words" ? "lines,words" : "lines,words,chars",
            tagName: "span",
          });
          split.lines?.forEach((line) => {
            const mask = document.createElement("span");
            mask.className = "split-line block";
            line.parentNode?.insertBefore(mask, line);
            mask.appendChild(line);
            line.style.display = "block";
          });
          const targets = by === "lines" ? split.lines : by === "words" ? split.words : split.chars;
          tween = gsap.from(targets ?? [], {
            yPercent: 110,
            rotate: by === "lines" ? 0 : 2,
            duration: by === "chars" ? 1 : 1.3,
            ease: "expo.out",
            delay,
            stagger: stagger ?? (by === "lines" ? 0.09 : by === "words" ? 0.05 : 0.02),
            scrollTrigger: play === undefined ? { trigger: el, start, once: true } : undefined,
            // Once revealed, restore the original markup so text reflows naturally.
            onComplete: () => {
              done = true;
              teardown();
            },
          });
        };

        document.fonts.ready.then(() => !cancelled && build());

        // Line breaks depend on width: rebuild if the layout changes before the reveal.
        let lastWidth = window.innerWidth;
        const onResize = () => {
          if (done || !split || window.innerWidth === lastWidth) return;
          lastWidth = window.innerWidth;
          teardown();
          build();
        };
        window.addEventListener("resize", onResize);

        return () => {
          cancelled = true;
          window.removeEventListener("resize", onResize);
          teardown();
        };
      });
      return () => mm.revert();
    },
    { dependencies: [play], scope: ref },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} id={id}>
      {children}
    </Tag>
  );
}
