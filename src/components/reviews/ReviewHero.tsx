import { motion } from "framer-motion";

export function ReviewHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-8 lg:pt-32 lg:pb-12">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/5 rounded-[100%] blur-[120px] opacity-70" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-violet-400/10 rounded-full blur-[100px] opacity-50" />
        <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.15]"
        >
          Real Learners.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600">
            Real Experiences.
          </span>{" "}
          Real Impact.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Discover what learners are saying about their experience with the 1 Million AI Superstars Program.
        </motion.p>
      </div>
    </section>
  );
}
