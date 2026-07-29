import { supabase } from "@/integrations/supabase/client";

export type WebsiteSettings = {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_badge: string;
  hero_image: string;
  hero_primary_button_text: string;
  hero_secondary_button_text: string;
  hero_trust_counter: string;
  course_batch_name: string;
  course_start_date: string;
  course_duration: string;
  course_registration_link: string;
  course_fee: string;
  course_offer_price: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
  social_linkedin: string;
  created_at: string;
  updated_at: string;
};

export type CurriculumModule = {
  id: string;
  title: string;
  description: string;
  week_number: number;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AITool = {
  id: string;
  tool_name: string;
  tool_logo: string;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type CurriculumInput = Omit<CurriculumModule, "id" | "created_at" | "updated_at">;
export type FAQInput = Omit<FAQ, "id" | "created_at" | "updated_at">;
export type SettingsInput = Omit<WebsiteSettings, "id" | "created_at" | "updated_at">;
export type AIToolInput = Omit<AITool, "id" | "created_at" | "updated_at">;

export async function getWebsiteSettings(): Promise<WebsiteSettings | null> {
  const { data, error } = await supabase.from("website_settings").select("*").eq("id", 1).single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching website settings:", error);
    return null;
  }
  return data;
}

export async function updateWebsiteSettings(input: Partial<SettingsInput>) {
  const { error } = await supabase
    .from("website_settings")
    .update(input as never)
    .eq("id", 1);
  if (error) throw new Error(error.message);
}

export async function getPublishedCurriculum(): Promise<CurriculumModule[]> {
  const { data, error } = await supabase
    .from("curriculum")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });
  if (error) {
    console.error("Error fetching curriculum:", error);
    return [];
  }
  return data || [];
}

export async function getAllCurriculum(): Promise<CurriculumModule[]> {
  const { data, error } = await supabase
    .from("curriculum")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createCurriculum(input: CurriculumInput) {
  const { error } = await supabase.from("curriculum").insert(input as never);
  if (error) throw new Error(error.message);
}

export async function updateCurriculum(id: string, input: Partial<CurriculumInput>) {
  const { error } = await supabase
    .from("curriculum")
    .update(input as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCurriculum(id: string) {
  const { error } = await supabase.from("curriculum").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getPublishedFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });
  if (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
  return data || [];
}

export async function getAllFAQs(): Promise<FAQ[]> {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("order_index", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createFAQ(input: FAQInput) {
  const { error } = await supabase.from("faqs").insert(input as never);
  if (error) throw new Error(error.message);
}

export async function updateFAQ(id: string, input: Partial<FAQInput>) {
  const { error } = await supabase
    .from("faqs")
    .update(input as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteFAQ(id: string) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getPublishedAITools(): Promise<AITool[]> {
  const { data, error } = await supabase
    .from("ai_tools")
    .select("*")
    .eq("published", true)
    .order("display_order", { ascending: true });
  if (error) {
    console.error("Error fetching AI tools:", error);
    return [];
  }
  return data || [];
}

export async function getAllAITools(): Promise<AITool[]> {
  const { data, error } = await supabase
    .from("ai_tools")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createAITool(input: AIToolInput) {
  const { error } = await supabase.from("ai_tools").insert(input as never);
  if (error) throw new Error(error.message);
}

export async function updateAITool(id: string, input: Partial<AIToolInput>) {
  const { error } = await supabase
    .from("ai_tools")
    .update(input as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteAITool(id: string) {
  const { error } = await supabase.from("ai_tools").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
