import Link from "next/link";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

type Variant = "solid" | "outline" | "ghost";
type Tone = "light" | "dark";

type Props = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  tone?: Tone;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
  disabled?: boolean;
  cursor?: string;
  "aria-label"?: string;
};

/**
 * The single CTA primitive. Arrow slides on hover, border reacts, text shifts.
 * `tone` describes the background the button sits on.
 */
export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "solid",
  tone = "light",
  arrow = true,
  magnetic = true,
  className,
  disabled,
  cursor = "open",
  ...rest
}: Props) {
  const styles = cn(
    "group relative inline-flex min-h-12 items-center gap-4 overflow-hidden rounded-full px-7 py-3.5 text-[0.8125rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-500 ease-[var(--ease-out-expo)] disabled:pointer-events-none disabled:opacity-40",
    variant === "solid" && tone === "light" && "bg-ink text-soft hover:bg-charcoal",
    variant === "solid" && tone === "dark" && "bg-soft text-ink hover:bg-ivory",
    variant === "outline" && tone === "light" && "border border-ink/25 text-ink hover:border-ink",
    variant === "outline" && tone === "dark" && "border border-soft/35 text-soft hover:border-soft",
    variant === "ghost" && tone === "light" && "px-0 text-ink",
    variant === "ghost" && tone === "dark" && "px-0 text-soft",
    className,
  );

  const inner = (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {arrow && <Arrow />}
    </>
  );

  const el = href ? (
    <Link href={href} className={styles} data-cursor={cursor} aria-label={rest["aria-label"]}>
      {inner}
    </Link>
  ) : (
    <button
      type={type}
      onClick={onClick}
      className={styles}
      disabled={disabled}
      data-cursor={cursor}
      aria-label={rest["aria-label"]}
    >
      {inner}
    </button>
  );

  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

export function Arrow({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-flex h-3 w-5 overflow-hidden", className)}>
      <svg
        viewBox="0 0 20 12"
        className="absolute inset-0 h-3 w-5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-[140%]"
      >
        <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <svg
        viewBox="0 0 20 12"
        className="absolute inset-0 h-3 w-5 -translate-x-[140%] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0"
      >
        <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </span>
  );
}

/** Underlined editorial text link, e.g. "Explore Residence →" */
export function TextLink({
  href,
  children,
  tone = "light",
  cursor = "open",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: Tone;
  cursor?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      data-cursor={cursor}
      className={cn(
        "group inline-flex items-center gap-3 py-2 text-[0.8125rem] font-semibold tracking-[0.08em] uppercase",
        tone === "dark" ? "text-soft" : "text-ink",
        className,
      )}
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-current transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-0" />
      </span>
      <Arrow />
    </Link>
  );
}
