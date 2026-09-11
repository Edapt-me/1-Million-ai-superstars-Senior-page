import { motion } from "framer-motion";
import { Star, Users, MessageSquare, Award } from "lucide-react";
import type { Review } from "@/services/reviews";

interface ReviewStatsProps {
  reviews: Review[];
  isLoading: boolean;
  error: unknown;
  learnerCount?: string;
}

export function ReviewStats({ reviews, isLoading, error, learnerCount }: ReviewStatsProps) {
  if (error) {
    return (
      <div className="py-8 bg-white border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
          Review statistics are temporarily unavailable.
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  if (isLoading) {
    return (
      <div className="relative mt-4 sm:mt-6 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-border/40 p-6 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] animate-pulse"
            >
              <div className="h-8 w-24 bg-primary/10 rounded-lg mb-2"></div>
              <div className="h-4 w-16 bg-muted rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate statistics dynamically
  const totalReviews = reviews.length;
  
  const reviewsWithRating = reviews.filter((r) => r.rating != null && r.rating > 0);
  const averageRating =
    reviewsWithRating.length > 0
      ? (
          reviewsWithRating.reduce((acc, r) => acc + (r.rating || 0), 0) /
          reviewsWithRating.length
        ).toFixed(1)
      : "0.0";

  const stats = [
    {
      value: `${totalReviews}+`,
      label: "Learner Reviews",
      icon: MessageSquare,
      subValue: "★ Reviews",
    },
    {
      value: `${averageRating}/5`,
      label: "Average Rating",
      icon: Star,
      subValue: "★★★★★",
    },
  ];

  return (
    <div className="relative mt-4 sm:mt-6 z-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 gap-4 md:gap-6"
      >
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group bg-white rounded-3xl border border-border/40 p-6 md:p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-12px_rgba(31,10,119,0.12)] hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center gap-1">
                <Icon className="h-6 w-6 text-primary/60 mb-2 opacity-50 group-hover:scale-110 group-hover:text-primary transition-all duration-300" />
                <span className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-primary/80 tracking-wide">
                  {stat.subValue}
                </span>
                <span className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
