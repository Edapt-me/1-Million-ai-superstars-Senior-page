import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  listAllProjects,
  updateProject,
  type ProjectInput,
  type ProjectRow,
} from "@/lib/projects";
import { isImageUploadConfigured, parseVideoId, uploadImage, uploadImages } from "@/services/media";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

const CATEGORIES = ["AI Website", "AI Video", "AI Image"];

const EMPTY: ProjectInput = {
  title: "",
  student_name: "",
  description: "",
  category: CATEGORIES[0],
  thumbnail_url: null,
  gallery_urls: [],
  youtube_url: null,
  youtube_video_id: null,
  live_url: null,
  github_url: null,
  technologies: [],
  featured: false,
  published: false,
};

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

export function ProjectsTab() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: listAllProjects,
  });

  const [form, setForm] = useState<ProjectInput>(EMPTY);
  const [techText, setTechText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((f) => {
      const updated = { ...f, [key]: value };
      // Clear irrelevant fields when category changes
      if (key === "category") {
        if (value === "AI Website") {
          updated.youtube_url = null;
          updated.youtube_video_id = null;
          updated.gallery_urls = [];
        } else if (value === "AI Video") {
          updated.live_url = null;
          updated.github_url = null;
          updated.gallery_urls = [];
          updated.technologies = [];
          setTechText("");
        } else if (value === "AI Image") {
          updated.live_url = null;
          updated.github_url = null;
          updated.youtube_url = null;
          updated.youtube_video_id = null;
          updated.technologies = [];
          setTechText("");
        }
      }
      return updated;
    });
  }

  function startEdit(p: ProjectRow) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      student_name: p.student_name,
      description: p.description,
      category: p.category,
      thumbnail_url: p.thumbnail_url,
      gallery_urls: p.gallery_urls,
      youtube_url: p.youtube_url,
      youtube_video_id: p.youtube_video_id,
      live_url: p.live_url,
      github_url: p.github_url,
      technologies: p.technologies,
      featured: p.featured,
      published: p.published,
    });
    setTechText(p.technologies.join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
    setTechText("");
  }

  async function pickThumbnail() {
    try {
      const asset = await uploadImage({ folder: "student-projects" });
      if (asset) set("thumbnail_url", asset.url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  async function pickGallery() {
    try {
      const assets = await uploadImages({ folder: "student-projects" });
      if (assets.length) set("gallery_urls", [...form.gallery_urls, ...assets.map((a) => a.url)]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  function onYoutubeChange(value: string) {
    const id = value.trim() ? parseVideoId(value) : null;
    setForm((f) => ({
      ...f,
      youtube_url: value.trim() || null,
      youtube_video_id: id,
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const payload: ProjectInput = {
      ...form,
      technologies: techText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        await updateProject(editingId, payload);
        toast.success("Project updated successfully");
      } else {
        await createProject(payload);
        toast.success("Project created successfully");
      }
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      await queryClient.invalidateQueries({ queryKey: ["published-projects"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this project permanently?")) return;
    try {
      await deleteProject(id);
      if (editingId === id) resetForm();
      await queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      await queryClient.invalidateQueries({ queryKey: ["published-projects"] });
      toast.success("Project deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  const isWebsite = form.category === "AI Website";
  const isVideo = form.category === "AI Video";
  const isImage = form.category === "AI Image";

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Student Projects</h2>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] mb-8"
      >
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Project" : "New Project"}</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Student Name</span>
            <input
              required
              value={form.student_name}
              onChange={(e) => set("student_name", e.target.value)}
              className={inputCls}
            />
          </label>
          <div className="block sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium">Description</span>
            <RichTextEditor
              value={form.description}
              onChange={(val) => set("description", val)}
            />
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Category</span>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputCls}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block flex items-center gap-4 text-[14px] pt-7">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              Published
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured
            </label>
          </label>

          {/* Dynamic Fields */}
          {isWebsite && (
            <>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium">Live URL (Required)</span>
                <input
                  required
                  value={form.live_url ?? ""}
                  onChange={(e) => set("live_url", e.target.value || null)}
                  className={inputCls}
                  placeholder="https://…"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium">GitHub URL (Optional)</span>
                <input
                  value={form.github_url ?? ""}
                  onChange={(e) => set("github_url", e.target.value || null)}
                  className={inputCls}
                  placeholder="https://github.com/…"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[13px] font-medium">
                  Technologies (comma separated)
                </span>
                <input
                  value={techText}
                  onChange={(e) => setTechText(e.target.value)}
                  className={inputCls}
                  placeholder="Lovable, Gemini, Canva"
                />
              </label>
            </>
          )}

          {isVideo && (
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium">
                YouTube URL (Required){" "}
                {form.youtube_video_id && (
                  <span className="text-primary">(id: {form.youtube_video_id})</span>
                )}
              </span>
              <input
                required
                value={form.youtube_url ?? ""}
                onChange={(e) => onYoutubeChange(e.target.value)}
                className={inputCls}
                placeholder="https://youtu.be/…"
              />
            </label>
          )}
        </div>

        {/* Media Fields */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {isImageUploadConfigured() ? (
              <>
                <button
                  type="button"
                  onClick={pickThumbnail}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[14px] font-medium hover:bg-secondary"
                >
                  <ImagePlus className="h-4 w-4" /> Thumbnail (Required)
                </button>
                {isImage && (
                  <button
                    type="button"
                    onClick={pickGallery}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[14px] font-medium hover:bg-secondary"
                  >
                    <ImagePlus className="h-4 w-4" /> Gallery (Required)
                  </button>
                )}
              </>
            ) : (
              <span className="text-[13px] text-muted-foreground">
                Cloudinary not configured, paste image URLs below.
              </span>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Thumbnail URL</span>
              <input
                required
                value={form.thumbnail_url ?? ""}
                onChange={(e) => set("thumbnail_url", e.target.value || null)}
                className={inputCls}
                placeholder="https://res.cloudinary.com/…"
              />
            </label>
            {isImage && (
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-medium">
                  Gallery URLs (comma separated)
                </span>
                <input
                  required
                  value={form.gallery_urls.join(", ")}
                  onChange={(e) =>
                    set(
                      "gallery_urls",
                      e.target.value
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean),
                    )
                  }
                  className={inputCls}
                />
              </label>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="gradient-bg inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save changes" : "Create project"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <p className="text-muted-foreground">No projects yet.</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li
              key={p.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-soft)]"
            >
              <div>
                <div className="font-semibold text-foreground">{p.title}</div>
                <div className="text-[13px] text-muted-foreground mt-1">
                  {p.student_name} · {p.category} ·{" "}
                  {p.published ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-orange-500">Draft</span>
                  )}
                  {p.featured ? " · featured" : ""}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  aria-label="Edit"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  aria-label="Delete"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
