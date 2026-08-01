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
  compact = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden hero-bg pt-[96px] sm:pt-[112px] md:pt-[144px] ${compact ? "pb-6 md:pb-8" : "pb-10 md:pb-20"}`}>
      <div className="mx-auto max-w-4xl px-5 text-left md:text-center sm:px-6 lg:px-8">
        {eyebrow && (
          <div className="mb-3 md:mx-auto md:mb-4 inline-flex items-center gap-2 rounded-full gradient-bg px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">
            {eyebrow}
          </div>
        )}
        <h1 className="text-balance text-[28px] font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]">
          <span className="gradient-text">{title}</span>
        </h1>
        {subtitle && (
          <p className="mt-3 md:mx-auto md:mt-4 max-w-2xl text-[16px] leading-[1.5] text-muted-foreground sm:text-[17px] md:text-[19px] md:leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
