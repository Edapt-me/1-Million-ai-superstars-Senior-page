import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { programConfig } from "@/lib/programConfig";
import { ReviewSubmissionModal } from "./ReviewSubmissionModal";

export function ReviewCTA({ registrationUrl }: { registrationUrl?: string }) {
  const regUrl = registrationUrl || programConfig.registrationUrl;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Testimonial Contribution CTA */}
      <section className="py-20 lg:py-24 bg-primary/[0.03] border-t border-border/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
          >
            Have You Been Part of the Journey?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground mb-10"
          >
            Your experience can inspire the next generation of AI Superstars.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-primary/20 text-primary font-semibold shadow-sm hover:bg-primary/5 hover:border-primary/40 transition-all text-center"
            >
              Share Your Experience
            </button>
          </motion.div>
        </div>
      </section>

      {/* Final Program CTA */}
      <section className="py-20 lg:py-24 bg-white border-t border-border/50 relative overflow-hidden">
        {/* Soft Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6"
          >
            Ready to Become an AI Superstar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground mb-10"
          >
            Join a growing community of learners building real-world AI skills.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={regUrl}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-white font-bold shadow-[0_8px_20px_-8px_rgba(31,10,119,0.5)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(31,10,119,0.6)] gradient-bg text-center text-lg"
            >
              Explore the Program
            </a>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-border text-foreground font-semibold shadow-sm hover:bg-slate-50 transition-all text-center text-lg"
            >
              Talk to Us
            </Link>
          </motion.div>
        </div>
      </section>

      <ReviewSubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
