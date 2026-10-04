"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Experience = {
  /** True once the intro loader has finished (or been skipped). */
  ready: boolean;
  markReady: () => void;
  reducedMotion: boolean;
};

const ExperienceContext = createContext<Experience>({
  ready: true,
  markReady: () => {},
  reducedMotion: false,
});

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const markReady = useCallback(() => setReady(true), []);

  return (
    <ExperienceContext.Provider value={{ ready, markReady, reducedMotion }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export const useExperience = () => useContext(ExperienceContext);
