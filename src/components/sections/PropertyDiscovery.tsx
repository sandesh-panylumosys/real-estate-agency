"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useId, useMemo, useState } from "react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { SectionLabel } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";
import type { Property, PropertyType, Purpose } from "@/data/types";
import { cn, formatINR } from "@/lib/utils";

const TYPES: PropertyType[] = ["Apartment", "Villa", "Penthouse", "Plot", "Commercial", "Farmhouse"];
const PURPOSES: Purpose[] = ["Buy", "Rent", "Invest"];
const BEDS = ["Any", "1", "2", "3", "4+"] as const;

/** Filters other components can apply, via `?type=&city=&purpose=` or the DISCOVER_EVENT. */
export type DiscoverFilter = { type?: PropertyType; city?: string; purpose?: Purpose };
export const DISCOVER_EVENT = "discover:filter";

// Budget stops differ for sale and rent.
const SALE_STOPS = [50_00_000, 1_00_00_000, 2_00_00_000, 3_00_00_000, 5_00_00_000, 7_50_00_000, 10_00_00_000, 20_00_00_000];
const RENT_STOPS = [50_000, 1_00_000, 2_00_000, 3_50_000, 5_00_000, 7_50_000, 10_00_000];

/** Section 8 — "What Are You Looking For?" */
export function PropertyDiscovery({ properties, index = "08" }: { properties: Property[]; index?: string }) {
  const uid = useId();
  const [purpose, setPurpose] = useState<Purpose>("Buy");
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [city, setCity] = useState<string>("All");
  const [neighborhood, setNeighborhood] = useState<string>("All");
  const [beds, setBeds] = useState<(typeof BEDS)[number]>("Any");
  const stops = purpose === "Rent" ? RENT_STOPS : SALE_STOPS;
  const [budgetIdx, setBudgetIdx] = useState(SALE_STOPS.length - 1);
  const maxBudget = stops[Math.min(budgetIdx, stops.length - 1)];

  // Accept filters from the URL (e.g. /properties?city=Goa) and from other sections.
  useEffect(() => {
    const apply = (f: DiscoverFilter) => {
      if (f.purpose && PURPOSES.includes(f.purpose)) setPurpose(f.purpose);
      if (f.type && TYPES.includes(f.type)) setTypes([f.type]);
      if (f.city) {
        setCity(f.city);
        setNeighborhood("All");
      }
    };
    const params = new URLSearchParams(window.location.search);
    const fromUrl: DiscoverFilter = {
      type: (params.get("type") as PropertyType) ?? undefined,
      city: params.get("city") ?? undefined,
      purpose: (params.get("purpose") as Purpose) ?? undefined,
    };
    const raf = requestAnimationFrame(() => {
      if (fromUrl.type || fromUrl.city || fromUrl.purpose) apply(fromUrl);
    });
    const onEvent = (e: Event) => apply((e as CustomEvent<DiscoverFilter>).detail);
    window.addEventListener(DISCOVER_EVENT, onEvent);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(DISCOVER_EVENT, onEvent);
    };
  }, []);

  const cities = useMemo(() => ["All", ...Array.from(new Set(properties.map((p) => p.city)))], [properties]);
  const neighborhoods = useMemo(
    () => ["All", ...new Set(properties.filter((p) => city === "All" || p.city === city).map((p) => p.neighborhood))],
    [properties, city],
  );

  const results = useMemo(
    () =>
      properties.filter((p) => {
        if (!p.purpose.includes(purpose)) return false;
        // Monthly-priced listings only appear when renting.
        const isMonthly = !!p.priceSuffix;
        if (purpose !== "Rent" && isMonthly) return false;
        if (types.length && !types.includes(p.type)) return false;
        if (city !== "All" && p.city !== city) return false;
        if (neighborhood !== "All" && p.neighborhood !== neighborhood) return false;
        if (beds !== "Any") {
          if (beds === "4+" ? p.bedrooms < 4 : p.bedrooms !== Number(beds)) return false;
        }
        const limited = budgetIdx < stops.length - 1;
        if (limited && (purpose !== "Rent" || isMonthly) && p.price > maxBudget) return false;
        return true;
      }),
    [properties, purpose, types, city, neighborhood, beds, budgetIdx, maxBudget, stops.length],
  );

  const toggleType = (t: PropertyType) =>
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const reset = () => {
    setTypes([]);
    setCity("All");
    setNeighborhood("All");
    setBeds("Any");
    setBudgetIdx(stops.length - 1);
  };

  return (
    <section
      id="discover"
      data-nav="light"
      aria-labelledby="discover-title"
      className="relative bg-soft py-28 text-ink md:py-40"
    >
      <div className="px-gutter grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index={index}>Property Discovery</SectionLabel>
          <h2 id="discover-title" className="font-display mt-10 text-[clamp(2.75rem,7vw,7rem)]">
            <RevealText as="span" by="words" className="block">
              What are you
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              looking for?
            </RevealText>
          </h2>
        </div>
      </div>

      {/* Controls, phrased as a sentence rather than a filter sidebar */}
      <form
        className="px-gutter mt-16 md:mt-20"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Search properties"
      >
        <div className="grid gap-x-10 gap-y-10 border-t border-ink/10 pt-10 lg:grid-cols-12">
          <Field label="I would like to" className="lg:col-span-3">
            <div role="radiogroup" aria-label="Purpose" className="relative flex rounded-full border border-ink/15 p-1">
              {PURPOSES.map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={purpose === p}
                  onClick={() => {
                    setPurpose(p);
                    setBudgetIdx((p === "Rent" ? RENT_STOPS : SALE_STOPS).length - 1);
                  }}
                  className="relative z-10 min-h-10 flex-1 rounded-full text-[0.75rem] font-semibold tracking-[0.12em] uppercase"
                >
                  {purpose === p && (
                    <motion.span
                      layoutId={`${uid}-purpose`}
                      className="absolute inset-0 -z-10 rounded-full bg-ink"
                      transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className={cn("transition-colors duration-300", purpose === p ? "text-soft" : "text-ink")}>{p}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="A" className="lg:col-span-5">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Property type">
              {TYPES.map((t) => {
                const on = types.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleType(t)}
                    className={cn(
                      "group/t inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-[0.8rem] transition-all duration-500",
                      on ? "border-ink bg-ink text-soft" : "border-ink/15 hover:border-ink/50",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        on ? "bg-bronze" : "bg-ink/20 group-hover/t:bg-ink/50",
                      )}
                    />
                    {t}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="With" className="lg:col-span-4">
            <div className="flex gap-2" role="radiogroup" aria-label="Bedrooms">
              {BEDS.map((b) => (
                <button
                  key={b}
                  type="button"
                  role="radio"
                  aria-checked={beds === b}
                  onClick={() => setBeds(b)}
                  className={cn(
                    "min-h-10 min-w-11 flex-1 rounded-full border text-[0.8rem] transition-colors duration-500",
                    beds === b ? "border-ink bg-ink text-soft" : "border-ink/15 hover:border-ink/50",
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
            <p className="meta mt-2 text-[0.6rem] text-muted">Bedrooms</p>
          </Field>

          <Field label="In" htmlFor={`${uid}-city`} className="lg:col-span-3">
            <Select id={`${uid}-city`} value={city} onChange={(v) => { setCity(v); setNeighborhood("All"); }} options={cities} allLabel="Any city" />
          </Field>
          <Field label="Neighbourhood" htmlFor={`${uid}-hood`} className="lg:col-span-3">
            <Select id={`${uid}-hood`} value={neighborhood} onChange={setNeighborhood} options={neighborhoods} allLabel="Any neighbourhood" />
          </Field>

          <Field label="Up to" htmlFor={`${uid}-budget`} className="lg:col-span-6">
            <div className="flex items-center gap-6">
              <input
                id={`${uid}-budget`}
                type="range"
                min={0}
                max={stops.length - 1}
                step={1}
                value={Math.min(budgetIdx, stops.length - 1)}
                onChange={(e) => setBudgetIdx(Number(e.target.value))}
                aria-valuetext={budgetIdx >= stops.length - 1 ? "No limit" : formatINR(maxBudget)}
                className="h-11 flex-1 cursor-pointer appearance-none bg-transparent accent-[#A8875A] [&::-webkit-slider-runnable-track]:h-px [&::-webkit-slider-runnable-track]:bg-ink/25 [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:h-[15px] [&::-webkit-slider-thumb]:w-[15px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-soft"
              />
              <output htmlFor={`${uid}-budget`} className="font-display w-36 text-right text-3xl tabular-nums">
                {budgetIdx >= stops.length - 1 ? "Any" : formatINR(maxBudget)}
                {purpose === "Rent" && budgetIdx < stops.length - 1 && <span className="meta ml-1 text-[0.6rem] text-muted">/mo</span>}
              </output>
            </div>
          </Field>
        </div>
      </form>

      <div className="px-gutter mt-16 flex items-baseline justify-between border-b border-ink/10 pb-4" aria-live="polite">
        <p className="meta text-muted">
          <span className="font-display mr-2 text-2xl tracking-normal text-ink normal-case">{results.length}</span>
          {results.length === 1 ? "residence" : "residences"} found
        </p>
        <button type="button" onClick={reset} className="meta min-h-11 text-muted underline-offset-4 hover:text-ink hover:underline">
          Clear selection
        </button>
      </div>

      {/* Cinematic results: an asymmetric editorial gallery */}
      <LayoutGroup>
        <motion.ul layout className="px-gutter mt-14 grid gap-x-8 gap-y-20 md:grid-cols-12">
          <AnimatePresence mode="popLayout">
            {results.map((p, i) => {
              const pattern = i % 4;
              const span =
                pattern === 0
                  ? "md:col-span-7"
                  : pattern === 1
                    ? "md:col-span-4 md:col-start-9 md:mt-32"
                    : pattern === 2
                      ? "md:col-span-5 md:col-start-2"
                      : "md:col-span-6 md:col-start-7 md:-mt-20";
              return (
                <motion.li
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 60, clipPath: "inset(20% 0% 0% 0%)" }}
                  animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 6) * 0.05 }}
                  className={span}
                >
                  <PropertyCard property={p} size={pattern === 0 || pattern === 3 ? "lg" : "md"} />
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      {results.length === 0 && (
        <div className="px-gutter py-24 text-center">
          <p className="font-display text-4xl">Nothing quite matches — yet.</p>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Many of our residences are offered privately. Tell an advisor what you&apos;re looking for.
          </p>
          <a href="#enquire" className="meta mt-8 inline-block border-b border-ink pb-1">
            Talk to an advisor
          </a>
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = htmlFor ? "label" : "div";
  return (
    <div className={className}>
      <Tag {...(htmlFor ? { htmlFor } : {})} className="font-serif mb-4 block text-2xl italic text-muted">
        {label}
      </Tag>
      {children}
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  allLabel,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-display h-12 w-full appearance-none border-b border-ink/25 bg-transparent pr-8 text-[1.75rem] outline-none transition-colors focus:border-ink"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "All" ? allLabel : o}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 12 8" className="pointer-events-none absolute right-1 top-1/2 h-2 w-3 -translate-y-1/2">
        <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
