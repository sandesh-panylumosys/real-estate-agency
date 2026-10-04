import Link from "next/link";
import type { Property } from "@/data/types";
import { cn, formatINR } from "@/lib/utils";
import { Arrow } from "@/components/ui/Button";
import { PropertyMedia } from "./PropertyMedia";

/** Editorial property card used in discovery results and related listings. */
export function PropertyCard({
  property,
  size = "md",
  className,
}: {
  property: Property;
  size?: "lg" | "md";
  className?: string;
}) {
  const price = `${formatINR(property.price)}${property.priceSuffix ? ` ${property.priceSuffix}` : ""}`;
  const facts = [
    property.bedrooms > 0 ? `${property.bedrooms} Bed` : null,
    `${property.areaSqft.toLocaleString("en-IN")} sq ft`,
    property.status,
  ].filter(Boolean);

  return (
    <article className={cn("group relative", className)}>
      <Link href={`/properties/${property.slug}`} className="block" aria-label={`${property.name}, ${property.neighborhood}, ${property.city} — ${price}`}>
        <PropertyMedia
          image={property.hero}
          coordinates={property.coordinates}
          sizes={size === "lg" ? "(min-width:1024px) 58vw, 100vw" : "(min-width:1024px) 40vw, 100vw"}
          className={size === "lg" ? "aspect-[4/3]" : "aspect-[4/5]"}
        >
          <span className="meta absolute left-4 top-4 rounded-full bg-soft/90 px-3 py-1.5 text-[0.6rem] text-ink backdrop-blur">
            {property.type}
          </span>
        </PropertyMedia>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <p className="meta text-muted">
              {property.neighborhood}, {property.city}
            </p>
            <h3 className="font-display mt-2 text-[clamp(1.75rem,2.6vw,2.5rem)]">{property.name}</h3>
            <p className="meta mt-3 text-[0.625rem] text-muted">{facts.join("  ·  ")}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-display text-[clamp(1.4rem,2vw,1.9rem)]">{price}</p>
            <span className="mt-3 inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.12em] uppercase opacity-70 transition-opacity group-hover:opacity-100">
              Explore <Arrow />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
