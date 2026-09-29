import { useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, ArrowRight, TrendingUp } from "lucide-react";
import { programConfig } from "@/lib/programConfig";
import { getWebsiteSettings } from "@/lib/cms";
import { trackEvent } from "@/lib/analytics";
import { useEnrollmentStats } from "@/hooks/useEnrollmentStats";

export function MobileStickyCTA() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { todayCount, enrolledText } = useEnrollmentStats();

  const { data: settings } = useQuery({
    queryKey: ["website-settings"],
    queryFn: getWebsiteSettings,
  });

  // Do not show on the Contact page
  if (pathname === "/contact" || pathname === "/contact/") return null;

  const regUrl = settings?.course_registration_link || programConfig.registrationUrl;

  return (
    <aside
      aria-label="Mobile Registration Action"
      className="fixed bottom-[calc(10px+env(safe-area-inset-bottom))] left-3 right-3 z-50 md:hidden"
    >
      <div className="rounded-2xl border border-slate-200/95 bg-white/95 p-2.5 shadow-[0_12px_36px_-6px_rgba(20,5,80,0.18),0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all">
        {/* Top: Today Registration & Enrolled Participants */}
        <div className="flex items-center justify-start gap-2.5 sm:gap-3.5 px-2 pb-2 text-[11px] sm:text-[12px] font-semibold text-slate-600">
          {/* Today Registration with Live Indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>
              Today Registration: <strong className="font-bold text-emerald-700">{todayCount}</strong>
            </span>
          </div>

          <div className="h-3 w-px bg-slate-200 shrink-0" />

          {/* Enrolled Participants - shifted left */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Users className="h-3.5 w-3.5 text-[#1f0a77] shrink-0" />
            <span>
              Enrolled: <strong className="font-bold text-slate-900">{enrolledText}</strong>
            </span>
          </div>
        </div>

        {/* Join CTA Button - WhatsApp green */}
        <a
          href={regUrl}
          onClick={() => {
            trackEvent("register_click", { location: "mobile_sticky_cta" });
          }}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[15px] font-bold text-white shadow-[0_4px_16px_-2px_rgba(37,211,102,0.4)] transition-all active:scale-[0.98]"
        >
          <span>Join Now</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </a>
      </div>
    </aside>
  );
}
