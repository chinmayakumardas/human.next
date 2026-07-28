


"use client";

import { useEffect, useState, useMemo } from "react";
import anime from "animejs";

export default function ChallengeCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 70,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { startDate, endDate } = useMemo(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + 70);
    return { startDate: start, endDate: end };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      animateNumber(".days", days);
      animateNumber(".hours", hours);
      animateNumber(".minutes", minutes);
      animateNumber(".seconds", seconds, true);
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  const animateNumber = (selector: string, newVal: number, isSeconds = false) => {
    const el = document.querySelector(selector) as HTMLElement;
    if (!el) return;

    const current = parseInt(el.textContent || "0", 10);
    if (current !== newVal) {
      anime({
        targets: el,
        innerHTML: [current, newVal],
        duration: isSeconds ? 600 : 900,
        easing: "easeOutExpo",
        round: 1,
      });
    }
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-slate-50 via-white to-zinc-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-lg mx-auto">
        {/* Main Card - Sleek Shadcn-style */}
        <div className=" overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-zinc-100">
            <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
              Next Goal
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">70-day challenge</p>
          </div>

          {/* Countdown */}
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-2 gap-6 md:gap-8 text-center">
              {/* Days */}
              <div className="space-y-3">
                <div className="text-5xl md:text-6xl font-mono font-bold tabular-nums days text-zinc-900">
                  {timeLeft.days}
                </div>
                <p className="text-xs md:text-sm font-medium tracking-widest text-zinc-500">DAYS</p>
              </div>

              {/* Hours */}
              <div className="space-y-3">
                <div className="text-5xl md:text-6xl font-mono font-bold tabular-nums hours text-zinc-900">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <p className="text-xs md:text-sm font-medium tracking-widest text-zinc-500">HOURS</p>
              </div>

              {/* Minutes */}
              <div className="space-y-3">
                <div className="text-5xl md:text-6xl font-mono font-bold tabular-nums minutes text-zinc-900">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <p className="text-xs md:text-sm font-medium tracking-widest text-zinc-500">MINUTES</p>
              </div>

              {/* Seconds */}
              <div className="space-y-3">
                <div className="text-5xl md:text-6xl font-mono font-bold tabular-nums seconds text-secondary">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <p className="text-xs md:text-sm font-medium tracking-widest text-zinc-500">SECONDS</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-10">
              <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 transition-all duration-1000 rounded-full"
                  style={{ width: `${Math.max(0, ((70 - timeLeft.days) / 70) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1.5 font-mono">
                <span>PROGRESS</span>
                <span>{Math.max(0, 70 - timeLeft.days)} / 70 DAYS</span>
              </div>
            </div>
          </div>

          {/* Footer Dates */}
          <div className="px-8 py-6 bg-zinc-50 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-xs font-medium">START</span>
              <span className="font-mono text-zinc-700">
                {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-zinc-400 text-xs font-medium">END</span>
              <span className="font-mono text-zinc-700">
                {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
}