import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import mediaProductionThumb from "@/assets/courses/media-production.png";
import excelMasteryThumb from "@/assets/courses/excel-mastery.png";
import buildDigitalProductsThumb from "@/assets/courses/build-digital-products.png";

export type Course = {
  id: string;
  thumbnail: string;
  programName: string;
  redirectUrl: string;
};

export const COURSES: Course[] = [
  {
    id: "ai-media-production",
    thumbnail: mediaProductionThumb,
    programName: "Master AI-Powered Media Production",
    redirectUrl: "https://www.edapt.me/master-ai-powered-media-production",
  },
  {
    id: "ai-excel-mastery",
    thumbnail: excelMasteryThumb,
    programName: "Master AI-Powered Excel",
    redirectUrl: "https://www.edapt.me/ai-powered-excel-mastery-program",
  },
  {
    id: "build-digital-products",
    thumbnail: buildDigitalProductsThumb,
    programName: "Build Digital Products",
    redirectUrl: "https://www.edapt.me/ai-powered-digital-product-building-program",
  },
];

export function ExploreCoursesSection() {
  return (
    <section
      id="explore-courses"
      className="relative py-14 sm:py-16 md:py-24 bg-gradient-to-b from-[#f7f5fd] via-white to-white"
    >
      <div className="mx-auto max-w-[1400px] xl:max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="mx-auto text-center max-w-2xl mb-8 md:mb-12">
          <h2 className="text-[28px] leading-[1.15] sm:text-[32px] md:text-[40px] lg:text-[44px] font-semibold tracking-tight">
            <span className="gradient-text">Explore More Courses</span>
          </h2>
        </div>

        {/* Desktop & Tablet Grid Layout (>= 768px: 3 equal columns for the 3 courses) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {COURSES.map((course, index) => (
            <DesktopCourseCard key={course.id} course={course} index={index} />
          ))}
        </div>

        {/* Mobile Vertical Stacked Scroll Deck (< 768px) */}
        <div className="md:hidden relative pb-10">
          {COURSES.map((course, index) => (
            <MobileStackedCard
              key={course.id}
              course={course}
              index={index}
              total={COURSES.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DesktopCourseCard({
  course,
  index,
}: {
  course: Course;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="group glass-card gradient-border-hover flex flex-col h-full rounded-[28px] border border-border/60 bg-white p-5 sm:p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_20px_40px_-15px_rgba(31,10,119,0.14)] transition-all duration-300"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary/60">
        <img
          src={course.thumbnail}
          alt={course.programName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-1 pt-5">
        <h3 className="text-[19px] lg:text-[20px] font-bold text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors">
          {course.programName}
        </h3>

        <div className="mt-auto pt-6">
          <a
            href={course.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Explore ${course.programName}`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full gradient-bg px-6 text-[15px] font-semibold text-white shadow-md hover:shadow-lg hover:brightness-110 active:scale-[0.99] transition-all"
          >
            <span>Explore</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function MobileStackedCard({
  course,
  index,
  total,
}: {
  course: Course;
  index: number;
  total: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress as this card approaches and passes the top sticky offset
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Layered depth effect: As the next card moves over this card, it scales down and dims into the background
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 0.85, 0.65]);

  const isLast = index === total - 1;
  // Offset sticky position slightly so previous card edges peek out like a deck
  const stickyTop = 80 + index * 14;

  return (
    <div
      ref={containerRef}
      className="sticky mb-6 pb-2 transition-all motion-reduce:static motion-reduce:transform-none"
      style={{
        top: `${stickyTop}px`,
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{
          scale: isLast ? 1 : scale,
          opacity: isLast ? 1 : opacity,
        }}
        className="glass-card rounded-[26px] border border-border/70 bg-white p-5 shadow-[0_-4px_24px_-6px_rgba(31,10,119,0.1),0_12px_36px_-10px_rgba(31,10,119,0.12)] overflow-hidden flex flex-col will-change-transform select-none"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-secondary/60">
          <img
            src={course.thumbnail}
            alt={course.programName}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex flex-col flex-1 pt-4">
          <h3 className="text-[18px] font-bold text-foreground leading-snug tracking-tight">
            {course.programName}
          </h3>

          <div className="mt-5">
            <a
              href={course.redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Explore ${course.programName}`}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full gradient-bg px-6 text-[15px] font-semibold text-white shadow-md active:scale-[0.98] transition-all"
            >
              <span>Explore</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
