"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { id: "step-1", label: "Exposure" },
  { id: "step-2", label: "Risk" },
  { id: "step-3", label: "Strategies" },
  { id: "step-4", label: "Scenarios" },
  { id: "step-5", label: "Hedge ratio" },
  { id: "step-6", label: "Memo" },
];

// Sticky workflow indicator — anchored to the top of the viewport while the
// user scrolls through the steps. Highlights the section currently in view
// and lets the user jump between steps.
export default function StickyProgress() {
  const [active, setActive] = useState<string>("step-1");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    STEPS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(s.id);
            }
          });
        },
        { threshold: 0.25, rootMargin: "-20% 0px -50% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const activeIdx = STEPS.findIndex((s) => s.id === active);

  return (
    <div className="sticky top-0 z-30 bg-ink-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between gap-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 hidden sm:block">
            Workflow
          </p>
          <div className="flex items-center gap-1.5 overflow-x-auto flex-1">
            {STEPS.map((s, i) => {
              const isActive = active === s.id;
              const isPast = i < activeIdx;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-accent-500 text-ink-900 font-semibold shadow-glow-soft"
                      : isPast
                        ? "text-success-400 hover:bg-white/[0.04]"
                        : "text-white/50 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="font-mono opacity-70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-px relative bg-white/5">
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-accent-400 to-accent-700 transition-all duration-500"
            style={{
              width: `${((activeIdx + 1) / STEPS.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
