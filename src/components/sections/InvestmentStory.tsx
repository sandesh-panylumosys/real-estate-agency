"use client";

import { useRef } from "react";
import { SectionLabel } from "@/components/ui/Architectural";
import { CountUp } from "@/components/ui/CountUp";
import { RevealText } from "@/components/ui/RevealText";
import type { InvestmentStory as InvestmentData } from "@/data/types";
import { gsap, MQ, useGSAP } from "@/lib/gsap";

const W = 1000;
const H = 420;
const PAD = { l: 10, r: 60, t: 30, b: 40 };

/** Section 9 — "Beyond The Property". Editorial, not a dashboard. */
export function InvestmentStory({ data, index = "09" }: { data: InvestmentData; index?: string }) {
  const root = useRef<HTMLElement>(null);
  const s = data.series;
  const min = 80;
  const max = Math.ceil(Math.max(...s.map((d) => d.value)) / 20) * 20 + 20;
  const x = (i: number) => PAD.l + (i / (s.length - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);
  const line = s.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(s.length - 1)} ${H - PAD.b} L${x(0)} ${H - PAD.b} Z`;
  const last = s[s.length - 1];
  const growth = Math.round(last.value - s[0].value);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const path = q("[data-line]")[0] as unknown as SVGPathElement;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: q("[data-chart]")[0], start: "top 70%", end: "bottom 60%", scrub: 1 },
        });
        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 })
          .from(q("[data-area]"), { opacity: 0, duration: 0.6 }, 0.3)
          .from(q("[data-end]"), { scale: 0, opacity: 0, duration: 0.2, transformOrigin: "center" }, 0.9)
          .from(q("[data-callout]"), { opacity: 0, y: 10, duration: 0.2 }, 0.9);
        gsap.from(q("[data-infra]"), {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-infra-list]")[0], start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="investment"
      data-nav="light"
      aria-labelledby="invest-title"
      className="relative py-28 text-ink md:py-40"
      style={{ backgroundColor: "#E9E3D9" }}
    >
      <div className="px-gutter grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel index={index}>The Investment</SectionLabel>
          <h2 id="invest-title" className="font-display mt-10 text-[clamp(2.75rem,7vw,7rem)]">
            <RevealText as="span" by="words" className="block">
              Beyond
            </RevealText>
            <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
              the property.
            </RevealText>
          </h2>
        </div>
        <div className="flex items-end lg:col-span-4 lg:col-start-9">
          <RevealText className="text-[0.95rem] leading-[1.8] text-muted">
            A home is also a position in a city that is still being built. We look at what&apos;s changing around
            it — the infrastructure, the scarcity, the demand — and explain it plainly.
          </RevealText>
        </div>
      </div>

      <dl className="px-gutter mt-20 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {data.metrics.map((m) => (
          <div key={m.label} className="border-t border-ink/15 pt-6 sm:pr-8">
            <dt className="meta text-muted">{m.label}</dt>
            <dd>
              <span className="font-display mt-4 block text-[clamp(3rem,5.5vw,5.25rem)] leading-none">
                <CountUp value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
              </span>
              <span className="mt-3 block max-w-[24ch] text-[0.8rem] leading-relaxed text-muted">{m.note}</span>
            </dd>
          </div>
        ))}
      </dl>

      <figure data-chart className="px-gutter mt-24">
        <figcaption className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <span className="font-serif max-w-xl text-[clamp(1.5rem,2.4vw,2.2rem)] leading-tight">
            Prime residential capital values have more than doubled in a decade.
          </span>
          <span className="meta text-muted">Index · 2016 = 100</span>
        </figcaption>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="img" aria-label={`Capital value index rising from 100 in ${s[0].year} to ${last.value} in ${last.year}`}>
          <defs>
            <linearGradient id="inv-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#A8875A" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#A8875A" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[100, 150, 200].map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="#171717" strokeOpacity="0.1" />
              <text x={W - PAD.r + 12} y={y(v) + 4} fill="#77736D" className="text-[12px] max-md:text-[22px]" style={{ letterSpacing: "0.1em" }}>
                {v}
              </text>
            </g>
          ))}
          <path data-area d={area} fill="url(#inv-area)" />
          <path data-line d={line} fill="none" stroke="#171717" strokeWidth="1.6" />
          {s.map((d, i) =>
            i % 2 === 0 || i === s.length - 1 ? (
              <text key={d.year} x={x(i)} y={H - 10} textAnchor="middle" fill="#77736D" className="text-[12px] max-md:text-[22px]" style={{ letterSpacing: "0.12em" }}>
                {d.year}
              </text>
            ) : null,
          )}
          <g data-end transform={`translate(${x(s.length - 1)} ${y(last.value)})`}>
            <circle r="10" fill="#A8875A" opacity="0.25" />
            <circle r="4" fill="#A8875A" />
          </g>
          <g data-callout transform={`translate(${x(s.length - 1) - 16} ${y(last.value) - 22})`}>
            <text textAnchor="end" fill="#171717" className="text-[15px] max-md:text-[26px]" style={{ letterSpacing: "0.06em" }}>
              +{growth}% since {s[0].year}
            </text>
          </g>
        </svg>
      </figure>

      <div className="px-gutter mt-24">
        <p className="meta mb-8 text-muted">Infrastructure shaping the neighbourhood</p>
        <ol data-infra-list className="grid gap-px overflow-hidden border-y border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {data.infrastructure.map((it) => (
            <li key={it.title} data-infra className="bg-[#E9E3D9] py-8 sm:px-6 first:sm:pl-0">
              <span className="meta text-bronze">{it.year}</span>
              <p className="font-display mt-3 text-3xl">{it.title}</p>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-muted">{it.detail}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl text-[0.7rem] leading-relaxed text-muted">
          Figures are indicative and shown for illustration only. Past performance is not a guide to future returns.
          This is not financial advice; speak to an independent advisor before investing.
        </p>
      </div>
    </section>
  );
}
