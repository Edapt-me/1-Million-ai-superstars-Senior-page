import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBatchSelection } from "@/contexts/BatchSelectionContext";
import { programConfig } from "@/lib/programConfig";
import { trackEvent } from "@/lib/analytics";
import { Check } from "lucide-react";

export function BatchSelectionModal() {
  const { isModalOpen, closeModal } = useBatchSelection();
  const [loadingBatchId, setLoadingBatchId] = useState<string | null>(null);

  // Use the new batches array from programConfig
  const batches = programConfig.batches;

  // Handle opening the modal
  // Note: tracking "batch_selection_opened" happens when modal opens. We can trigger this via a side effect or when the state changes.
  // We'll track it when the component renders with isModalOpen = true.
  React.useEffect(() => {
    if (isModalOpen) {
      trackEvent("batch_selection_opened");
    }
  }, [isModalOpen]);

  const handleSelectBatch = (batchId: string, checkoutUrl: string) => {
    if (loadingBatchId) return; // Prevent double-clicks

    setLoadingBatchId(batchId);
    
    // Analytics
    if (batchId === "batch-9") {
      trackEvent("batch_9_selected");
      trackEvent("checkout_redirect_batch_9");
    } else if (batchId === "batch-10") {
      trackEvent("batch_10_selected");
      trackEvent("checkout_redirect_batch_10");
    }

    // Open checkout URL in a new tab securely
    window.open(checkoutUrl, "_blank", "noopener,noreferrer");

    // Close the modal and reset loading state after a short delay
    setTimeout(() => {
      setLoadingBatchId(null);
      closeModal();
    }, 500);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="w-[95vw] max-w-2xl rounded-[24px] border-border bg-background p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6 text-center sm:text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight text-[#1F0A77] sm:text-3xl">
            Choose Your Batch
          </DialogTitle>
          <DialogDescription className="text-[15px] sm:text-[17px] text-muted-foreground mt-2">
            Select the batch timing that works best for you.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 sm:gap-6">
          {batches?.map((batch) => (
            <div
              key={batch.id}
              className="flex flex-col rounded-[20px] border border-border/60 bg-white p-5 shadow-[var(--shadow-soft)] transition-all hover:border-primary/30 hover:shadow-[var(--shadow-glow)] sm:p-6"
            >
              <div className="mb-2 text-[18px] font-bold text-foreground">
                {batch.label}
              </div>
              <div className="mb-1 text-[15px] text-muted-foreground font-medium">
                {batch.date}
              </div>
              <div className="mb-6 text-[28px] font-bold tracking-tight text-[#1F0A77]">
                {batch.time}
              </div>

              <div className="mb-6 flex-grow space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[14px] text-muted-foreground/90">
                    Live Interactive Classes
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[14px] text-muted-foreground/90">
                    1 Year Recorded Access
                  </span>
                </div>
              </div>

              {batch.status === "open" && (
                <button
                  onClick={() => handleSelectBatch(batch.id, batch.checkoutUrl)}
                  disabled={loadingBatchId !== null}
                  className="mt-auto flex h-[52px] w-full items-center justify-center rounded-[14px] font-semibold text-white shadow-[0_4px_14px_0_rgba(31,10,119,0.39)] transition-all hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(31,10,119,0.23)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 gradient-bg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {loadingBatchId === batch.id ? "Redirecting..." : `Choose ${batch.time}`}
                </button>
              )}

              {batch.status === "coming-soon" && (
                <button
                  disabled
                  className="mt-auto flex h-[52px] w-full items-center justify-center rounded-[14px] bg-muted/60 font-semibold text-muted-foreground"
                >
                  Coming Soon
                </button>
              )}

              {batch.status === "closed" && (
                <button
                  disabled
                  className="mt-auto flex h-[52px] w-full items-center justify-center rounded-[14px] bg-muted/60 font-semibold text-muted-foreground"
                >
                  Closed
                </button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
