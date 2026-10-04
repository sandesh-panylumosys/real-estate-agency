"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/**
 * Lenis drives scrolling; GSAP's ticker drives Lenis so ScrollTrigger and the
 * scroll position never drift apart. Scroll velocity is exposed as the CSS
 * variable --sv (-1…1) so architectural elements can respond to momentum
 * without each component subscribing to scroll events.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum feels better on touch devices.
      syncTouch: false,
    });

    const root = document.documentElement;
    let sv = 0;
    instance.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      const target = gsap.utils.clamp(-1, 1, e.velocity / 40);
      sv += (target - sv) * 0.2;
      root.style.setProperty("--sv", sv.toFixed(3));
    });

    const tick = (time: number) => instance.raf(time * 1000);
    // Images and fonts change layout after first paint; re-measure triggers.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Settle velocity back to rest when scrolling stops.
    const settle = window.setInterval(() => {
      if (Math.abs(instance.velocity) < 0.01 && Math.abs(sv) > 0.001) {
        sv *= 0.6;
        root.style.setProperty("--sv", sv.toFixed(3));
      }
    }, 120);

    const raf = requestAnimationFrame(() => setLenis(instance));
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(settle);
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // In-page anchor links scroll smoothly through Lenis.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[href*='#']");
      if (!a) return;
      const url = new URL(a.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6, force: true });
      else target.scrollIntoView();
      history.replaceState(null, "", url.hash);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
