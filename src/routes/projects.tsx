import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
import { Search, ExternalLink, Github, Play } from "lucide-react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageShell";
import { useQuery } from "@tanstack/react-query";
import { getWebsiteSettings } from "@/lib/cms";
import { listPublishedProjects } from "@/lib/projects";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Student Projects | 1 Million AI Superstars" },
      {
        name: "description",
        content:
          "Explore real projects built by our alumni, including AI websites, videos, and images.",
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
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="aspect-video w-full animate-pulse bg-secondary/70" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-3 w-20 animate-pulse rounded-full bg-secondary/70" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-secondary/70" />
        <div className="h-3 w-full animate-pulse rounded-full bg-secondary/70" />
        <div className="h-3 w-5/6 animate-pulse rounded-full bg-secondary/70" />
      </div>
    </div>
  );
}

function ExpandableDescription({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight + 2);
    }
  }, [html]);

  return (
    <div className="mt-3">
      <div
        ref={textRef}
        className={[
          "text-[13.5px] sm:text-[14.5px] leading-[1.6] text-muted-foreground prose prose-sm max-w-none prose-p:my-0 prose-headings:my-0 prose-headings:text-[15px] prose-a:text-primary transition-all duration-300 overflow-hidden",
          !expanded ? "line-clamp-3" : "",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {(isOverflowing || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 inline-flex text-[13px] font-medium text-primary transition-colors hover:text-primary/80 focus:outline-none"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
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
          p.description
            .replace(/<[^>]*>?/gm, "")
            .toLowerCase()
            .includes(s),
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
        title="Built by our learners"
        subtitle="Real work from our alumni, including AI websites, videos, and images."
        compact
      />

      <section className="pb-10 pt-4 md:pb-16 md:pt-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => reset(setQ)(e.target.value)}
                placeholder="Search projects, students…"
                className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-[14px] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
            </div>
            <div className="flex w-full gap-3 md:w-auto md:shrink-0">
              <div className="flex-1 md:w-[170px]">
                <select
                  value={cat}
                  onChange={(e) => reset(setCat)(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none transition hover:border-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 md:w-[150px]">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="w-full appearance-none rounded-xl border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none transition hover:border-foreground/20 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm cursor-pointer"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                  <option value="az">Sort: A–Z</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-8">
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
                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {pageItems.map((p, i) => (
                    <motion.article
                      key={p.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
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
                      <div className="flex flex-1 flex-col p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                            {p.category}
                          </span>
                        </div>
                        <h3 className="mt-2.5 text-[17px] sm:text-[18px] font-semibold leading-tight tracking-tight text-foreground">{p.title}</h3>
                        <div className="mt-1 text-[12.5px] text-muted-foreground/90 font-medium">by {p.student}</div>
                        
                        <ExpandableDescription html={p.description} />

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
                    className="mt-8 md:mt-10 flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setPage((n) => Math.max(1, n - 1))}
                      disabled={current === 1}
                      className="rounded-full border border-border bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[13px] font-medium transition-colors hover:bg-secondary/60 disabled:pointer-events-none disabled:opacity-40"
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
                          "h-8 w-8 sm:h-9 sm:w-9 rounded-full text-[12px] sm:text-[13px] font-medium transition-all",
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
                      className="rounded-full border border-border bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[13px] font-medium transition-colors hover:bg-secondary/60 disabled:pointer-events-none disabled:opacity-40"
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
