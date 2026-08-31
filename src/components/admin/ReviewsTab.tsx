import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
  type ReviewInsert,
  type Review,
} from "@/services/reviews";
import { isImageUploadConfigured, uploadImage } from "@/services/media";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

const EMPTY: ReviewInsert = {
  name: "",
  role: "",
  review_text: "",
  rating: 5,
  profile_image_url: null,
  review_image_url: null,
  video_url: null,
  source: "manual",
  is_published: true,
  display_order: 0,
};

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

export function ReviewsTab() {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getAllReviews,
  });

  const [form, setForm] = useState<ReviewInsert>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof ReviewInsert>(key: K, value: ReviewInsert[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(r: Review) {
    setEditingId(r.id);
    setForm({
      name: r.name,
      role: r.role || "",
      review_text: r.review_text || "",
      rating: r.rating || 5,
      profile_image_url: r.profile_image_url,
      review_image_url: r.review_image_url,
      video_url: r.video_url,
      source: r.source || "manual",
      is_published: r.is_published ?? true,
      display_order: r.display_order ?? 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function pickProfileImage() {
    try {
      const asset = await uploadImage({ folder: "student-reviews" });
      if (asset) set("profile_image_url", asset.url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  async function pickReviewImage() {
    try {
      const asset = await uploadImage({ folder: "student-reviews" });
      if (asset) set("review_image_url", asset.url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    // Convert string empty values to null for DB if preferred,
    // or keep them as empty strings.
    const payload = { ...form };

    try {
      if (editingId) {
        await updateReview(editingId, payload);
        toast.success("Review updated successfully");
      } else {
        await createReview(payload);
        toast.success("Review created successfully");
      }
      resetForm();
      await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      await queryClient.invalidateQueries({ queryKey: ["published-reviews"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this review permanently?")) return;
    try {
      await deleteReview(id);
      if (editingId === id) resetForm();
      await queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      await queryClient.invalidateQueries({ queryKey: ["published-reviews"] });
      toast.success("Review deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Student Reviews & Testimonials</h2>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] mb-8"
      >
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Review" : "New Review"}</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Student Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Role / Designation</span>
            <input
              value={form.role || ""}
              onChange={(e) => set("role", e.target.value)}
              className={inputCls}
              placeholder="e.g. Student, Data Scientist"
            />
          </label>

          <label className="block sm:col-span-2 flex items-center gap-4 text-[14px] pt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_published ?? true}
                onChange={(e) => set("is_published", e.target.checked)}
              />
              Published
            </label>
            <label className="flex items-center gap-2">
              <span className="text-[13px] font-medium">Rating:</span>
              <input
                type="number"
                min="1"
                max="5"
                value={form.rating || 5}
                onChange={(e) => set("rating", parseInt(e.target.value))}
                className="w-16 rounded border border-border px-2 py-1 outline-none focus:border-primary"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-[13px] font-medium">Order:</span>
              <input
                type="number"
                value={form.display_order || 0}
                onChange={(e) => set("display_order", parseInt(e.target.value))}
                className="w-20 rounded border border-border px-2 py-1 outline-none focus:border-primary"
              />
            </label>
          </label>

          <div className="block sm:col-span-2 mt-2">
            <span className="mb-1.5 block text-[13px] font-medium">Review Text</span>
            <RichTextEditor
              value={form.review_text || ""}
              onChange={(val) => set("review_text", val)}
            />
          </div>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium">Video URL (Optional)</span>
            <input
              value={form.video_url || ""}
              onChange={(e) => set("video_url", e.target.value || null)}
              className={inputCls}
              placeholder="https://youtube.com/..."
            />
          </label>
        </div>

        {/* Media Fields */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {isImageUploadConfigured() ? (
              <>
                <button
                  type="button"
                  onClick={pickProfileImage}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[14px] font-medium hover:bg-secondary"
                >
                  <ImagePlus className="h-4 w-4" /> Profile Image
                </button>
                <button
                  type="button"
                  onClick={pickReviewImage}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[14px] font-medium hover:bg-secondary"
                >
                  <ImagePlus className="h-4 w-4" /> Review Screenshot
                </button>
              </>
            ) : (
              <span className="text-[13px] text-muted-foreground">
                Cloudinary not configured, paste image URLs below.
              </span>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Profile Image URL</span>
              <input
                value={form.profile_image_url || ""}
                onChange={(e) => set("profile_image_url", e.target.value || null)}
                className={inputCls}
                placeholder="https://..."
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Review Screenshot URL</span>
              <input
                value={form.review_image_url || ""}
                onChange={(e) => set("review_image_url", e.target.value || null)}
                className={inputCls}
                placeholder="https://..."
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="gradient-bg inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save changes" : "Create review"}
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
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-4">
                {r.profile_image_url ? (
                  <img
                    src={r.profile_image_url}
                    alt={r.name}
                    className="h-10 w-10 rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border border-border text-xs font-medium text-muted-foreground">
                    {r.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    {r.name}
                    {r.source === "google" && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        Google
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] text-muted-foreground mt-0.5">
                    {r.rating} stars ·{" "}
                    {r.is_published ? (
                      <span className="text-green-600">Published</span>
                    ) : (
                      <span className="text-orange-500">Draft</span>
                    )}{" "}
                    · Order: {r.display_order}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(r)}
                  aria-label="Edit"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(r.id)}
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
