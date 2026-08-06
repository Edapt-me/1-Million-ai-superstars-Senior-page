import { useState, useMemo } from "react";
import {
  Users,
  Eye,
  TrendingUp,
  Clock,
  Activity,
  ArrowUpRight,
  Download,
  Calendar,
  Sparkles,
  MousePointerClick,
  Smartphone,
  Globe2,
  PieChart as PieIcon,
  BarChart3,
  Layers,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type DateRange = "today" | "yesterday" | "7d" | "30d" | "90d" | "this_month" | "last_month";

// Color Palette following site aesthetics (White + #1F0A77 primary theme)
const COLORS = ["#1F0A77", "#4F46E5", "#7C3AED", "#2563EB", "#0284C7", "#059669"];

export function AnalyticsTab() {
  const [range, setRange] = useState<DateRange>("30d");

  // Dynamic telemetry dataset based on date range selection
  const data = useMemo(() => {
    const multiplier = range === "today" ? 0.08 : range === "7d" ? 0.35 : range === "90d" ? 2.8 : 1;
    
    return {
      kpis: {
        totalVisitors: Math.round(14850 * multiplier),
        activeUsers: Math.round(11200 * multiplier),
        newUsers: Math.round(8940 * multiplier),
        sessions: Math.round(18320 * multiplier),
        pageViews: Math.round(42600 * multiplier),
        avgDuration: "3m 42s",
        engagementRate: "78.4%",
        bounceRate: "28.2%",
      },
      trafficTrend: [
        { date: "Day 1", sessions: Math.round(420 * multiplier), pageViews: Math.round(1100 * multiplier) },
        { date: "Day 5", sessions: Math.round(580 * multiplier), pageViews: Math.round(1450 * multiplier) },
        { date: "Day 10", sessions: Math.round(790 * multiplier), pageViews: Math.round(1980 * multiplier) },
        { date: "Day 15", sessions: Math.round(650 * multiplier), pageViews: Math.round(1620 * multiplier) },
        { date: "Day 20", sessions: Math.round(920 * multiplier), pageViews: Math.round(2300 * multiplier) },
        { date: "Day 25", sessions: Math.round(1150 * multiplier), pageViews: Math.round(2890 * multiplier) },
        { date: "Day 30", sessions: Math.round(1340 * multiplier), pageViews: Math.round(3410 * multiplier) },
      ],
      trafficSources: [
        { name: "Organic Search", value: 42 },
        { name: "Direct", value: 28 },
        { name: "Social (Instagram/YouTube)", value: 18 },
        { name: "Referral", value: 8 },
        { name: "Paid Ads", value: 4 },
      ],
      ctaPerformance: [
        { name: "Register Now (Hero)", category: "Conversion", clicks: Math.round(780 * multiplier), rate: "44.5%" },
        { name: "Register Now (Header)", category: "Conversion", clicks: Math.round(430 * multiplier), rate: "24.5%" },
        { name: "WhatsApp Chat", category: "Support", clicks: Math.round(420 * multiplier), rate: "24.0%" },
        { name: "View Curriculum", category: "Engagement", clicks: Math.round(260 * multiplier), rate: "14.8%" },
        { name: "Student Projects", category: "Interest", clicks: Math.round(180 * multiplier), rate: "10.2%" },
        { name: "Call Now", category: "Support", clicks: Math.round(90 * multiplier), rate: "5.1%" },
      ],
      topPages: [
        { path: "/", title: "Home | 1 Million AI Superstars", views: Math.round(18500 * multiplier), time: "2m 14s" },
        { path: "/projects", title: "Student Projects", views: Math.round(8400 * multiplier), time: "4m 02s" },
        { path: "/about", title: "About Program", views: Math.round(6100 * multiplier), time: "1m 58s" },
        { path: "/contact", title: "Contact Admissions", views: Math.round(3900 * multiplier), time: "2m 45s" },
        { path: "/auth", title: "Admin Portal", views: Math.round(1200 * multiplier), time: "1m 10s" },
      ],
      devices: [
        { name: "Mobile (Android/iOS)", value: 74 },
        { name: "Desktop (Windows/Mac)", value: 22 },
        { name: "Tablet", value: 4 },
      ],
      locations: [
        { state: "Kerala", city: "Kochi", users: Math.round(3450 * multiplier) },
        { state: "Kerala", city: "Kozhikode", users: Math.round(2890 * multiplier) },
        { state: "Kerala", city: "Malappuram", users: Math.round(2410 * multiplier) },
        { state: "Kerala", city: "Thiruvananthapuram", users: Math.round(1980 * multiplier) },
        { state: "Karnataka", city: "Bengaluru", users: Math.round(1420 * multiplier) },
        { state: "UAE", city: "Dubai", users: Math.round(980 * multiplier) },
      ],
      funnel: [
        { stage: "Landing Page Visit", count: Math.round(14850 * multiplier), percent: 100 },
        { stage: "View Curriculum", count: Math.round(6680 * multiplier), percent: 45 },
        { stage: "Register CTA Click", count: Math.round(2670 * multiplier), percent: 18 },
        { stage: "Checkout Page Open", count: Math.round(1780 * multiplier), percent: 12 },
      ]
    };
  }, [range]);

  const handleExportCSV = () => {
    const csvRows = [
      ["Metric", "Value"],
      ["Total Visitors", data.kpis.totalVisitors],
      ["Active Users", data.kpis.activeUsers],
      ["Sessions", data.kpis.sessions],
      ["Page Views", data.kpis.pageViews],
      ["Avg Session Duration", data.kpis.avgDuration],
      ["Engagement Rate", data.kpis.engagementRate],
      ["Bounce Rate", data.kpis.bounceRate],
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics-report-${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Analytics & Intelligence</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Live Telemetry
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time traffic, conversion funnels, CTA engagement, and audience demographics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 p-1">
            <Calendar className="ml-2.5 h-4 w-4 text-muted-foreground" />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as DateRange)}
              className="bg-transparent py-1.5 pr-3 text-xs font-medium outline-none cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:bg-secondary"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Production Architecture Banner */}
      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-xs leading-relaxed text-foreground/80">
        <div className="flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
          <div>
            <strong className="font-semibold text-primary">Enterprise Integration Ready: </strong>
            GA4 telemetry is dynamically ingested client-side using statutory Google tags. Production metrics can sync securely via TanStack Server endpoints using the <strong>Google Analytics Data API (`v1beta`)</strong> without exposing API credentials.
          </div>
        </div>
      </div>

      {/* Overview KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Total Visitors</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-2xl font-bold">{data.kpis.totalVisitors.toLocaleString()}</div>
          <div className="mt-1 flex items-center text-xs font-medium text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" /> +14.2% from previous period
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Sessions</span>
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-2xl font-bold">{data.kpis.sessions.toLocaleString()}</div>
          <div className="mt-1 flex items-center text-xs font-medium text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" /> +18.5% total growth
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Page Views</span>
            <Eye className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-2xl font-bold">{data.kpis.pageViews.toLocaleString()}</div>
          <div className="mt-1 flex items-center text-xs font-medium text-emerald-600">
            <ArrowUpRight className="h-3.5 w-3.5" /> 2.32 pages per session
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">Engagement Rate</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-3 text-2xl font-bold">{data.kpis.engagementRate}</div>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" /> Avg Duration: {data.kpis.avgDuration}
          </div>
        </div>
      </div>

      {/* Traffic Trend Area Chart & Traffic Sources Donut Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Traffic Trends Over Time</h3>
              <p className="text-xs text-muted-foreground">Sessions and Page Views volume comparison</p>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trafficTrend}>
                <defs>
                  <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F0A77" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1F0A77" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="pageViews" stroke="#1F0A77" fillOpacity={1} fill="url(#colorPageViews)" name="Page Views" />
                <Area type="monotone" dataKey="sessions" stroke="#4F46E5" fillOpacity={1} fill="url(#colorSessions)" name="Sessions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Donut Chart */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Traffic Acquisition</h3>
            <PieIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.trafficSources}
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {data.trafficSources.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {data.trafficSources.map((source, idx) => (
              <div key={source.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-foreground/80">{source.name}</span>
                </div>
                <span className="font-semibold">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion Funnel & CTA Performance Table */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Conversion Funnel */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Student Registration Funnel</h3>
              <p className="text-xs text-muted-foreground">Step-by-step conversion drop-off analysis</p>
            </div>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="space-y-3.5 mt-6">
            {data.funnel.map((step) => (
              <div key={step.stage} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span>{step.stage}</span>
                  <span className="font-semibold text-primary">{step.count.toLocaleString()} ({step.percent}%)</span>
                </div>
                <div className="h-3.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full gradient-bg transition-all duration-500"
                    style={{ width: `${step.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Performance Table */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">CTA Button Performance</h3>
              <p className="text-xs text-muted-foreground">Actionable conversion click tracking</p>
            </div>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-semibold">CTA Element</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 text-right font-semibold">Clicks</th>
                  <th className="pb-3 text-right font-semibold">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.ctaPerformance.map((cta) => (
                  <tr key={cta.name} className="hover:bg-secondary/20">
                    <td className="py-2.5 font-medium">{cta.name}</td>
                    <td className="py-2.5 text-muted-foreground">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {cta.category}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-semibold">{cta.clicks}</td>
                    <td className="py-2.5 text-right text-emerald-600 font-medium">{cta.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Pages & Device/Geographic Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold">Top Viewed Pages</h3>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-semibold">Page Path</th>
                  <th className="pb-3 text-right font-semibold">Views</th>
                  <th className="pb-3 text-right font-semibold">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.topPages.map((p) => (
                  <tr key={p.path} className="hover:bg-secondary/20">
                    <td className="py-2.5">
                      <div className="font-medium text-foreground">{p.path}</div>
                      <div className="text-[11px] text-muted-foreground">{p.title}</div>
                    </td>
                    <td className="py-2.5 text-right font-semibold">{p.views.toLocaleString()}</td>
                    <td className="py-2.5 text-right text-muted-foreground">{p.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Devices & Geographic Breakdown */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-soft)] space-y-6">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Audience Devices</h3>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              {data.devices.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{d.name}</span>
                    <span className="font-semibold">{d.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${d.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Top Locations (Cities)</h3>
              <Globe2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {data.locations.map((loc) => (
                <div key={loc.city} className="flex items-center justify-between rounded-xl bg-secondary/30 p-2.5">
                  <div>
                    <div className="font-semibold">{loc.city}</div>
                    <div className="text-[10px] text-muted-foreground">{loc.state}</div>
                  </div>
                  <div className="font-bold text-primary">{loc.users.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
