import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { Phone, MessageCircle, Mail, Instagram, Facebook, Send } from "lucide-react";
import { PageHero } from "@/components/layout/PageShell";
import { programConfig } from "@/lib/programConfig";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | 1 Million AI Superstars" },
      {
        name: "description",
        content:
          "Reach the 1 Million AI Superstars team via WhatsApp, phone or email. We're here to help you enroll.",
      },
      { property: "og:title", content: "Contact | 1 Million AI Superstars" },
      {
        property: "og:description",
        content:
          "Talk to the 1 Million AI Superstars team about admissions, corporate batches, and partnerships.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: "https://onemillionaisuperstars-seniorpathway.lovable.app/contact",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://onemillionaisuperstars-seniorpathway.lovable.app/contact",
      },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name (at least 2 characters)."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[+()\d\s-]{7,18}$/.test(v), "Please enter a valid phone number."),
  message: z.string().trim().min(10, "Please tell us a little more (at least 10 characters)."),
});
type ContactForm = z.infer<typeof contactSchema>;
type FieldErrors = Partial<Record<keyof ContactForm, string>>;

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "", message: "" });
  const { contact, social } = programConfig;

  const update = (key: keyof ContactForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setStatus("idle");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactForm;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setStatus("idle");
      return;
    }
    // TODO: Wire to Lovable Cloud in Phase 3.
    setErrors({});
    setStatus("sent");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        subtitle="Questions about the program, admissions, or partnerships? We're just a message away."
      />

      <section className="pb-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-5 lg:px-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold">Reach us directly</h2>
            <p className="mt-2 text-[15px] text-muted-foreground">
              We respond fastest on WhatsApp during working hours.
            </p>
            <ul className="mt-6 space-y-4 text-[15px]">
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-foreground hover:text-primary"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary transition-all group-hover:gradient-bg group-hover:text-white">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  WhatsApp: {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.phoneHref}
                  className="group inline-flex items-center gap-3 text-foreground hover:text-primary"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary transition-all group-hover:gradient-bg group-hover:text-white">
                    <Phone className="h-4 w-4" />
                  </span>
                  Call {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="group inline-flex items-center gap-3 break-all text-foreground hover:text-primary"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary transition-all group-hover:gradient-bg group-hover:text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  {contact.email}
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <div className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
                Follow us
              </div>
              <div className="mt-3 flex gap-3">
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white text-primary transition-all hover:gradient-bg hover:text-white"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white text-primary transition-all hover:gradient-bg hover:text-white"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="md:col-span-3 rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] md:p-8"
          >
            <h2 className="text-2xl font-semibold">Send us a message</h2>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Share your details and we'll get back to you.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-foreground">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition focus:ring-4 focus:ring-primary/15 ${errors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <span
                    id="err-name"
                    role="alert"
                    className="mt-1.5 block text-[13px] text-destructive"
                  >
                    {errors.name}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Phone <span className="text-muted-foreground">(optional)</span>
                </span>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "err-phone" : undefined}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition focus:ring-4 focus:ring-primary/15 ${errors.phone ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
                  placeholder="+91 …"
                />
                {errors.phone && (
                  <span
                    id="err-phone"
                    role="alert"
                    className="mt-1.5 block text-[13px] text-destructive"
                  >
                    {errors.phone}
                  </span>
                )}
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium text-foreground">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition focus:ring-4 focus:ring-primary/15 ${errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <span
                    id="err-email"
                    role="alert"
                    className="mt-1.5 block text-[13px] text-destructive"
                  >
                    {errors.email}
                  </span>
                )}
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium text-foreground">
                  Message
                </span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "err-message" : undefined}
                  className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition focus:ring-4 focus:ring-primary/15 ${errors.message ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
                  placeholder="How can we help?"
                />
                {errors.message && (
                  <span
                    id="err-message"
                    role="alert"
                    className="mt-1.5 block text-[13px] text-destructive"
                  >
                    {errors.message}
                  </span>
                )}
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-full gradient-bg px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_-10px_rgba(31,10,119,0.55)] transition-transform hover:-translate-y-0.5"
            >
              <Send className="h-4 w-4" />
              Send message
            </button>

            {status === "sent" && (
              <p className="mt-4 text-sm text-primary">Thanks, we'll get back to you shortly.</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
