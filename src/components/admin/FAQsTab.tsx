import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ, type FAQInput, type FAQ } from "@/lib/cms";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

const EMPTY: FAQInput = {
  question: "",
  answer: "",
  order_index: 0,
  published: false,
};

export function FAQsTab() {
  const queryClient = useQueryClient();
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: getAllFAQs,
  });

  const [form, setForm] = useState<FAQInput>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set<K extends keyof FAQInput>(key: K, value: FAQInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(item: FAQ) {
    setEditingId(item.id);
    setForm({
      question: item.question,
      answer: item.answer,
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
        await updateFAQ(editingId, form);
        toast.success("FAQ updated successfully");
      } else {
        await createFAQ(form);
        toast.success("FAQ created successfully");
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      await queryClient.invalidateQueries({ queryKey: ["published-faqs"] });
      resetForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this FAQ permanently?")) return;
    try {
      await deleteFAQ(id);
      if (editingId === id) resetForm();
      await queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      await queryClient.invalidateQueries({ queryKey: ["published-faqs"] });
      toast.success("FAQ deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">FAQs</h2>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] mb-8"
      >
        <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit FAQ" : "Add FAQ"}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium">Question</span>
            <input
              required
              value={form.question}
              onChange={(e) => set("question", e.target.value)}
              className={inputCls}
            />
          </label>
          <div className="block sm:col-span-2">
            <span className="mb-1.5 block text-[13px] font-medium">Answer</span>
            <RichTextEditor
              value={form.answer}
              onChange={(val) => set("answer", val)}
            />
          </div>
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
            {editingId ? "Save changes" : "Add FAQ"}
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
      ) : faqs.length === 0 ? (
        <p className="text-muted-foreground">No FAQs yet.</p>
      ) : (
        <ul className="space-y-3">
          {faqs.map((f) => (
            <li
              key={f.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-soft)]"
            >
              <div>
                <div className="font-semibold text-foreground">{f.question}</div>
                <div className="text-[13px] text-muted-foreground mt-1 max-w-xl truncate">
                  {f.answer}
                </div>
                <div className="text-[12px] text-muted-foreground mt-1">
                  Order: {f.order_index} •{" "}
                  {f.published ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-orange-500">Draft</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(f)}
                  aria-label="Edit"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-secondary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(f.id)}
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
