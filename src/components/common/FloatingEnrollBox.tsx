import { useState, useEffect } from "react";
import {
  Award,
  Clock,
  Calendar,
  Users,
  TrendingUp,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { programConfig } from "@/lib/programConfig";
import { trackEvent } from "@/lib/analytics";
import { useEnrollmentStats } from "@/hooks/useEnrollmentStats";

interface FloatingEnrollBoxProps {
  registrationUrl?: string;
  isMinimized?: boolean;
  onToggleMinimize?: (minimized: boolean) => void;
}

export function FloatingEnrollBox({
  registrationUrl,
  isMinimized: controlledMinimized,
  onToggleMinimize,
}: FloatingEnrollBoxProps) {
  const [internalMinimized, setInternalMinimized] = useState(false);
  const isMinimized = controlledMinimized !== undefined ? controlledMinimized : internalMinimized;

  const handleToggleMinimize = (val: boolean) => {
    setInternalMinimized(val);
    onToggleMinimize?.(val);
  };

  const { todayCount, enrolledText, countdown } = useEnrollmentStats();
  const regUrl = registrationUrl || programConfig.registrationUrl;

  // When minimized by user: show a sleek compact floating trigger tab
  if (isMinimized) {
    return (
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <button
          onClick={() => handleToggleMinimize(false)}
          className="group flex items-center gap-2 rounded-l-2xl border-y border-l border-slate-200 bg-white/95 px-3 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all hover:bg-slate-50 hover:pl-4"
          aria-label="Expand enrollment box"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-left pr-1">
            <span className="block text-[12px] font-extrabold text-slate-900 leading-tight">
              Book Seat Now
            </span>
            <span className="block text-[10px] font-semibold text-teal-600">
              {enrolledText} Enrolled
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Quick Enrollment Information"
      className="fixed right-3 xl:right-5 top-1/2 -translate-y-1/2 z-50 hidden lg:block w-[290px] xl:w-[305px] select-none"
    >
      <div className="relative rounded-2xl border border-slate-200/90 bg-white p-4 xl:p-5 shadow-[0_16px_45px_-8px_rgba(0,0,0,0.14),0_2px_8px_rgba(0,0,0,0.04)] transition-all">
        {/* Minimize Button */}
        <button
          onClick={() => handleToggleMinimize(true)}
          className="absolute right-3.5 top-3.5 grid h-6 w-6 place-items-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          title="Minimize"
          aria-label="Minimize enrollment box"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* 1. Heading */}
        <div className="pr-6">
          <h3 className="text-[18px] xl:text-[19px] font-black tracking-tight text-slate-900 leading-tight">
            Book Your Seat Now!
          </h3>
        </div>

        <div className="mt-4 space-y-3 xl:space-y-3.5 text-left">
          {/* Program & Certification */}
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
              <Award className="h-4.5 w-4.5 stroke-[2]" />
            </span>
            <div className="leading-tight">
              <span className="block text-[12px] xl:text-[12.5px] font-bold text-slate-900">
                1 MILLION AI SUPERSTARS PROGRAM
              </span>
              <span className="text-[11px] font-medium text-slate-500">
                IIT Madras Pravartak Partner
              </span>
            </div>
          </div>

          {/* 2. Duration */}
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
              <Clock className="h-4.5 w-4.5 stroke-[2]" />
            </span>
            <div className="leading-tight">
              <span className="block text-[12.5px] xl:text-[13px] font-bold text-slate-900">
                Duration
              </span>
              <span className="text-[12px] font-semibold text-slate-600">
                10 Days
              </span>
            </div>
          </div>

          {/* Next Batch Starts on + Countdown */}
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
              <Calendar className="h-4.5 w-4.5 stroke-[2]" />
            </span>
            <div className="flex-1 leading-tight">
              <span className="block text-[12.5px] xl:text-[13px] font-bold text-slate-900">
                Next Batch Starts on
              </span>

              {/* Countdown boxes matching reference design */}
              <div className="mt-2 grid grid-cols-4 gap-1 xl:gap-1.5">
                <div className="rounded-lg border border-slate-100 bg-slate-50/90 py-1.5 text-center">
                  <span className="block font-mono text-[14px] xl:text-[15px] font-extrabold text-teal-600 leading-none">
                    {countdown.days}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    days
                  </span>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/90 py-1.5 text-center">
                  <span className="block font-mono text-[14px] xl:text-[15px] font-extrabold text-teal-600 leading-none">
                    {countdown.hours}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    hours
                  </span>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/90 py-1.5 text-center">
                  <span className="block font-mono text-[14px] xl:text-[15px] font-extrabold text-teal-600 leading-none">
                    {countdown.mins}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    mins
                  </span>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/90 py-1.5 text-center">
                  <span className="block font-mono text-[14px] xl:text-[15px] font-extrabold text-teal-600 leading-none">
                    {countdown.secs}
                  </span>
                  <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    secs
                  </span>
                </div>
              </div>

              <span className="mt-1.5 block text-[10.5px] font-medium text-slate-500">
                Next Batch Starts on {programConfig.batch.displayStart} at {programConfig.batch.classTime}
              </span>
            </div>
          </div>

          {/* 3. Today Registration */}
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
              <TrendingUp className="h-4.5 w-4.5 stroke-[2]" />
            </span>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="block text-[12.5px] xl:text-[13px] font-bold text-slate-900">
                  Today Registration
                </span>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="mt-0.5 inline-block text-[12.5px] font-extrabold text-emerald-600">
                {todayCount} Registrations Today
              </span>
            </div>
          </div>

          {/* 4. Enrolled Participants */}
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-600">
              <Users className="h-4.5 w-4.5 stroke-[2]" />
            </span>
            <div className="leading-tight">
              <span className="block text-[12.5px] xl:text-[13px] font-bold text-slate-900">
                Enrolled Participants
              </span>
              <span className="mt-0.5 block text-[15px] xl:text-[16px] font-black tracking-tight text-slate-900">
                {enrolledText}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Join Now CTA */}
        <a
          href={regUrl}
          onClick={() => trackEvent("register_click", { location: "floating_enroll_box" })}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#2563eb] py-3 text-[14.5px] xl:text-[15px] font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.38)] transition-all hover:bg-[#1d4ed8] hover:shadow-[0_6px_20px_rgba(37,99,235,0.48)] active:scale-[0.98]"
        >
          Join Now
        </a>
      </div>
    </aside>
  );
}
