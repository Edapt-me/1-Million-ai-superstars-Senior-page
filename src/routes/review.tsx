import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getPublishedReviews } from "@/services/reviews";
import { getWebsiteSettings } from "@/lib/cms";
import { programConfig } from "@/lib/programConfig";

import { ReviewHero } from "@/components/reviews/ReviewHero";
import { RealFeedbackGallery } from "@/components/reviews/RealFeedbackGallery";
import { ReviewStats } from "@/components/reviews/ReviewStats";
import { LearnerReviews } from "@/components/reviews/LearnerReviews";
import { FeaturedTestimonials } from "@/components/reviews/FeaturedTestimonials";
import { VideoTestimonials } from "@/components/reviews/VideoTestimonials";
import { ReviewCTA } from "@/components/reviews/ReviewCTA";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Reviews & Testimonials | 1 Million AI Superstars" },
      {
        name: "description",
        content:
          "Read real learner reviews, stories, and video testimonials from the 1 Million AI Superstars community.",
      },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useQuery({
    queryKey: ["published-reviews"],
    queryFn: getPublishedReviews,
  });

  const { data: settings } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
  });

  const registrationUrl = settings?.course_registration_link || programConfig.registrationUrl;

  return (
    <div className="min-h-screen bg-background">
      <ReviewHero />
      
      {!isReviewsLoading && !reviewsError && (
        <RealFeedbackGallery reviews={reviews} />
      )}

      <ReviewStats 
        reviews={reviews} 
        isLoading={isReviewsLoading} 
        error={reviewsError}
      />
      
      {!isReviewsLoading && !reviewsError && reviews.length > 0 && (
        <>
          <FeaturedTestimonials reviews={reviews} />
          <LearnerReviews reviews={reviews} />
          <VideoTestimonials reviews={reviews} />
        </>
      )}

      {isReviewsLoading && (
        <div className="py-24 text-center text-muted-foreground animate-pulse">
          Loading more reviews...
        </div>
      )}

      <ReviewCTA registrationUrl={registrationUrl} />
    </div>
  );
}
