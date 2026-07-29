import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoAsset from "@/assets/1m-ai-superstars-logo-transparent.png";
import { programConfig } from "@/lib/programConfig";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-white/70 shadow-[0_8px_30px_-14px_rgba(31,10,119,0.18)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
      style={{ WebkitBackdropFilter: scrolled ? "blur(22px) saturate(140%)" : undefined }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link to="/" aria-label="1 Million AI Superstars Home" className="shrink-0">
          <img
            src={logoAsset}
            alt="1 Million AI Superstars"
            width={720}
            height={360}
            className="h-12 w-auto sm:h-14 md:h-[60px]"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {programConfig.nav.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-primary" : "text-foreground/70 hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={programConfig.registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full gradient-bg px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_-10px_rgba(31,10,119,0.55)] transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            Register Now
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-white/80 text-foreground backdrop-blur transition-colors hover:bg-white md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-border/60 bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {programConfig.nav.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={[
                      "rounded-xl px-4 py-3 text-base font-medium transition-colors",
                      active
                        ? "bg-secondary text-primary"
                        : "text-foreground hover:bg-secondary/60",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href={programConfig.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center rounded-full gradient-bg px-5 py-3 text-sm font-semibold text-white"
              >
                Register Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
