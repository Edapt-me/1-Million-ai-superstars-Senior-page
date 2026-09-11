import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Loader2, CheckCircle2 } from "lucide-react";
import { createReview } from "@/services/reviews";
import { toast } from "sonner";

interface ReviewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewSubmissionModal({ isOpen, onClose }: ReviewSubmissionModalProps) {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !experience.trim()) {
      toast.error("Please provide both your name and your experience.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        name: name.trim(),
        review_text: `<p>${experience.trim().replace(/\n/g, '<br/>')}</p>`,
        rating,
        source: "manual",
        is_published: false, // Must be approved by admin
        display_order: 0,
      });
      setIsSuccess(true);
      // Reset form fields
      setName("");
      setExperience("");
      setRating(5);
      
      // Auto close after 3 seconds on success
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setName("");
    setExperience("");
    setRating(5);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={resetAndClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <h3 className="text-2xl font-bold text-foreground">Share Your Experience</h3>
              <button
                onClick={resetAndClose}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Thank you!</h4>
                  <p className="text-muted-foreground">
                    Your experience has been submitted successfully and is pending review.
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    We'd love to hear about your experience with the 1 Million AI Superstars Program.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-foreground mb-1.5">
                        Your Experience
                      </label>
                      <textarea
                        id="experience"
                        required
                        rows={5}
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                        placeholder="Tell us about your experience with the 1 Million AI Superstars Program..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Rating (Optional)
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="p-1 -ml-1 transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            onClick={() => setRating(star)}
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= (hoveredRating || rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-transparent text-slate-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-full text-white font-bold gradient-bg shadow-[0_4px_14px_0_rgba(31,10,119,0.39)] hover:shadow-[0_6px_20px_rgba(31,10,119,0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Review"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
