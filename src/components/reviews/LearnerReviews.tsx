import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import { Star, Quote, X } from "lucide-react";
import type { Review } from "@/services/reviews";

interface LearnerReviewsProps {
  reviews: Review[];
}

export function LearnerReviews({ reviews }: LearnerReviewsProps) {
  const [filter, setFilter] = useState<"All" | "5 Star" | "4 Star">("All");
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pageSize = isMobile ? 3 : 6;
  const prevPageSizeRef = useRef(pageSize);

  useEffect(() => {
    if (prevPageSizeRef.current !== pageSize) {
      const firstVisibleIndex = currentPage * prevPageSizeRef.current;
      const newPage = Math.floor(firstVisibleIndex / pageSize);
      setCurrentPage(newPage);
      prevPageSizeRef.current = pageSize;
    }
  }, [pageSize, currentPage]);

  const filteredReviews = useMemo(() => {
    // Filter out image feedbacks and featured testimonials
    let filtered = reviews.filter(
      (r) => !r.review_image_url && r.source !== "featured"
    );

    if (filter === "5 Star") {
      filtered = filtered.filter((r) => r.rating === 5);
    } else if (filter === "4 Star") {
      filtered = filtered.filter((r) => r.rating === 4);
    }
    return filtered;
  }, [reviews, filter]);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleReviews = filteredReviews.slice(startIndex, endIndex);
  const hasMore = endIndex < filteredReviews.length;

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
    if (sectionRef.current) {
      const yOffset = -90;
      const y =
        sectionRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (reviews.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">No Reviews Yet</h2>
          <p className="text-muted-foreground">
            Learner experiences will appear here soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-white relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={sectionRef} className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
          >
            What Our Learners Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Real experiences from learners who have joined the 1 Million AI Superstars journey.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
          {(["All", "5 Star", "4 Star"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(0);
              }}
              className={`px-5 py-2 rounded-full text-[15px] font-medium transition-all duration-300 cursor-pointer ${
                filter === f
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-slate-100 text-foreground/80 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid with smooth transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${filter}-${currentPage}-${pageSize}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch"
          >
            {visibleReviews.map((review, i) => (
              <ReviewCard
                key={review.id}
                review={review}
                index={i}
                onReadMore={() => setSelectedReview(review)}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No reviews match the selected filter.
            </p>
          </div>
        )}

        {/* Show More Button */}
        {hasMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 flex justify-center"
          >
            <button
              type="button"
              onClick={handleLoadMore}
              className="min-h-[48px] px-8 py-3 rounded-full border border-primary/20 bg-white text-primary font-medium hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 cursor-pointer text-base"
            >
              Show More
            </button>
          </motion.div>
        )}
      </div>

      {/* Read More Modal */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedReview(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>

              <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                <div className="flex items-center gap-4 mb-6">
                  {selectedReview.profile_image_url ? (
                    <img
                      src={selectedReview.profile_image_url}
                      alt={selectedReview.name}
                      className="h-14 w-14 rounded-full object-cover border border-border/50 shrink-0"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 text-primary font-bold text-xl">
                      {selectedReview.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">
                      {selectedReview.name}
                    </h3>
                    {selectedReview.role && (
                      <p className="text-sm text-muted-foreground">
                        {selectedReview.role}
                      </p>
                    )}
                  </div>
                </div>

                {selectedReview.rating && (
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-5 w-5 ${
                          idx < selectedReview.rating!
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                )}

                <div
                  className="prose prose-slate max-w-none text-foreground/90 leading-relaxed text-[16px]"
                  dangerouslySetInnerHTML={{
                    __html: selectedReview.review_text || "",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ReviewCard({
  review,
  index,
  onReadMore,
}: {
  review: Review;
  index: number;
  onReadMore: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setIsTruncated(
        contentRef.current.scrollHeight > contentRef.current.clientHeight
      );
    }
  }, [review.review_text]);

  return (
    <div className="group flex flex-col h-full overflow-hidden rounded-[24px] border border-border/50 bg-white shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(31,10,119,0.1)] hover:border-primary/20">
      <div className="p-6 md:p-8 flex flex-col flex-1">
        {/* Header: User Info & Stars */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            {review.profile_image_url ? (
              <img
                src={review.profile_image_url}
                alt={review.name}
                className="h-12 w-12 rounded-full object-cover border border-border/50 shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 text-primary font-bold text-lg">
                {review.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-foreground leading-tight flex items-center gap-2 text-[16px]">
                {review.name}
              </h3>
              {review.role && (
                <p className="text-[14px] text-muted-foreground mt-0.5">
                  {review.role}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stars */}
        {review.rating && (
          <div
            className="flex items-center gap-1 mb-5"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`h-4 w-4 ${
                  idx < review.rating!
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        )}

        {/* Review Text */}
        {review.review_text && (
          <div className="relative mb-6 flex-1 flex flex-col items-start">
            <Quote className="absolute -left-2 -top-2 h-8 w-8 text-primary/10 -z-10 rotate-180 pointer-events-none" />
            <div
              ref={contentRef}
              className="prose prose-sm prose-slate max-w-none text-foreground/80 z-10 relative leading-[1.7] text-[15px] line-clamp-4"
              dangerouslySetInnerHTML={{ __html: review.review_text }}
            />
            {isTruncated && (
              <button
                type="button"
                onClick={onReadMore}
                className="mt-2 text-sm font-semibold text-primary hover:underline hover:text-primary/80 transition-colors cursor-pointer"
              >
                Read more
              </button>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-border/40 text-[13px] text-muted-foreground font-medium">
          1 Million AI Superstars
        </div>
      </div>
    </div>
  );
}
