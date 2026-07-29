import { createFileRoute } from "@tanstack/react-query"; // Wait, wrong import, fixing below
import { createFileRoute as createRouterFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ExternalLink, Github, Play } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageShell";
import { useQuery } from "@tanstack/react-query";
import { getWebsiteSettings } from "@/lib/cms";
import { listPublishedProjects } from "@/lib/projects";

export const Route = createRouterFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Student Projects | 1 Million AI Superstars" },
      {
        name: "description",
        content: "Explore real projects built by our alumni, including AI websites, videos, and images.",
      },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  id: string;
  title: string;
  student: string;
  description: string;
  category: string;
  tech: string[];
  thumbnailUrl?: string;
  youtubeVideoId?: string;
  galleryUrls?: string[];
  liveUrl?: string;
  githubUrl?: string;
  createdAt: string;
};

function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-soft)]">
      <div className="aspect-video w-full animate-pulse bg-secondary/70" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded-full bg-secondary/70" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-secondary/70" />
        <div className="h-3 w-full animate-pulse rounded-full bg-secondary/70" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-secondary/70" />
      </div>
    </div>
  );
}

const CATEGORIES = ["All", "AI Website", "AI Video", "AI Image"];
type SortKey = "newest" | "oldest" | "az";
const PAGE_SIZE = 9;

function ProjectsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);

  const { data: rows = [], isLoading: loading } = useQuery({
    queryKey: ["published-projects"],
    queryFn: listPublishedProjects,
  });

  const { data: settings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: getWebsiteSettings,
  });

  const source: Project[] = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        title: r.title,
        student: r.student_name,
        description: r.description,
        category: r.category,
        tech: r.technologies,
        thumbnailUrl: r.thumbnail_url ?? undefined,
        youtubeVideoId: r.youtube_video_id ?? undefined,
        galleryUrls: r.gallery_urls ?? [],
        liveUrl: r.live_url ?? undefined,
        githubUrl: r.github_url ?? undefined,
        createdAt: r.created_at,
      })),
    [rows],
  );

  const items = useMemo(() => {
    let list = [...source];
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(s) ||
          p.student.toLowerCase().includes(s) ||
          p.description.replace(/<[^>]*>?/gm, '').toLowerCase().includes(s),
      );
    }
    if (sort === "az") list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === "oldest") list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return list;
  }, [q, cat, sort, source]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const reset =
    <T,>(setter: (v: T) => void) =>
    (v: T) => {
      setter(v);
      setPage(1);
    };

  return (
    <>
      <PageHero
        eyebrow="Student Projects"
        title="Built by our learners"
        subtitle="Real work from our alumni, including AI websites, videos, and images."
      />

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => reset(setQ)(e.target.value)}
                placeholder="Search projects, students…"
                className="w-full rounded-full border border-border bg-white py-3 pl-11 pr-4 text-[15px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[13px] text-muted-foreground">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-border bg-white px-4 py-2 text-[14px] outline-none focus:border-primary"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="az">A–Z</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => reset(setCat)(c)}
                  className={[
                    "rounded-full border px-4 py-2 text-[13px] font-medium transition-all",
                    active
                      ? "border-transparent gradient-bg text-white shadow-[0_8px_20px_-10px_rgba(31,10,119,0.55)]"
                      : "border-border bg-white text-foreground/70 hover:text-foreground",
                  ].join(" ")}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-white p-10 text-center">
                <h3 className="text-lg font-semibold">Projects coming soon</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                  {settings?.course_batch_name || "The batch"} kicks off soon. Student submissions
                  will appear here once the program begins.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pageItems.map((p, i) => (
                    <motion.article
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(31,10,119,0.35)]"
                    >
                      {/* Media Area */}
                      <div className="aspect-video w-full shrink-0 overflow-hidden bg-secondary/60 relative">
                        {p.category === "AI Video" && p.youtubeVideoId ? (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${p.youtubeVideoId}`}
                            title={p.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full border-0"
                          />
                        ) : (
                          p.thumbnailUrl && (
                            <img
                              src={p.thumbnailUrl}
                              alt={p.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          )
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="flex flex-1 flex-col p-5">
                        <div className="text-[12px] font-semibold uppercase tracking-wider text-primary">
                          {p.category}
                        </div>
                        <h3 className="mt-1 text-lg font-semibold">{p.title}</h3>
                        <div className="text-[13px] text-muted-foreground">by {p.student}</div>
                        <div 
                          className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted-foreground prose prose-sm prose-p:my-0 prose-headings:my-0 prose-headings:text-[15px] prose-a:text-primary max-w-none"
                          dangerouslySetInnerHTML={{ __html: p.description }}
                        />

                        {/* Gallery for AI Image */}
                        {p.category === "AI Image" && p.galleryUrls && p.galleryUrls.length > 0 && (
                          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 snap-x">
                            {p.galleryUrls.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Gallery ${idx}`}
                                className="h-12 w-12 rounded object-cover snap-center shrink-0"
                              />
                            ))}
                          </div>
                        )}

                        {/* Technologies */}
                        {p.category === "AI Website" && p.tech.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.tech.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-primary"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Links */}
                        {p.category === "AI Website" && (
                          <div className="mt-auto flex gap-3 pt-4 text-[13px]">
                            {p.liveUrl && (
                              <a
                                href={p.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
                              >
                                <ExternalLink className="h-3.5 w-3.5" /> Live
                              </a>
                            )}
                            {p.githubUrl && (
                              <a
                                href={p.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-medium text-foreground/70 hover:text-foreground"
                              >
                                <Github className="h-3.5 w-3.5" /> GitHub
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.article>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-10 flex items-center justify-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setPage((n) => Math.max(1, n - 1))}
                      disabled={current === 1}
                      className="rounded-full border border-border bg-white px-4 py-2 text-[13px] font-medium transition-colors hover:bg-secondary/60 disabled:pointer-events-none disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPage(i + 1)}
                        aria-current={current === i + 1 ? "page" : undefined}
                        className={[
                          "h-9 w-9 rounded-full text-[13px] font-medium transition-all",
                          current === i + 1
                            ? "gradient-bg text-white"
                            : "border border-border bg-white text-foreground/70 hover:text-foreground",
                        ].join(" ")}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
                      disabled={current === totalPages}
                      className="rounded-full border border-border bg-white px-4 py-2 text-[13px] font-medium transition-colors hover:bg-secondary/60 disabled:pointer-events-none disabled:opacity-40"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
