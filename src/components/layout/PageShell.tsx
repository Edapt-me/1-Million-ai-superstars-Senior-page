import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden hero-bg pb-16 pt-32 sm:pt-36 md:pb-24 md:pt-44">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {eyebrow && (
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full gradient-bg px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-white">
            {eyebrow}
          </div>
        )}
        <h1 className="text-balance text-[36px] font-semibold tracking-tight sm:text-[44px] md:text-[56px]">
          <span className="gradient-text">{title}</span>
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground md:text-[19px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
