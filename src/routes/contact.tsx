import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | 1 Million AI Superstars" },
      {
        name: "description",
        content:
          "Talk to the 1 Million AI Superstars team about admissions, corporate batches, and partnerships.",
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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "", message: "" });

  const update = (key: keyof ContactForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
    setStatus("idle");
  };

  const onSubmit = async (e: React.FormEvent) => {
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
    
    setErrors({});
    setStatus("sending");

    try {
      await fetch("https://script.google.com/macros/s/AKfycbzUpY8OJcLPXWUum-m8Fjg5Rs3NuGad0IxXmQZ7FPESjy9uuXIEa2zmVkhldKU1k4yH1g/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message
        })
      });

      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
      toast.success("Message sent successfully! We'll get back to you soon.");
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <section className="relative overflow-hidden hero-bg pb-6 pt-[88px] sm:pt-[104px] md:pb-8 md:pt-[120px]">
        <div className="mx-auto max-w-4xl px-5 text-left md:text-center sm:px-6 lg:px-8">
          <h1 className="text-balance text-[28px] font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]">
            <span className="gradient-text">Let's talk</span>
          </h1>
          <p className="mt-3 md:mx-auto md:mt-4 max-w-2xl text-[15px] leading-[1.5] text-muted-foreground sm:text-[16px] md:text-[17px]">
            Questions about the program, admissions, or partnerships? We're just a message away.
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <form
            onSubmit={onSubmit}
            className="rounded-2xl sm:rounded-3xl border border-border bg-white p-5 sm:p-6 shadow-[var(--shadow-soft)] md:p-8"
          >
            <h2 className="text-[20px] sm:text-2xl font-semibold">Send us a message</h2>
            <p className="mt-1.5 sm:mt-2 text-[14px] sm:text-[15px] text-muted-foreground">
              Share your details and we'll get back to you.
            </p>

            <div className="mt-5 sm:mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[12px] sm:text-[13px] font-medium text-foreground">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-[14px] sm:text-[15px] outline-none transition focus:ring-4 focus:ring-primary/15 ${errors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <span
                    id="err-name"
                    role="alert"
                    className="mt-1 block text-[12px] sm:text-[13px] text-destructive"
                  >
                    {errors.name}
                  </span>
                )}
              </label>
              <label className="block">
                <span className="mb-1 block text-[12px] sm:text-[13px] font-medium text-foreground">
                  Phone <span className="text-muted-foreground">(optional)</span>
                </span>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "err-phone" : undefined}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-[14px] sm:text-[15px] outline-none transition focus:ring-4 focus:ring-primary/15 ${errors.phone ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
                  placeholder="+91 …"
                />
                {errors.phone && (
                  <span
                    id="err-phone"
                    role="alert"
                    className="mt-1 block text-[12px] sm:text-[13px] text-destructive"
                  >
                    {errors.phone}
                  </span>
                )}
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-[12px] sm:text-[13px] font-medium text-foreground">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                  className={`w-full rounded-xl border bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-[14px] sm:text-[15px] outline-none transition focus:ring-4 focus:ring-primary/15 ${errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <span
                    id="err-email"
                    role="alert"
                    className="mt-1 block text-[12px] sm:text-[13px] text-destructive"
                  >
                    {errors.email}
                  </span>
                )}
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-[12px] sm:text-[13px] font-medium text-foreground">
                  Message
                </span>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "err-message" : undefined}
                  className={`w-full resize-none rounded-xl border bg-white px-3.5 py-2.5 sm:px-4 sm:py-3 text-[14px] sm:text-[15px] outline-none transition focus:ring-4 focus:ring-primary/15 ${errors.message ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"}`}
                  placeholder="How can we help?"
                />
                {errors.message && (
                  <span
                    id="err-message"
                    role="alert"
                    className="mt-1 block text-[12px] sm:text-[13px] text-destructive"
                  >
                    {errors.message}
                  </span>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 inline-flex items-center gap-2 rounded-full gradient-bg px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_28px_-10px_rgba(31,10,119,0.55)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send message
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
