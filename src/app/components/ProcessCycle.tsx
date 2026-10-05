"use client";

import { useEffect, useState } from "react";

const steps = [
  "Understand",
  "Explore",
  "Clean",
  "Analyze",
  "Communicate",
  "Recommend",
];

export default function ProcessCycle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % steps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
      Right now:{" "}
      <span className="text-neutral-900 transition-opacity duration-500 dark:text-white">
        {steps[index]}
      </span>
    </p>
  );
}