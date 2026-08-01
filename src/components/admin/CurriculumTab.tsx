import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllCurriculum,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
  type CurriculumInput,
  type CurriculumModule,
} from "@/lib/cms";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

const EMPTY: CurriculumInput = {
  title: "",
  description: "",
  week_number: 1,
  order_index: 0,
  published: false,
};

export function CurriculumTab() {
  const queryClient = useQueryClient();
  const { data: curriculum = [], isLoading } = useQuery({
    queryKey: ["admin-curriculum"],
    queryFn: getAllCurriculum,
  });

  const [form, setForm] = useState<CurriculumInput>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof CurriculumInput>(key: K, value: CurriculumInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(item: CurriculumModule) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      week_number: item.week_number,
      order_index: item.order_index,
      published: item.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) {
        await updateCurriculum(editingId, form);
        toast.success("Module updated successfully");
      } else {
        await createCurriculum(form);
        toast.success("Module created successfully");
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-curriculum"] });
      await queryClient.invalidateQueries({ queryKey: ["published-curriculum"] });
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this module permanently?")) return;
    try {
      await deleteCurriculum(id);
      if (editingId === id) resetForm();
      await queryClient.invalidateQueries({ queryKey: ["admin-curriculum"] });
      await queryClient.invalidateQueries({ queryKey: ["published-curriculum"] });
      toast.success("Module deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Curriculum</h2>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] mb-8"
      >
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Module" : "Add Module"}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium">Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputCls}
            />
          </label>
          <div className="block sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium">Description</span>
            <RichTextEditor value={form.description} onChange={(val) => set("description", val)} />
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Week Number / Session</span>
            <input
              type="number"
              required
              value={form.week_number}
              onChange={(e) => set("week_number", parseInt(e.target.value, 10) || 0)}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">Order Index (Sort)</span>
            <input
              type="number"
              required
              value={form.order_index}
              onChange={(e) => set("order_index", parseInt(e.target.value, 10) || 0)}
              className={inputCls}
            />
          </label>
          <label className="block sm:col-span-2 flex items-center gap-2 text-[14px]">
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
            className="gradient-bg inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Save changes" : "Add module"}
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
      ) : curriculum.length === 0 ? (
        <p className="text-muted-foreground">No modules yet.</p>
      ) : (
        <ul className="space-y-3">
          {curriculum.map((m) => (
            <li
              key={m.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-soft)]"
            >
              <div>
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                    Week {m.week_number}
                  </span>
                  {m.title}
                </div>
                <div className="text-[13px] text-muted-foreground mt-1 max-w-xl truncate">
                  {m.description}
                </div>
                <div className="text-[12px] text-muted-foreground mt-1">
                  Order: {m.order_index} •{" "}
                  {m.published ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-orange-500">Draft</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(m)}
                  aria-label="Edit"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(m.id)}
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
