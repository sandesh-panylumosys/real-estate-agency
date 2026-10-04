"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

/** Animated figure that counts up once when scrolled into view. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const obj = { n: 0 };
      const el = ref.current!;
      el.textContent = format(0);
      gsap.to(obj, {
        n: value,
        duration: 2.4,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate: () => (el.textContent = format(obj.n)),
      });
      return () => (el.textContent = format(value));
    });
    return () => mm.revert();
  });

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
