import { Annotation } from "@/components/ui/Architectural";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/data/site";
import { telHref, whatsappHref } from "@/lib/contact";

/** "Speak to an advisor" band with direct WhatsApp and call actions. */
export function AdvisorBand({
  title = "Prefer a conversation?",
  body = "Our advisors answer personally — usually within the hour, seven days a week.",
  message,
}: {
  title?: string;
  body?: string;
  /** Pre-filled WhatsApp message. */
  message?: string;
}) {
  return (
    <section data-nav="light" aria-label="Contact an advisor" className="relative overflow-hidden border-y border-ink/10 bg-ivory py-20 text-ink md:py-28">
      <div className="px-gutter grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-muted">Direct line</p>
          <h2 className="font-display mt-6 text-[clamp(2.5rem,5vw,5rem)]">{title}</h2>
          <p className="mt-5 max-w-md text-[0.95rem] leading-[1.8] text-muted">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-6 lg:justify-end">
          <Magnetic>
            <a
              href={whatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="group inline-flex min-h-14 w-full items-center justify-center gap-4 rounded-full bg-ink px-8 text-[0.8125rem] font-semibold tracking-[0.08em] text-soft uppercase transition-colors duration-500 hover:bg-charcoal sm:w-auto"
            >
              <WhatsAppIcon className="h-5 w-5 text-[#7fd6a0] transition-transform duration-500 group-hover:scale-110" />
              WhatsApp us
              <span className="sr-only">(opens WhatsApp)</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={telHref()}
              data-cursor="open"
              className="group inline-flex min-h-14 w-full items-center justify-center gap-4 rounded-full border border-ink/25 px-8 text-[0.8125rem] font-semibold tracking-[0.08em] uppercase transition-colors duration-500 hover:border-ink sm:w-auto"
            >
              <PhoneIcon className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
              {site.phone}
            </a>
          </Magnetic>
        </div>
      </div>
      <Annotation className="bottom-6 right-[var(--gutter)] hidden text-muted md:flex">Mon–Sun · 9:00–21:00 IST</Annotation>
    </section>
  );
}
