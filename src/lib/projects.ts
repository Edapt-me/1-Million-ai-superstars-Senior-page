import { supabase } from "@/integrations/supabase/client";

/** Row shape of the `projects` table (URL-only media — no binaries stored). */
export type ProjectRow = {
  id: string;
  title: string;
  student_name: string;
  description: string;
  category: string;
  thumbnail_url: string | null;
  gallery_urls: string[];
  youtube_url: string | null;
  youtube_video_id: string | null;
  live_url: string | null;
  github_url: string | null;
  technologies: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProjectInput = Omit<ProjectRow, "id" | "created_at" | "updated_at">;

const TABLE = "projects";

function normalize(row: Record<string, unknown>): ProjectRow {
  const gallery = row.gallery_urls;
  return {
    ...(row as ProjectRow),
    gallery_urls: Array.isArray(gallery) ? (gallery as string[]) : [],
    technologies: Array.isArray(row.technologies) ? (row.technologies as string[]) : [],
  };
}

/** Public listing — RLS exposes published rows only. */
export async function listPublishedProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

/** Admin listing — RLS exposes everything to admins only. */
export async function listAllProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalize);
}

export async function createProject(input: ProjectInput) {
  const { error } = await supabase.from(TABLE).insert(input as never);
  if (error) throw new Error(error.message);
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const { error } = await supabase
    .from(TABLE)
    .update(input as never)
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function isCurrentUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  } as never);
  if (error) return false;
  return Boolean(data);
}
