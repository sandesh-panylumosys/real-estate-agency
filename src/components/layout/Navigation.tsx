"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/providers/SmoothScroll";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { telHref, whatsappHref } from "@/lib/contact";

type Tone = "dark" | "light";

/**
 * Minimal navigation. Transparent over the hero, then settles into a refined
 * blurred bar whose tone follows the section beneath it (sections declare
 * data-nav="dark" | "light"). Hides while reading downward, returns on scroll up.
 */
export function Navigation() {
  const lenis = useLenis();
  const pathname = usePathname();
  const isCurrent = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [tone, setTone] = useState<Tone>("dark");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > window.innerHeight * 0.9);
      last = y;

      // Tone of the section currently under the bar.
      const probe = document.elementsFromPoint(window.innerWidth / 2, 36);
      const host = probe.map((n) => (n as HTMLElement).closest<HTMLElement>("[data-nav]")).find(Boolean);
      if (host) setTone((host.dataset.nav as Tone) ?? "light");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const dark = tone === "dark" || open;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[150] transition-[transform,background-color,color,border-color] duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          dark ? "text-soft" : "text-ink",
          scrolled && !open
            ? cn("border-b backdrop-blur-xl", dark ? "border-soft/10 bg-ink/55" : "border-ink/10 bg-ivory/70")
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav aria-label="Primary" className="px-gutter flex h-[72px] items-center justify-between gap-6">
          <Link href="/" aria-label={`${site.name} — home`} data-cursor="" onClick={() => setOpen(false)}>
            <Logo />
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="group relative py-2 text-[0.75rem] font-medium tracking-[0.16em] uppercase"
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-out-expo)]",
                      isCurrent(item.href)
                        ? "scale-x-100 bg-bronze"
                        : "origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Magnetic>
              <Link
                href="#enquire"
                data-cursor="open"
                className={cn(
                  "hidden min-h-11 items-center gap-2 rounded-full border px-5 text-[0.75rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-500 sm:inline-flex",
                  dark ? "border-soft/30 hover:bg-soft hover:text-ink" : "border-ink/25 hover:bg-ink hover:text-soft",
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-bronze" />
                Enquire
              </Link>
            </Magnetic>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
              className="relative flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-6 bg-current transition-transform duration-500",
                  open ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-6 bg-current transition-transform duration-500",
                  open ? "-rotate-45" : "translate-y-1",
                )}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-0 z-[140] flex flex-col justify-between bg-ink px-gutter pb-10 pt-28 text-soft lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {[...site.nav, { label: "Enquire", href: "#enquire" }].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-2 font-display text-[clamp(2.75rem,12vw,4.5rem)]"
                  >
                    <span className="meta text-[0.625rem] text-bronze">0{i + 1}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 text-sm text-stone/80">
              <div className="flex gap-3">
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-full bg-soft text-[0.75rem] font-semibold tracking-[0.12em] text-ink uppercase"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25a35a]" /> WhatsApp
                </a>
                <a
                  href={telHref()}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-full border border-soft/30 text-[0.75rem] font-semibold tracking-[0.12em] uppercase"
                >
                  <PhoneIcon className="h-5 w-5" /> Call
                </a>
              </div>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
