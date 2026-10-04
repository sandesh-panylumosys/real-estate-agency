"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { site } from "@/data/site";
import { telHref, whatsappHref } from "@/lib/contact";

/**
 * Persistent direct-contact dock: WhatsApp and call, one tap away on every
 * page. The WhatsApp message mentions the page the visitor is on so the
 * advisor has context.
 */
export function ContactDock() {
  const { ready } = useExperience();
  const pathname = usePathname();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    const id = requestAnimationFrame(() => setOrigin(window.location.origin));
    return () => cancelAnimationFrame(id);
  }, []);

  const message =
    pathname === "/" || !origin ? site.whatsappGreeting : `${site.whatsappGreeting}\n\nI was looking at: ${origin}${pathname}`;

  const items = [
    {
      key: "whatsapp",
      href: whatsappHref(message),
      label: "WhatsApp an advisor",
      icon: <WhatsAppIcon className="h-[18px] w-[18px]" />,
      external: true,
    },
    {
      key: "call",
      href: telHref(),
      label: `Call ${site.phone}`,
      icon: <PhoneIcon className="h-[18px] w-[18px]" />,
      external: false,
    },
  ];

  return (
    <AnimatePresence>
      {ready && (
        <motion.nav
          aria-label="Contact an advisor"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-[160] flex flex-col items-end gap-2 md:bottom-6 md:right-6"
        >
          {items.map((it) => (
            <a
              key={it.key}
              href={it.href}
              {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              aria-label={it.label + (it.external ? " (opens WhatsApp)" : "")}
              data-cursor=""
              className="group flex h-12 items-center gap-0 overflow-hidden rounded-full border border-soft/15 bg-ink/85 pl-[15px] pr-[15px] text-soft shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md transition-[background-color,border-color,gap,padding] duration-500 ease-[var(--ease-out-expo)] hover:gap-3 hover:border-bronze/60 hover:bg-ink hover:pr-5 focus-visible:gap-3 focus-visible:pr-5"
            >
              <span className={it.key === "whatsapp" ? "text-[#7fd6a0]" : "text-stone"}>{it.icon}</span>
              <span className="max-w-0 whitespace-nowrap text-[0.7rem] font-semibold tracking-[0.14em] uppercase opacity-0 transition-[max-width,opacity] duration-500 ease-[var(--ease-out-expo)] group-hover:max-w-[14rem] group-hover:opacity-100 group-focus-visible:max-w-[14rem] group-focus-visible:opacity-100">
                {it.key === "whatsapp" ? "WhatsApp" : site.phone}
              </span>
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
