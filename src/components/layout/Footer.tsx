import Link from "next/link";
import { Annotation } from "@/components/ui/Architectural";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { telHref, whatsappHref } from "@/lib/contact";
import { Logo } from "@/components/ui/Logo";
import { RevealText } from "@/components/ui/RevealText";
import { site } from "@/data/site";
import { formatCoord } from "@/lib/utils";

export function Footer() {
  const nav = [...site.nav, { label: "Contact", href: "#enquire" }];
  return (
    <footer data-nav="dark" className="relative overflow-hidden bg-ink pt-28 text-soft md:pt-40">
      <div className="px-gutter">
        <RevealText as="p" by="words" className="font-display max-w-[12ch] text-[clamp(3.25rem,10vw,11rem)]">
          Let&apos;s find your <span className="accent text-taupe">next place.</span>
        </RevealText>

        <div className="mt-24 grid gap-14 border-t border-soft/10 pt-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-xs text-[0.9rem] leading-relaxed text-stone/70">{site.tagline}</p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <p className="meta text-[0.6rem] text-taupe">Navigate</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {nav.map((n) => (
                <li key={n.label}>
                  <Link href={n.href} className="text-[0.95rem] text-stone/85 transition-colors hover:text-soft">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="meta text-[0.6rem] text-taupe">Visit</p>
            <address className="mt-5 max-w-[24ch] text-[0.95rem] not-italic leading-relaxed text-stone/85">{site.address}</address>
            <div className="mt-5 flex flex-col gap-1.5 text-[0.95rem]">
              <a href={telHref()} className="inline-flex items-center gap-2 text-stone/85 hover:text-soft">
                <PhoneIcon className="h-4 w-4" />
                {site.phone}
              </a>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-stone/85 hover:text-soft"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#7fd6a0]" />
                WhatsApp
                <span className="sr-only"> (opens WhatsApp)</span>
              </a>
              <a href={`mailto:${site.email}`} className="text-stone/85 hover:text-soft">
                {site.email}
              </a>
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="meta text-[0.6rem] text-taupe">Follow</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-[0.95rem] text-stone/85 hover:text-soft">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-soft/10 py-8 text-[0.75rem] text-stone/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. RERA registered agent.
          </p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <Link href="/#top" className="hover:text-soft">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/#top" className="hover:text-soft">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/#top" className="hover:text-soft">
                Back to top ↑
              </Link>
            </li>
          </ul>
          <p className="meta text-[0.6rem]">
            {formatCoord(site.coordinates.lat, "lat")} · {formatCoord(site.coordinates.lng, "lng")}
          </p>
        </div>
      </div>

      {/* Oversized elevation line drawing as a quiet signature */}
      <svg aria-hidden viewBox="0 0 1200 160" className="pointer-events-none mt-4 block w-full text-soft/[0.07]">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0 159 H1200" />
          <path d="M80 159 V70 H300 V159 M260 70 V20 H520 V159 M560 159 V90 H760 V159 M720 90 V40 H980 V159 M1010 159 V100 H1140 V159" />
          <path d="M120 100 H260 M120 130 H260 M300 50 H480 M600 120 H720 M760 70 H940 M760 110 H940" />
        </g>
      </svg>
      <Annotation className="bottom-6 right-[var(--gutter)] text-taupe">Elevation · North</Annotation>
    </footer>
  );
}
