"use client";

import Image from "next/image";
import { useState } from "react";
import type { Project } from "@/lib/portfolio-store";

export default function ProjectVisual({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="project-visual" aria-label={`${project.title} project visual`}>
      {project.image && !failed ? (
        <Image
          src={project.image}
          alt={`${project.title} dashboard or project visual`}
          fill
          sizes="(max-width: 900px) 100vw, 72vw"
          className="project-visual-image"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="project-visual-fallback">
          <span className="project-visual-kicker">{project.category}</span>
          <strong>{project.title}</strong>
          <div className="project-visual-lines" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
          <span className="project-visual-note">Visual not included in the current project data</span>
        </div>
      )}
      <div className="project-visual-overlay" aria-hidden="true" />
    </div>
  );
}
