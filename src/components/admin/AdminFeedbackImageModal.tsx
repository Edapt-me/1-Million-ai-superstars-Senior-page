import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ImagePlus } from "lucide-react";
import { createReview, updateReview, type Review } from "@/services/reviews";
import { toast } from "sonner";

interface AdminFeedbackImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingReview?: Review | null;
}

export function AdminFeedbackImageModal({ isOpen, onClose, onSuccess, editingReview }: AdminFeedbackImageModalProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingReview && isOpen) {
      setImageUrl(editingReview.review_image_url || "");
      setName(editingReview.name || "");
      
      // Strip <p> tags for editing if present
      let rawCaption = editingReview.review_text || "";
      if (rawCaption.startsWith("<p>") && rawCaption.endsWith("</p>")) {
        rawCaption = rawCaption.slice(3, -4);
      }
      setCaption(rawCaption);
      
      setIsPublished(editingReview.is_published ?? true);
    } else if (isOpen) {
      // Reset for new
      setImageUrl("");
      setName("");
      setCaption("");
      setIsPublished(true);
    }
  }, [editingReview, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      toast.error("Please provide an image link.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: name.trim() || "Learner",
        review_image_url: imageUrl.trim(),
        review_text: caption.trim() ? `<p>${caption.trim()}</p>` : null,
        is_published: isPublished,
        source: "manual",
        rating: 5,
      };

      if (editingReview) {
        await updateReview(editingReview.id, payload);
        toast.success("Feedback image updated successfully");
      } else {
        await createReview({ ...payload, display_order: 0 });
        toast.success("Feedback image added successfully");
      }
      
      // Reset
      setImageUrl("");
      setName("");
      setCaption("");
      setIsPublished(true);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Image Modal Submission Error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add feedback image. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setImageUrl("");
    setName("");
    setCaption("");
    setIsPublished(true);
    onClose();
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-[15px] outline-none transition focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/15";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h3 className="text-xl font-bold text-foreground">
                {editingReview ? "Edit Feedback Image" : "Add Feedback Image"}
              </h3>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Feedback Image URL (Required)
                  </label>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className={inputCls}
                    placeholder="https://..."
                  />
                  {imageUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center min-h-[120px]">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="max-h-[200px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = ""; // Clear broken image
                          (e.target as HTMLImageElement).alt = "Invalid image URL";
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Learner Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Short Caption (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder="Enter a brief description or caption..."
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 bg-slate-50 border border-border p-3 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">Publish immediately</span>
                      <span className="text-xs text-muted-foreground">Will appear in the public carousel</span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-3 px-6 rounded-full bg-white border border-border text-foreground font-semibold hover:bg-slate-50 transition-all text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 rounded-full text-white font-bold gradient-bg shadow-[0_4px_14px_0_rgba(31,10,119,0.39)] hover:shadow-[0_6px_20px_rgba(31,10,119,0.23)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <ImagePlus className="w-5 h-5" />
                        Save Image
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
