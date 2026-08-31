import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Review = Tables<"reviews">;
export type ReviewInsert = TablesInsert<"reviews">;
export type ReviewUpdate = TablesUpdate<"reviews">;

export async function getPublishedReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("review_date", { ascending: false });

  if (error) {
    console.error("Error fetching published reviews:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function getAllReviews(): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all reviews:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function createReview(review: ReviewInsert): Promise<Review> {
  const { data, error } = await supabase.from("reviews").insert(review).select().single();

  if (error) {
    console.error("Error creating review:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateReview(id: string, review: ReviewUpdate): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .update(review)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating review:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function deleteReview(id: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    console.error("Error deleting review:", error);
    throw new Error(error.message);
  }
}

export async function publishReview(id: string, is_published: boolean): Promise<Review> {
  return updateReview(id, { is_published });
}

export async function reorderReviews(
  updates: { id: string; display_order: number }[],
): Promise<void> {
  // Supabase JS doesn't support bulk update easily out of the box with .update() array
  // So we run them sequentially for now, or via a custom RPC if performance is an issue.
  // For small numbers of reviews, sequential update is acceptable.
  const promises = updates.map((update) =>
    supabase.from("reviews").update({ display_order: update.display_order }).eq("id", update.id),
  );

  const results = await Promise.all(promises);
  const errors = results.filter((res) => res.error);
  if (errors.length > 0) {
    console.error("Errors reordering reviews:", errors);
    throw new Error("Failed to reorder some reviews");
  }
}
