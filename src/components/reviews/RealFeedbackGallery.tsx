import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Review } from "@/services/reviews";

export function RealFeedbackGallery({ reviews }: { reviews: Review[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "center",
    loop: true,
    dragFree: true,
  }, [
    Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })
  ]);

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const handleClose = useCallback(() => {
    if (window.history.state?.lightbox) {
      window.history.back();
    } else {
      setSelectedImage(null);
    }
  }, []);

  useEffect(() => {
    if (selectedImage) {
      window.history.pushState({ lightbox: true }, '');
    }
    const handlePopState = () => {
      setSelectedImage(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Filter only reviews that have a review_image_url
  const feedbackImages = reviews.filter((r) => r.review_image_url);

  if (feedbackImages.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-2 lg:py-4 bg-slate-50 relative z-10 border-t border-border/50 overflow-hidden">
      <div className="mx-auto max-w-[100vw] sm:max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Background container area */}
        <div className="bg-slate-100/50 rounded-2xl md:rounded-[32px] py-2 sm:py-4 px-2 sm:px-4 md:px-8 lg:px-12 border border-slate-200/60 shadow-sm relative overflow-hidden">
          
          <div className="relative w-full">
            {/* Subtle fade edges for the carousel */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-slate-100/50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-slate-100/50 to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden px-2 sm:px-4" ref={emblaRef}>
              <div className="flex -ml-4 sm:-ml-6 md:-ml-8 touch-pan-y items-center py-2">
                {feedbackImages.map((review, idx) => {
                  return (
                    <div 
                      key={review.id} 
                      className="flex-[0_0_auto] min-w-0 pl-4 sm:pl-6 md:pl-8 flex justify-center"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                        className="relative group cursor-pointer overflow-hidden rounded-[20px] md:rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgb(31,10,119,0.15)] transition-all duration-500 hover:-translate-y-2 bg-white"
                        onClick={() => setSelectedImage(review.review_image_url!)}
                      >
                        <img
                          src={review.review_image_url!}
                          alt={`Feedback from ${review.name || 'Learner'}`}
                          className="w-auto h-auto max-w-[75vw] sm:max-w-[70vw] md:max-w-[50vw] lg:max-w-[40vw] max-h-[180px] sm:max-h-[200px] md:max-h-[250px] object-contain bg-white"
                          loading="lazy"
                        />
                        
                        {/* Hover overlay with modern blur */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
                          <div className="bg-white text-primary p-4 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-300 ease-out flex flex-col items-center gap-1">
                            <ZoomIn className="h-6 w-6" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">View Full</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modern Carousel Controls (Floating) */}
            <div className="hidden md:flex justify-center items-center gap-4 mt-2 md:mt-4 relative z-20">
              <button
                onClick={scrollPrev}
                className="p-3 md:p-4 rounded-full bg-white/90 backdrop-blur border border-slate-200 text-slate-700 shadow-sm hover:shadow-md hover:bg-white hover:text-primary transition-all active:scale-95 group"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={scrollNext}
                className="p-3 md:p-4 rounded-full bg-white/90 backdrop-blur border border-slate-200 text-slate-700 shadow-sm hover:shadow-md hover:bg-white hover:text-primary transition-all active:scale-95 group"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Modern Lightbox Modal */}
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 md:p-8"
          onClick={handleClose}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/60 hover:bg-black/80 border border-white/20 p-3 md:p-4 rounded-full text-white transition-colors z-[100000] backdrop-blur-md shadow-2xl"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6 md:h-8 md:w-8" />
          </button>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-[95vw] max-h-[95vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Feedback expanded view"
              className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
