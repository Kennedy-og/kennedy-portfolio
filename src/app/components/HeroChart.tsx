"use client";

import { useEffect, useState } from "react";

const stages = [
  { label: "Google Sheet", detail: "Daily Tracker" },
  { label: "pandas", detail: "Clean & validate" },
  { label: "Streamlit", detail: "Live dashboard" },
];

export default function HeroChart() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % stages.length);
    }, 1600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm rounded-[1.6rem] border border-black/10 bg-white/80 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
      <span className="mb-6 block text-xs font-medium uppercase tracking-[0.2em] text-[#4d4d52] dark:text-neutral-400">
        OFM Operations Dashboard — real pipeline
      </span>

      <div className="flex flex-col gap-4">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center gap-3">
            <div
              className={`h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-500 ${
                i === active
                  ? "bg-[#17171a] dark:bg-white"
                  : "bg-[#cbc7c1] dark:bg-neutral-700"
              }`}
            />
            <div>
              <p
                className={`text-sm font-medium transition-colors duration-500 ${
                  i === active
                    ? "text-[#17171a] dark:text-white"
                    : "text-[#5a5a5d] dark:text-neutral-600"
                }`}
              >
                {stage.label}
              </p>
              <p className="text-xs text-[#76767b] dark:text-neutral-600">
                {stage.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}