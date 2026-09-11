import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { Review } from "@/services/reviews";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface FeaturedTestimonialsProps {
  reviews: Review[];
}

export function FeaturedTestimonials({ reviews }: FeaturedTestimonialsProps) {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Find reviews marked as featured from the backend
  const featuredReviews = useMemo(() => {
    return [...reviews]
      .filter((r) => r.source === "featured")
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  }, [reviews]);

  // Ensure there are enough cloned items for Embla's circular loop to run smoothly without visual jumps
  const displayReviews = useMemo(() => {
    if (featuredReviews.length === 0) return [];
    let items = [...featuredReviews];
    while (items.length < 8) {
      items = [...items, ...featuredReviews];
    }
    return items;
  }, [featuredReviews]);

  // Autoplay: 2.6s interval, pauses on touch/mouse and resumes automatically
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 2600,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Pause autoplay when the read more modal is opened
  useEffect(() => {
    if (!api) return;
    const autoplayPlugin = api.plugins()?.autoplay;
    if (!autoplayPlugin) return;

    if (selectedReview) {
      autoplayPlugin.stop();
    } else {
      autoplayPlugin.play();
    }
  }, [selectedReview, api]);

  const activeDot =
    featuredReviews.length > 0
      ? ((current % featuredReviews.length) + featuredReviews.length) %
        featuredReviews.length
      : 0;

  const scrollToDot = useCallback(
    (targetDotIndex: number) => {
      if (!api || featuredReviews.length === 0) return;
      const currentSnap = api.selectedScrollSnap();
      const currentMod =
        ((currentSnap % featuredReviews.length) + featuredReviews.length) %
        featuredReviews.length;
      const diff = targetDotIndex - currentMod;
      api.scrollTo(currentSnap + diff);
    },
    [api, featuredReviews.length]
  );

  if (featuredReviews.length === 0) return null;

  const MAX_CHARS = 160;

  return (
    <section className="py-16 lg:py-24 bg-primary/[0.02] overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
          >
            Stories That Inspire
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            A few learner experiences that capture the impact of the program.
          </motion.p>
        </div>
      </div>

      {/* Infinite Circular Carousel Container */}
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-8">
        <Carousel
          setApi={setApi}
          plugins={[autoplay]}
          opts={{
            loop: true,
            align: "center",
            duration: 25, // Fast, natural transition (~0.4s)
            skipSnaps: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-6">
            {displayReviews.map((review, i) => {
              const reviewText = review.review_text || "";
              const isLongText = reviewText.length > MAX_CHARS;
              const displayText = isLongText
                ? reviewText.substring(0, MAX_CHARS).trim() + "..."
                : reviewText;

              return (
                <CarouselItem
                  key={`${review.id}-slide-${i}`}
                  className="pl-3 sm:pl-4 md:pl-6 basis-[86%] sm:basis-[62%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <div className="relative flex flex-col w-full h-[360px] sm:h-[390px] md:h-[400px] bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 md:p-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_-12px_rgba(0,0,0,0.1)] transition-shadow duration-300 border border-border/50 select-none">
                    <Quote className="absolute top-5 sm:top-8 left-5 sm:left-8 h-7 sm:h-10 w-7 sm:w-10 text-primary/10 rotate-180 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div
                        className="flex items-center gap-1 mb-3 sm:mb-5"
                        aria-label="5 out of 5 stars"
                      >
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400"
                            aria-hidden="true"
                          />
                        ))}
                      </div>

                      {/* Fixed Height Content Area */}
                      <div className="flex-1 min-h-0 flex flex-col mb-3 sm:mb-5">
                        <div className="flex-1 overflow-hidden relative">
                          <div
                            className="prose prose-sm sm:prose-base text-foreground/90 font-medium leading-relaxed italic line-clamp-6 sm:line-clamp-none"
                            dangerouslySetInnerHTML={{
                              __html: `"${displayText}"`,
                            }}
                          />
                        </div>

                        {isLongText && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReview(review);
                            }}
                            className="text-primary font-semibold text-xs sm:text-sm mt-2 hover:underline text-left inline-block self-start shrink-0 cursor-pointer"
                          >
                            Read More
                          </button>
                        )}
                      </div>

                      {/* Footer - Pinned to bottom */}
                      <div className="flex items-center gap-3 sm:gap-4 mt-auto pt-3 sm:pt-4 border-t border-border/50 shrink-0">
                        {review.profile_image_url ? (
                          <img
                            src={review.profile_image_url}
                            alt={review.name}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-border/50 shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-base sm:text-lg border border-primary/20 shrink-0">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-foreground text-sm sm:text-base truncate">
                            {review.name}
                          </h3>
                          {review.role && (
                            <p className="text-muted-foreground text-xs sm:text-sm truncate">
                              {review.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>

        {/* Elegant Pagination Dots */}
        {featuredReviews.length > 1 && (
          <div
            className="flex justify-center items-center gap-2 mt-8"
            aria-label="Testimonial slides navigation"
          >
            {featuredReviews.map((_, index) => {
              const isActive = index === activeDot;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollToDot(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isActive
                      ? "w-8 bg-primary"
                      : "w-2.5 bg-primary/20 hover:bg-primary/40"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                />
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedReview}
        onOpenChange={(open) => !open && setSelectedReview(null)}
      >
        <DialogContent className="max-w-md bg-white rounded-3xl p-8 max-h-[85vh] overflow-y-auto">
          <DialogTitle className="sr-only">
            Testimonial by {selectedReview?.name}
          </DialogTitle>
          {selectedReview && (
            <div className="relative flex flex-col">
              <Quote className="absolute -top-4 -left-4 h-12 w-12 text-primary/5 rotate-180" />

              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-5 w-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <div
                  className="prose prose-lg prose-slate text-foreground/90 font-medium leading-relaxed italic mb-10"
                  dangerouslySetInnerHTML={{
                    __html: `"${selectedReview.review_text}"`,
                  }}
                />

                <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                  {selectedReview.profile_image_url ? (
                    <img
                      src={selectedReview.profile_image_url}
                      alt={selectedReview.name}
                      className="h-14 w-14 rounded-full object-cover border border-border/50"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/20">
                      {selectedReview.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {selectedReview.name}
                    </h3>
                    {selectedReview.role && (
                      <p className="text-muted-foreground text-sm">
                        {selectedReview.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
