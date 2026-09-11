import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function GoogleReviews() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load the SociableKIT script only when this component mounts
    const scriptId = "sociablekit-script-google-reviews";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://widgets.sociablekit.com/google-reviews/widget.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
          >
            Google Reviews
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            What our learners are saying on Google
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-5xl"
        >
          <div 
            ref={containerRef}
            className="rounded-3xl border border-border bg-white shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] overflow-hidden w-full p-4 md:p-8"
            style={{ minHeight: "500px" }}
          >
            <div className="sk-ww-google-reviews" data-embed-id="1412970"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
