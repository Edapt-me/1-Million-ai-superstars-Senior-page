import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPublishedReviews } from "@/services/reviews";
import { motion } from "framer-motion";
import { Star, Loader2, Quote, PlayCircle } from "lucide-react";
import { parseVideoId } from "@/services/media";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Student Reviews & Testimonials | 1 Million AI Superstars" },
      {
        name: "description",
        content:
          "Read reviews and testimonials from students and learners who have attended our programs and workshops.",
      },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const {
    data: reviews = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["published-reviews"],
    queryFn: getPublishedReviews,
  });

  return (
    <div className="min-h-screen bg-background pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6"
          >
            Student Reviews & <span className="text-primary">Testimonials</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Read what our incredible community has to say about their journey to mastering AI with
            us.
          </motion.p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64 flex-col gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 flex-col gap-4 text-center">
            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
              <span className="text-xl">!</span>
            </div>
            <p className="text-foreground font-semibold">Failed to load reviews.</p>
            <p className="text-muted-foreground text-sm max-w-md">
              Please try refreshing the page. If the problem persists, contact support.
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground text-lg">No reviews have been published yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => {
              const videoId = review.video_url ? parseVideoId(review.video_url) : null;

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md h-full"
                >
                  <div className="p-6 flex flex-col flex-1">
                    {/* Header: User Info & Stars */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {review.profile_image_url ? (
                          <img
                            src={review.profile_image_url}
                            alt={review.name}
                            className="h-12 w-12 rounded-full object-cover border border-border shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0 text-primary font-bold text-lg">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-foreground leading-tight flex items-center gap-2">
                            {review.name}
                            {review.source === "google" && (
                              <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-sm">
                                Google
                              </span>
                            )}
                          </h3>
                          {review.role && (
                            <p className="text-[13px] text-muted-foreground mt-0.5">
                              {review.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stars */}
                    {review.rating && (
                      <div className="flex items-center gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star
                            key={idx}
                            className={`h-4 w-4 ${
                              idx < review.rating!
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Review Text */}
                    {review.review_text && (
                      <div className="relative mb-6 flex-1">
                        <Quote className="absolute -left-2 -top-2 h-8 w-8 text-secondary -z-10 rotate-180 opacity-50" />
                        <div
                          className="prose prose-sm prose-slate max-w-none text-muted-foreground z-10 relative leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: review.review_text }}
                        />
                      </div>
                    )}

                    {/* Media Attachments */}
                    {(videoId || review.review_image_url) && (
                      <div className="mt-auto pt-4 border-t border-border/50 space-y-4">
                        {videoId && (
                          <div className="aspect-video w-full overflow-hidden rounded-xl bg-black relative">
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                              title={`Review by ${review.name}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full border-0"
                            />
                          </div>
                        )}
                        {review.review_image_url && !videoId && (
                          <div className="rounded-xl overflow-hidden border border-border">
                            <img
                              src={review.review_image_url}
                              alt="Review Screenshot"
                              loading="lazy"
                              className="w-full h-auto object-cover cursor-pointer hover:opacity-95 transition-opacity"
                              onClick={() => window.open(review.review_image_url!, "_blank")}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
