import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import logoAsset from "@/assets/1m-ai-superstars-logo-transparent.png";
import { programConfig } from "@/lib/programConfig";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 12);

      // Auto-hide logic
      if (currentScrollY < 20) {
        setHidden(false); // Always show at top
      } else if (currentScrollY > lastScrollY.current + 5) {
        setHidden(true); // Hide on scroll down
      } else if (currentScrollY < lastScrollY.current - 5) {
        setHidden(false); // Show on scroll up
      }

      if (Math.abs(currentScrollY - lastScrollY.current) > 5 || currentScrollY < 20) {
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll & handle Escape key when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [open]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(to + "/");

  // Keep desktop nav visible on desktop even if hidden is true for mobile scroll
  return (
    <>
      <header
        className={[
          "fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-[1240px] -translate-x-1/2 rounded-full transition-all duration-300 sm:top-5",
          scrolled
            ? "border border-white/40 bg-white/70 shadow-[0_8px_30px_-14px_rgba(31,10,119,0.18)] backdrop-blur-xl"
            : "border border-white/20 bg-white/40 shadow-[0_4px_20px_-10px_rgba(31,10,119,0.08)] backdrop-blur-md",
          hidden && !open
            ? "-translate-y-[150%] opacity-0 md:translate-y-0 md:opacity-100"
            : "translate-y-0 opacity-100",
        ].join(" ")}
        style={{
          WebkitBackdropFilter: scrolled
            ? "blur(22px) saturate(140%)"
            : "blur(12px) saturate(100%)",
        }}
      >
        <div className="flex h-[68px] items-center justify-between gap-4 px-4 sm:h-[76px] sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex flex-1 items-center justify-start">
            <Link
              to="/"
              aria-label="1 Million AI Superstars Home"
              className="flex shrink-0 items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <img
                src={logoAsset}
                alt="1 Million AI Superstars"
                className="h-9 w-auto object-contain transition-transform duration-300 hover:scale-[1.02] sm:h-11"
              />
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden flex-none items-center justify-center gap-1 md:flex">
            {programConfig.nav.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    "relative rounded-full px-4 py-2 text-[15px] outline-none transition-all focus-visible:ring-2 focus-visible:ring-primary",
                    active
                      ? "font-semibold text-primary"
                      : "font-medium text-foreground/70 hover:bg-black/[0.04] hover:text-foreground",
                  ].join(" ")}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: CTA & Mobile Menu Button */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <a
              href={programConfig.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center justify-center rounded-full px-6 py-2.5 text-[15px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(31,10,119,0.5)] outline-none transition-all hover:-translate-y-[2px] hover:shadow-[0_12px_24px_-10px_rgba(31,10,119,0.6)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:inline-flex gradient-bg"
            >
              Register Now
            </a>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/50 bg-white/80 text-foreground/80 backdrop-blur transition-colors hover:bg-white hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            >
              <Menu className="h-[22px] w-[22px]" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Top Mobile Menu */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] md:hidden" id="mobile-menu">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/35 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Top Drawer */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="relative flex w-full flex-col rounded-b-3xl bg-white shadow-2xl"
            >
              {/* Header inside drawer */}
              <div className="flex h-[68px] items-center justify-between gap-4 border-b border-border/40 px-4 sm:h-[76px] sm:px-6">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex shrink-0 items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <img src={logoAsset} alt="Logo" className="h-9 w-auto object-contain sm:h-11" />
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-black/5 hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="h-[22px] w-[22px]" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-2 px-6 py-6 sm:px-8 sm:py-8">
                {programConfig.nav.map((item) => {
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className={[
                        "block w-full rounded-xl px-4 py-3 text-[17px] sm:text-[19px] font-semibold tracking-tight transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/80 hover:bg-black/[0.04] hover:text-foreground",
                      ].join(" ")}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom CTA */}
              <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-2 sm:px-8">
                <a
                  href={programConfig.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="mx-auto flex w-full max-w-[260px] items-center justify-center rounded-full px-6 py-3 text-[15px] sm:text-[16px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(31,10,119,0.4)] transition-all hover:-translate-y-[1px] hover:shadow-[0_12px_24px_-10px_rgba(31,10,119,0.5)] active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 gradient-bg"
                >
                  Register Now
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
