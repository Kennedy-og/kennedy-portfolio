"use client";

import { useState } from "react";
import type { PortfolioData } from "@/lib/portfolio-store";

type CapabilityRowsProps = {
  skills: PortfolioData["skills"];
};

export default function CapabilityRows({ skills }: CapabilityRowsProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="capability-list">
      {skills.map((group, index) => {
        const isOpen = open === index;
        return (
          <div key={group.category} className={`capability-row ${isOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="capability-trigger"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className="capability-index">0{index + 1}</span>
              <span className="capability-title">{group.category}</span>
              <span className="capability-arrow" aria-hidden="true">↗</span>
            </button>
            <div className="capability-panel" aria-hidden={!isOpen}>
              <div className="capability-panel-inner">
                {group.items.map((item) => (
                  <span key={item} className="capability-item">{item}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
