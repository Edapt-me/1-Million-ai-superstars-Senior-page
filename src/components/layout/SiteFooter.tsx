import { Instagram, Facebook, Mail, MessageCircle, Phone } from "lucide-react";
import logoAsset from "@/assets/1m-ai-superstars-logo-transparent.png";
import { programConfig } from "@/lib/programConfig";

export function SiteFooter() {
  const { contact, social } = programConfig;
  return (
    <footer className="border-t border-border bg-white pb-28 pt-20 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3 md:gap-20 lg:gap-24">
          <div>
            <img
              src={logoAsset}
              alt="1 Million AI Superstars"
              width={480}
              height={240}
              className="h-20 w-auto sm:h-24"
            />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
              Empowering Malayalees to master AI in simple Malayalam, with practical, live
              instruction and real-world tools.
            </p>
          </div>

          <div>
            <div className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
              Quick Contact
            </div>
            <ul className="mt-5 space-y-4 text-[15px]">
              <li>
                <a
                  href={contact.phoneHref}
                  className="group inline-flex items-center gap-3 text-foreground transition-colors hover:text-primary"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary transition-all group-hover:gradient-bg group-hover:text-white">
                    <Phone className="h-4 w-4" />
                  </span>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 text-foreground transition-colors hover:text-primary"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary transition-all group-hover:gradient-bg group-hover:text-white">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="group inline-flex items-center gap-3 break-all text-foreground transition-colors hover:text-primary"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-primary transition-all group-hover:gradient-bg group-hover:text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">{contact.email}</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
              Follow Us
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group grid h-12 w-12 place-items-center rounded-full border border-border bg-white text-primary transition-all hover:-translate-y-0.5 hover:border-transparent hover:gradient-bg hover:text-white hover:shadow-[var(--shadow-soft)]"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="group grid h-12 w-12 place-items-center rounded-full border border-border bg-white text-primary transition-all hover:-translate-y-0.5 hover:border-transparent hover:gradient-bg hover:text-white hover:shadow-[var(--shadow-soft)]"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-5 text-[14px] text-muted-foreground">
              Join our community for AI tips, tools & updates.
            </p>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-8 text-center text-[13px] text-muted-foreground">
          © 2026 1 Million AI Superstars.
        </div>
      </div>
    </footer>
  );
}
