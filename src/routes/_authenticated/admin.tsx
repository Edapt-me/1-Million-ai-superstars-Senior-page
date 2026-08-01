import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  Settings,
  FolderOpen,
  BookOpen,
  MessageCircleQuestion,
  Wrench,
} from "lucide-react";
import { DashboardTab } from "@/components/admin/DashboardTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import { CurriculumTab } from "@/components/admin/CurriculumTab";
import { FAQsTab } from "@/components/admin/FAQsTab";
import { AIToolsTab } from "@/components/admin/AIToolsTab";
import { useQueryClient } from "@tanstack/react-query";
import { logoutServerFn } from "@/server-auth";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "CMS | 1 Million AI Superstars" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

type TabId = "dashboard" | "settings" | "projects" | "curriculum" | "faqs" | "ai_tools";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings", label: "Website Settings", icon: Settings },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "ai_tools", label: "AI Tools", icon: Wrench },
  { id: "curriculum", label: "Curriculum", icon: BookOpen },
  { id: "faqs", label: "FAQs", icon: MessageCircleQuestion },
];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await logoutServerFn();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-secondary/30 pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-32 rounded-2xl border border-border bg-white p-4 shadow-[var(--shadow-soft)]">
              <div className="mb-4 px-3 text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
                CMS
              </div>
              <nav className="flex flex-col gap-1">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-4 w-4" /> {t.label}
                    </button>
                  );
                })}
              </nav>
              <div className="mt-6 border-t border-border pt-6">
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {activeTab === "dashboard" && <DashboardTab />}
            {activeTab === "settings" && <SettingsTab />}
            {activeTab === "projects" && <ProjectsTab />}
            {activeTab === "ai_tools" && <AIToolsTab />}
            {activeTab === "curriculum" && <CurriculumTab />}
            {activeTab === "faqs" && <FAQsTab />}
          </main>
        </div>
      </div>
    </div>
  );
}
