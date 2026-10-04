import { cn } from "@/lib/utils";

/**
 * Floating architectural annotations — the site's alternative to particles.
 * They drift with scroll momentum via the --sv variable (see .drift in CSS).
 */
export function Annotation({
  children,
  className,
  axis = "y",
  line = "left",
}: {
  children: React.ReactNode;
  className?: string;
  axis?: "x" | "y";
  line?: "left" | "right" | "none";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute flex items-center gap-3 meta text-[0.625rem] opacity-60",
        axis === "y" ? "drift" : "drift-x",
        className,
      )}
    >
      {line === "left" && <span className="h-px w-10 bg-current opacity-60" />}
      <span className="whitespace-nowrap">{children}</span>
      {line === "right" && <span className="h-px w-10 bg-current opacity-60" />}
    </div>
  );
}

/** A dimension line: |←— 12.40 m —→| */
export function Dimension({ label, className }: { label: string; className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none flex items-center gap-2 meta text-[0.625rem]", className)}>
      <span className="h-2.5 w-px bg-current" />
      <span className="h-px flex-1 bg-current opacity-50" />
      <span className="whitespace-nowrap px-1">{label}</span>
      <span className="h-px flex-1 bg-current opacity-50" />
      <span className="h-2.5 w-px bg-current" />
    </div>
  );
}

/** Corner registration marks, as on a drawing sheet. */
export function CornerMarks({ className }: { className?: string }) {
  const m = "absolute h-3 w-3 border-current";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(m, "left-0 top-0 border-l border-t")} />
      <span className={cn(m, "right-0 top-0 border-r border-t")} />
      <span className={cn(m, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(m, "bottom-0 right-0 border-b border-r")} />
    </div>
  );
}

export function SectionLabel({
  index,
  children,
  tone = "light",
  className,
}: {
  index: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4 eyebrow", tone === "dark" ? "text-stone" : "text-muted", className)}>
      <span className="text-bronze">{index}</span>
      <span className="h-px w-12 bg-current opacity-40" />
      <span>{children}</span>
    </div>
  );
}
