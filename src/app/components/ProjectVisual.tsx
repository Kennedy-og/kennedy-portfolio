"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/portfolio-store";

export default function ProjectVisual({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <div className="project-visual" aria-label={`${project.title} project visual`}>
      {project.image && !failed ? (
        <button
          type="button"
          className="project-visual-trigger"
          aria-label={`View full-size image: ${project.title}`}
          onClick={() => setIsOpen(true)}
        >
          <Image
            src={project.image}
            alt={`${project.title} dashboard or project visual`}
            fill
            sizes="(max-width: 900px) 100vw, 72vw"
            className="project-visual-image"
            onError={() => setFailed(true)}
          />
        </button>
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
      {project.image && !failed ? (
        <dialog
          ref={dialogRef}
          className="project-image-dialog"
          aria-label={`Full-size image: ${project.title}`}
          onClose={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              setIsOpen(false);
            }
          }}
        >
          <button
            type="button"
            className="project-image-close"
            aria-label="Close full-size image"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
          <div className="project-image-dialog-media">
            <Image
              src={project.image}
              alt={`${project.title} full-size project visual`}
              fill
              sizes="(min-width: 1667px) 1600px, 96vw"
              className="project-image-dialog-image"
            />
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
