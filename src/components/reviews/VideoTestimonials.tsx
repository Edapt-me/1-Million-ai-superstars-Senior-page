import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";
import type { Review } from "@/services/reviews";
import { parseVideoId } from "@/services/media";

interface VideoTestimonialsProps {
  reviews: Review[];
}

export function VideoTestimonials({ reviews }: VideoTestimonialsProps) {
  const videoReviews = reviews.filter((r) => r.video_url && parseVideoId(r.video_url));
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setActiveVideo(null);
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [activeVideo]);

  if (videoReviews.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4"
          >
            Hear It From Our Learners
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Go beyond the ratings and hear directly from learners about their experience.
          </motion.p>
        </div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {videoReviews.map((review, i) => {
            const videoId = parseVideoId(review.video_url!)!;
            // Using standard YouTube thumbnail URL structure
            const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            const fallbackThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-lg transition-all duration-300"
                onClick={() => setActiveVideo(videoId)}
              >
                {/* Cinematic Thumbnail */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={thumbnailUrl}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackThumbnailUrl;
                    }}
                    alt={`Video review by ${review.name}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                      <Play className="h-6 w-6 text-white ml-1 fill-white" />
                    </div>
                  </div>
                </div>

                <div className="p-5 flex items-center gap-4">
                  {review.profile_image_url ? (
                    <img
                      src={review.profile_image_url}
                      alt={review.name}
                      className="h-10 w-10 rounded-full object-cover border border-border/50 shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shrink-0">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground text-[15px] group-hover:text-primary transition-colors">
                      {review.name}
                    </h3>
                    {review.role && (
                      <p className="text-muted-foreground text-[13px]">{review.role}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setActiveVideo(null)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl z-10"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-20 h-10 w-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
              
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="Video testimonial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
