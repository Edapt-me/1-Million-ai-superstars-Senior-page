import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllAITools,
  createAITool,
  updateAITool,
  deleteAITool,
  type AIToolInput,
  type AITool,
} from "@/lib/cms";
import { isImageUploadConfigured, uploadImage } from "@/services/media";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, ImagePlus } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

const EMPTY: AIToolInput = {
  tool_name: "",
  tool_logo: "",
  display_order: 0,
  published: false,
};

export function AIToolsTab() {
  const queryClient = useQueryClient();
  const { data: tools = [], isLoading } = useQuery({
    queryKey: ["admin-ai-tools"],
    queryFn: getAllAITools,
  });

  const [form, setForm] = useState<AIToolInput>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof AIToolInput>(key: K, value: AIToolInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(item: AITool) {
    setEditingId(item.id);
    setForm({
      tool_name: item.tool_name,
      tool_logo: item.tool_logo,
      display_order: item.display_order,
      published: item.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function pickLogo() {
    try {
      const asset = await uploadImage({ folder: "ai-tools" });
      if (asset) set("tool_logo", asset.url);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) {
        await updateAITool(editingId, form);
        toast.success("Tool updated successfully");
      } else {
        await createAITool(form);
        toast.success("Tool added successfully");
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-ai-tools"] });
      await queryClient.invalidateQueries({ queryKey: ["published-ai-tools"] });
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this tool permanently?")) return;
    try {
      await deleteAITool(id);
      if (editingId === id) resetForm();
      await queryClient.invalidateQueries({ queryKey: ["admin-ai-tools"] });
      await queryClient.invalidateQueries({ queryKey: ["published-ai-tools"] });
      toast.success("Tool deleted successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">AI Tools</h2>

      <form
        onSubmit={onSubmit}
        className="mb-8 rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]"
      >
        <h3 className="mb-4 text-lg font-semibold">{editingId ? "Edit Tool" : "Add Tool"}</h3>

        <div className="mb-6 border-b border-border pb-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {isImageUploadConfigured() ? (
              <button
                type="button"
                onClick={pickLogo}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[14px] font-medium hover:bg-secondary"
              >
                <ImagePlus className="h-4 w-4" /> Upload Logo
              </button>
            ) : (
              <span className="text-[13px] text-muted-foreground">
                Cloudinary not configured, paste image URL below.
              </span>
            )}
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Tool Logo URL *</span>
            <input
              required
              value={form.tool_logo}
              onChange={(e) => set("tool_logo", e.target.value)}
              className={inputCls}
              placeholder="https://res.cloudinary.com/…"
            />
          </label>
          {form.tool_logo && (
            <div className="mt-4 flex h-24 w-24 items-center justify-center rounded-xl border border-border bg-secondary p-2">
              <img
                src={form.tool_logo}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium">Tool Name *</span>
            <input
              required
              value={form.tool_name}
              onChange={(e) => set("tool_name", e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Display Order</span>
            <input
              type="number"
              required
              value={form.display_order}
              onChange={(e) => set("display_order", parseInt(e.target.value, 10) || 0)}
              className={inputCls}
            />
          </label>
          <label className="block flex items-center gap-2 text-[14px] sm:col-span-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            Published
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-[14px] font-medium text-white transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingId ? "Save Changes" : "Add Tool"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-border px-6 py-2.5 text-[14px] font-medium hover:bg-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="rounded-2xl border border-border bg-white shadow-[var(--shadow-soft)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[14px]">
            <thead className="border-b border-border bg-secondary/50 text-[13px] font-medium text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Logo</th>
                <th className="px-6 py-4">Tool Name</th>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  </td>
                </tr>
              ) : tools.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    No tools added yet.
                  </td>
                </tr>
              ) : (
                tools.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-secondary/30">
                    <td className="px-6 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white p-1">
                        <img
                          src={item.tool_logo}
                          alt={item.tool_name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium">{item.tool_name}</td>
                    <td className="px-6 py-3">{item.display_order}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${
                          item.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 text-muted-foreground transition hover:text-primary"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-muted-foreground transition hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
