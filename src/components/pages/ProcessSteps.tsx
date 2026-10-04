import { SectionLabel } from "@/components/ui/Architectural";
import { RevealText } from "@/components/ui/RevealText";
import { cn } from "@/lib/utils";

/** A numbered process told as a drawing-sheet sequence. */
export function ProcessSteps({
  index,
  label,
  title,
  accent,
  steps,
  tone = "dark",
}: {
  index: string;
  label: string;
  title: string;
  accent: string;
  steps: { title: string; body: string }[];
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <section
      data-nav={dark ? "dark" : "light"}
      aria-labelledby={`process-${index}`}
      className={cn("relative py-28 md:py-40", dark ? "bg-charcoal text-soft" : "bg-soft text-ink")}
    >
      <div className="px-gutter">
        <SectionLabel index={index} tone={dark ? "dark" : "light"}>
          {label}
        </SectionLabel>
        <h2 id={`process-${index}`} className="font-display mt-10 max-w-4xl text-[clamp(2.75rem,6vw,6rem)]">
          <RevealText as="span" by="words" className="block">
            {title}
          </RevealText>
          <RevealText as="span" by="words" delay={0.1} className="accent block text-taupe">
            {accent}
          </RevealText>
        </h2>
      </div>
      <ol
        className={cn(
          "px-gutter mt-20 grid gap-px sm:grid-cols-2",
          steps.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        )}
      >
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={cn("group relative border-t pt-8 pb-10 sm:pr-8", dark ? "border-soft/15" : "border-ink/15")}
          >
            <span
              aria-hidden
              className="absolute -top-px left-0 h-px w-0 bg-bronze transition-[width] duration-1000 ease-[var(--ease-out-expo)] group-hover:w-full"
            />
            <span className="font-display text-[4.5rem] leading-none text-bronze/70">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="font-display mt-6 text-3xl">{s.title}</h3>
            <p className={cn("mt-3 max-w-xs text-[0.9rem] leading-[1.8]", dark ? "text-stone/75" : "text-muted")}>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
