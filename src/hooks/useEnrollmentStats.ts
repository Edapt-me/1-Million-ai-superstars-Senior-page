import { useState, useEffect } from "react";

export interface EnrollmentStats {
  todayCount: number;
  enrolledText: string;
  countdown: {
    days: string;
    hours: string;
    mins: string;
    secs: string;
  };
}

export function useEnrollmentStats(): EnrollmentStats {
  const [todayCount, setTodayCount] = useState<number>(1);
  const [enrolledText, setEnrolledText] = useState<string>("10,000+");
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    mins: "00",
    secs: "00",
  });

  useEffect(() => {
    function updateCounters() {
      const now = new Date();

      // 1. Today Registration logic:
      // Increments by 1 every 15 minutes, resets after 24 hours (local midnight)
      const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
      const intervals15m = Math.floor(minutesSinceMidnight / 15);
      // Guarantee at least 1 so it's active even at 00:01
      setTodayCount(Math.max(1, intervals15m));

      // 2. Enrolled Participants logic:
      // Increases by 50 every 48 hours, starting from 10,000+ (anchor: 2026-09-28 00:00 IST)
      const anchorTime = new Date("2026-09-28T00:00:00+05:30").getTime();
      const currentTime = Date.now();
      const diffMs = Math.max(0, currentTime - anchorTime);
      const intervals48h = Math.floor(diffMs / (48 * 60 * 60 * 1000));
      const enrolledNum = 10000 + intervals48h * 50;
      setEnrolledText(`${enrolledNum.toLocaleString()}+`);

      // 3. Next Batch Countdown logic:
      // Target: October 3, 2026 at 8:30 PM IST (from programConfig)
      const targetTime = new Date("2026-10-03T20:30:00+05:30").getTime();
      const diffBatch = Math.max(0, targetTime - currentTime);
      const days = Math.floor(diffBatch / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffBatch / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffBatch / (1000 * 60)) % 60);
      const seconds = Math.floor((diffBatch / 1000) % 60);

      setCountdown({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        mins: String(minutes).padStart(2, "0"),
        secs: String(seconds).padStart(2, "0"),
      });
    }

    updateCounters();
    const interval = setInterval(updateCounters, 1000);
    return () => clearInterval(interval);
  }, []);

  return { todayCount, enrolledText, countdown };
}
