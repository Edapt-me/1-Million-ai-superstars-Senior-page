import { useQuery } from "@tanstack/react-query";
import { FolderOpen, BookOpen, MessageCircleQuestion, Globe } from "lucide-react";
import { listAllProjects } from "@/lib/projects";
import { getAllCurriculum, getAllFAQs } from "@/lib/cms";

export function DashboardTab() {
  const { data: projects = [] } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: listAllProjects,
  });

  const { data: curriculum = [] } = useQuery({
    queryKey: ["admin-curriculum"],
    queryFn: getAllCurriculum,
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: getAllFAQs,
  });

  const publishedProjects = projects.filter((p) => p.published).length;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FolderOpen },
    { label: "Published Projects", value: publishedProjects, icon: Globe },
    { label: "Curriculum Modules", value: curriculum.length, icon: BookOpen },
    { label: "FAQs", value: faqs.length, icon: MessageCircleQuestion },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight">{s.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
