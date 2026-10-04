import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Wordmark with a small plan-and-elevation monogram. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <svg viewBox="0 0 28 28" className="h-7 w-7" aria-hidden>
        <rect x="0.75" y="0.75" width="26.5" height="26.5" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M6 22 V11 L14 5 L22 11 V22" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M11.5 22 V15 H16.5 V22" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M2 22 H26" stroke="#A8875A" strokeWidth="1" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.35rem] tracking-[0.02em]">{site.shortName}</span>
        <span className="mt-0.5 text-[0.5rem] font-semibold tracking-[0.42em] uppercase opacity-70">Estates</span>
      </span>
    </span>
  );
}
