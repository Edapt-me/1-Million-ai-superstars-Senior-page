import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getWebsiteSettings, updateWebsiteSettings, type SettingsInput } from "@/lib/cms";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15";

export function SettingsTab() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: getWebsiteSettings,
  });

  const [form, setForm] = useState<SettingsInput | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (settings) {
      const { id, created_at, updated_at, ...rest } = settings;
      setForm(rest);
    } else if (!isLoading && !settings) {
      // Initialize with empty if not found, but we seeded it in migration
      setForm({
        hero_title: "",
        hero_subtitle: "",
        hero_badge: "",
        hero_image: "",
        hero_primary_button_text: "",
        hero_secondary_button_text: "",
        hero_trust_counter: "",
        course_batch_name: "",
        course_start_date: "",
        course_duration: "",
        course_registration_link: "",
        course_fee: "",
        course_offer_price: "",
        contact_email: "",
        contact_phone: "",
        contact_whatsapp: "",
        social_facebook: "",
        social_instagram: "",
        social_youtube: "",
        social_linkedin: "",
      });
    }
  }, [settings, isLoading]);

  if (isLoading || !form) {
    return (
      <div className="p-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  function set<K extends keyof SettingsInput>(key: K, value: SettingsInput[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : null));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    try {
      await updateWebsiteSettings(form);
      await queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      await queryClient.invalidateQueries({ queryKey: ["website-settings"] });
      toast.success("Settings updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Website Settings</h2>
        <button
          onClick={onSubmit}
          disabled={busy}
          className="gradient-bg inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Hero Section */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Hero Section</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="hero_title" className="block sm:col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium">Hero Title</span>
              <input
                id="hero_title"
                name="hero_title"
                value={form.hero_title}
                onChange={(e) => set("hero_title", e.target.value)}
                className={inputCls}
              />
            </label>
            <div className="block sm:col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium">Hero Subtitle</span>
              <RichTextEditor
                value={form.hero_subtitle}
                onChange={(val) => set("hero_subtitle", val)}
              />
            </div>
            <label htmlFor="hero_badge" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Hero Badge</span>
              <input
                id="hero_badge"
                name="hero_badge"
                value={form.hero_badge}
                onChange={(e) => set("hero_badge", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="hero_trust_counter" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Trust Counter Text</span>
              <input
                id="hero_trust_counter"
                name="hero_trust_counter"
                value={form.hero_trust_counter}
                onChange={(e) => set("hero_trust_counter", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="hero_primary_button_text" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Primary Button Text</span>
              <input
                id="hero_primary_button_text"
                name="hero_primary_button_text"
                value={form.hero_primary_button_text}
                onChange={(e) => set("hero_primary_button_text", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="hero_secondary_button_text" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Secondary Button Text</span>
              <input
                id="hero_secondary_button_text"
                name="hero_secondary_button_text"
                value={form.hero_secondary_button_text}
                onChange={(e) => set("hero_secondary_button_text", e.target.value)}
                className={inputCls}
              />
            </label>
          </div>
        </div>

        {/* Course Details */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Course Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="course_batch_name" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Batch Name</span>
              <input
                id="course_batch_name"
                name="course_batch_name"
                value={form.course_batch_name}
                onChange={(e) => set("course_batch_name", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="course_start_date" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Start Date</span>
              <input
                id="course_start_date"
                name="course_start_date"
                value={form.course_start_date}
                onChange={(e) => set("course_start_date", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="course_duration" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Course Duration</span>
              <input
                id="course_duration"
                name="course_duration"
                value={form.course_duration}
                onChange={(e) => set("course_duration", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="course_fee" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Course Fee</span>
              <input
                id="course_fee"
                name="course_fee"
                value={form.course_fee}
                onChange={(e) => set("course_fee", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="course_offer_price" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Offer Price text</span>
              <input
                id="course_offer_price"
                name="course_offer_price"
                value={form.course_offer_price}
                onChange={(e) => set("course_offer_price", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="course_registration_link" className="block sm:col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium">Registration Link URL</span>
              <input
                id="course_registration_link"
                name="course_registration_link"
                value={form.course_registration_link}
                onChange={(e) => set("course_registration_link", e.target.value)}
                className={inputCls}
              />
            </label>
          </div>
        </div>

        {/* Contact Details */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">
            Contact Details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="contact_email" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Email</span>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                value={form.contact_email}
                onChange={(e) => set("contact_email", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="contact_phone" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Phone</span>
              <input
                id="contact_phone"
                name="contact_phone"
                value={form.contact_phone}
                onChange={(e) => set("contact_phone", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="contact_whatsapp" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">
                WhatsApp Number (e.g. 918138010166)
              </span>
              <input
                id="contact_whatsapp"
                name="contact_whatsapp"
                value={form.contact_whatsapp}
                onChange={(e) => set("contact_whatsapp", e.target.value)}
                className={inputCls}
              />
            </label>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]">
          <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Social Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <label htmlFor="social_facebook" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Facebook URL</span>
              <input
                id="social_facebook"
                name="social_facebook"
                value={form.social_facebook}
                onChange={(e) => set("social_facebook", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="social_instagram" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">Instagram URL</span>
              <input
                id="social_instagram"
                name="social_instagram"
                value={form.social_instagram}
                onChange={(e) => set("social_instagram", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="social_youtube" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">YouTube URL</span>
              <input
                id="social_youtube"
                name="social_youtube"
                value={form.social_youtube}
                onChange={(e) => set("social_youtube", e.target.value)}
                className={inputCls}
              />
            </label>
            <label htmlFor="social_linkedin" className="block">
              <span className="mb-1.5 block text-[13px] font-medium">LinkedIn URL</span>
              <input
                id="social_linkedin"
                name="social_linkedin"
                value={form.social_linkedin}
                onChange={(e) => set("social_linkedin", e.target.value)}
                className={inputCls}
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
