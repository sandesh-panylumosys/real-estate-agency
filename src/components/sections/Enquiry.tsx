"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { CornerMarks, SectionLabel } from "@/components/ui/Architectural";
import { Button } from "@/components/ui/Button";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/ContactIcons";
import { telHref, whatsappHref } from "@/lib/contact";
import type { PropertyType, Purpose } from "@/data/types";
import { site } from "@/data/site";
import { cn, pad2 } from "@/lib/utils";

type Enquiry = {
  purpose?: Purpose;
  type?: PropertyType;
  location?: string;
  budget?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
};

const TYPES: PropertyType[] = ["Apartment", "Villa", "Penthouse", "Farmhouse", "Plot", "Commercial"];
const LOCATIONS = ["Mumbai", "Goa", "Bengaluru", "Pune", "Alibaug", "Open to suggestions"];
const BUDGETS: Record<Purpose, string[]> = {
  Buy: ["Under ₹2 Cr", "₹2 – 5 Cr", "₹5 – 10 Cr", "₹10 Cr +"],
  Invest: ["Under ₹2 Cr", "₹2 – 5 Cr", "₹5 – 10 Cr", "₹10 Cr +"],
  Rent: ["Under ₹1 L / mo", "₹1 – 3 L / mo", "₹3 – 6 L / mo", "₹6 L + / mo"],
};

const STEPS = ["Intent", "Residence", "Location", "Budget", "Details"] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Enquiry as a consultation: one question at a time, each answer composing a
 * sentence. Choices advance automatically; Back is always available.
 */
export function Enquiry({ index = "13" }: { index?: string }) {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<Enquiry>({ name: "", email: "", phone: "", message: "", consent: false });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const panel = useRef<HTMLDivElement>(null);

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  // Move focus to the new question (once it has entered) for keyboard and screen-reader users.
  const prevStep = useRef(step);
  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    const id = window.setTimeout(
      () => panel.current?.querySelector<HTMLElement>("[data-step-title]")?.focus({ preventScroll: true }),
      700,
    );
    return () => window.clearTimeout(id);
  }, [step]);

  const choose = <K extends keyof Enquiry>(key: K, value: Enquiry[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    window.setTimeout(() => go(step + 1), 280);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!data.name.trim()) errs.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = "Please enter a valid email address.";
    if (!data.consent) errs.consent = "Please confirm we may contact you.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      // Wait for the error state to render, then focus the first invalid field.
      window.setTimeout(() => panel.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(), 0);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  const sentence = [
    data.purpose && `I'd like to ${data.purpose === "Invest" ? "invest in" : data.purpose.toLowerCase()}`,
    data.type && `${/^[AEIOU]/.test(data.type) ? "an" : "a"} ${data.type.toLowerCase()}`,
    data.location && (data.location === "Open to suggestions" ? "— open on location" : `in ${data.location}`),
    data.budget && `· ${data.budget}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id="enquire"
      data-nav="dark"
      aria-labelledby="enquire-title"
      className="relative overflow-hidden bg-charcoal py-28 text-soft md:py-40"
    >
      <div className="px-gutter grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionLabel index={index} tone="dark">
            Private Consultation
          </SectionLabel>
          <h2 id="enquire-title" className="font-display mt-10 text-[clamp(2.75rem,5.5vw,5.5rem)]">
            What are you <span className="accent block text-taupe">looking for?</span>
          </h2>
          <p className="mt-8 max-w-sm text-[0.95rem] leading-[1.8] text-stone/80">
            Five short questions. An advisor — not a call centre — will reply within one working day.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="open"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-soft/20 px-5 text-[0.75rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-500 hover:border-soft hover:bg-soft hover:text-ink"
            >
              <WhatsAppIcon className="h-[18px] w-[18px] text-[#7fd6a0] group-hover:text-[#25a35a]" />
              Chat on WhatsApp
              <span className="sr-only">(opens WhatsApp)</span>
            </a>
            <a
              href={telHref()}
              data-cursor="open"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-soft/20 px-5 text-[0.75rem] font-semibold tracking-[0.12em] uppercase transition-colors duration-500 hover:border-soft hover:bg-soft hover:text-ink"
            >
              <PhoneIcon className="h-[18px] w-[18px]" />
              {site.phone}
            </a>
          </div>
          <a href={`mailto:${site.email}`} className="mt-5 inline-block text-[0.9rem] text-stone/70 hover:text-soft">
            {site.email}
          </a>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="relative border border-soft/10 p-6 sm:p-10 md:p-14">
            <CornerMarks className="-inset-px text-stone/60" />

            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE }}
                className="py-10"
                role="status"
              >
                <p className="meta text-bronze">Received</p>
                <p className="font-display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">
                  Thank you, <span className="accent">{data.name.split(" ")[0]}.</span>
                </p>
                <p className="mt-6 max-w-md text-[0.95rem] leading-[1.8] text-stone/80">
                  An advisor will be in touch within one working day with a considered shortlist.
                </p>
                {sentence && <p className="font-serif mt-10 text-2xl italic text-stone">&ldquo;{sentence}.&rdquo;</p>}
              </motion.div>
            ) : (
              <>
                {/* Progress */}
                <div className="flex items-center gap-4">
                  <span className="meta tabular-nums text-stone">
                    {pad2(step + 1)} / {pad2(STEPS.length)}
                  </span>
                  <ol className="flex flex-1 gap-1.5" aria-label="Progress">
                    {STEPS.map((s, i) => (
                      <li key={s} className="relative h-px flex-1 bg-soft/15">
                        <span
                          className="absolute inset-0 origin-left bg-bronze transition-transform duration-700 ease-[var(--ease-out-expo)]"
                          style={{ transform: `scaleX(${i <= step ? 1 : 0})` }}
                        />
                        <span className="sr-only">
                          {s}
                          {i < step ? " — completed" : i === step ? " — current" : ""}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* The sentence being composed */}
                <p className="font-serif mt-8 min-h-[2.25rem] text-[1.35rem] italic text-taupe" aria-live="polite">
                  {sentence || "Let's begin."}
                </p>

                <div ref={panel} className="relative mt-8 min-h-[22rem]">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      initial={{ opacity: 0, x: dir * 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: dir * -50 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      {step === 0 && (
                        <Step title="Are you looking to buy, rent or invest?">
                          <Choices
                            options={["Buy", "Rent", "Invest"]}
                            value={data.purpose}
                            onChoose={(v) => choose("purpose", v as Purpose)}
                            large
                          />
                        </Step>
                      )}
                      {step === 1 && (
                        <Step title="What kind of residence?">
                          <Choices options={TYPES} value={data.type} onChoose={(v) => choose("type", v as PropertyType)} />
                        </Step>
                      )}
                      {step === 2 && (
                        <Step title="Where would you like to be?">
                          <Choices options={LOCATIONS} value={data.location} onChoose={(v) => choose("location", v)} />
                        </Step>
                      )}
                      {step === 3 && (
                        <Step title="And the budget you have in mind?">
                          <Choices
                            options={BUDGETS[data.purpose ?? "Buy"]}
                            value={data.budget}
                            onChoose={(v) => choose("budget", v)}
                          />
                        </Step>
                      )}
                      {step === 4 && (
                        <Step title="How may we reach you?">
                          <form onSubmit={submit} noValidate className="grid gap-6 sm:grid-cols-2">
                            <Input
                              id={`${uid}-name`}
                              label="Full name"
                              autoComplete="name"
                              value={data.name}
                              error={errors.name}
                              onChange={(v) => setData((d) => ({ ...d, name: v }))}
                              required
                            />
                            <Input
                              id={`${uid}-email`}
                              label="Email"
                              type="email"
                              autoComplete="email"
                              value={data.email}
                              error={errors.email}
                              onChange={(v) => setData((d) => ({ ...d, email: v }))}
                              required
                            />
                            <Input
                              id={`${uid}-phone`}
                              label="Phone (optional)"
                              type="tel"
                              autoComplete="tel"
                              value={data.phone}
                              onChange={(v) => setData((d) => ({ ...d, phone: v }))}
                            />
                            <Input
                              id={`${uid}-msg`}
                              label="Anything else? (optional)"
                              value={data.message}
                              onChange={(v) => setData((d) => ({ ...d, message: v }))}
                            />
                            <label className="flex items-start gap-3 text-[0.85rem] leading-relaxed text-stone/80 sm:col-span-2">
                              <input
                                type="checkbox"
                                checked={data.consent}
                                onChange={(e) => setData((d) => ({ ...d, consent: e.target.checked }))}
                                aria-invalid={!!errors.consent}
                                aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
                                className="mt-1 h-4 w-4 shrink-0 accent-[#A8875A]"
                              />
                              <span>
                                I agree to be contacted by {site.name} about my enquiry.
                                {errors.consent && (
                                  <span id={`${uid}-consent-err`} className="mt-1 block text-[#e3b98a]">
                                    {errors.consent}
                                  </span>
                                )}
                              </span>
                            </label>
                            <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
                              <Button type="submit" tone="dark" disabled={status === "sending"} cursor="open">
                                {status === "sending" ? "Sending…" : "Request Consultation"}
                              </Button>
                              {status === "error" && (
                                <p role="alert" className="text-[0.85rem] text-[#e3b98a]">
                                  Something went wrong. Please try again or call us.
                                </p>
                              )}
                            </div>
                          </form>
                        </Step>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-8 flex min-h-11 items-center justify-between">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={() => go(step - 1)}
                      className="meta group inline-flex min-h-11 items-center gap-3 text-stone hover:text-soft"
                    >
                      <svg viewBox="0 0 20 12" className="h-3 w-5 rotate-180 transition-transform group-hover:-translate-x-1" aria-hidden>
                        <path d="M0 6h18M13 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                      Back
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < 4 && data[(["purpose", "type", "location", "budget"] as const)[step]] && (
                    <button type="button" onClick={() => go(step + 1)} className="meta min-h-11 text-stone hover:text-soft">
                      Continue
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend data-step-title tabIndex={-1} className="font-display text-[clamp(2rem,3.6vw,3.25rem)] outline-none">
        {title}
      </legend>
      <div className="mt-10">{children}</div>
    </fieldset>
  );
}

function Choices({
  options,
  value,
  onChoose,
  large,
}: {
  options: string[];
  value?: string;
  onChoose: (v: string) => void;
  large?: boolean;
}) {
  return (
    <div className={cn("grid gap-3", large ? "sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
      {options.map((o, i) => {
        const on = value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChoose(o)}
            data-cursor="select"
            className={cn(
              "group flex items-center justify-between border text-left transition-colors duration-500",
              large ? "min-h-28 flex-col items-start justify-between p-5" : "min-h-14 px-5 py-3",
              on ? "border-stone bg-stone text-ink" : "border-soft/15 hover:border-stone/70 hover:bg-soft/[0.03]",
            )}
          >
            <span className={cn("meta text-[0.6rem]", on ? "text-ink/60" : "text-taupe")}>{pad2(i + 1)}</span>
            <span className={cn(large ? "font-display text-4xl" : "text-[0.95rem]")}>{o}</span>
          </button>
        );
      })}
    </div>
  );
}

function Input({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="meta block text-[0.625rem] text-taupe">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "mt-2 h-12 w-full border-b bg-transparent text-[1.05rem] text-soft outline-none transition-colors placeholder:text-stone/40 focus:border-stone",
          error ? "border-[#e3b98a]" : "border-soft/20",
        )}
      />
      {error && (
        <p id={`${id}-err`} className="mt-2 text-[0.8rem] text-[#e3b98a]">
          {error}
        </p>
      )}
    </div>
  );
}
