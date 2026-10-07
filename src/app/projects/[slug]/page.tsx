import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { readPortfolioData } from "@/lib/portfolio-store";
import ProjectVisual from "@/app/components/ProjectVisual";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await readPortfolioData();
  const project = data.projects.find((item) => item.id === slug && item.published);

  return {
    title: project ? `${project.title} | Kennedy` : "Project | Kennedy",
    description: project?.summary ?? "Explore Kennedy's data analytics project work.",
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await readPortfolioData();
  const project = data.projects.find((item) => item.id === slug && item.published);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-4xl px-6 py-16 text-neutral-900 dark:text-white">
      <div className="mb-8">
        <Link href="/" className="text-sm font-medium uppercase tracking-[0.2em] text-[#111111] transition-opacity hover:opacity-80">
          ← Back home
        </Link>
      </div>

      <article className="glass-panel min-w-0 rounded-4xl p-6 sm:p-8">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#111111]">
          {project.category}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#111111]">
          {project.title}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-[#111111]">
          {project.description}
        </p>

        <div className="mt-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#111111]">Project visuals</p>
          <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-black/10 dark:border-white/10">
            <ProjectVisual project={project} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-[#e9dfd6] bg-[#f9f4f0] px-2.5 py-1 text-[11px] text-[#111111] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            >
              {tool}
            </span>
          ))}
        </div>

        <div className="project-detail-outcomes">
          <div className="project-detail-outcome">
            <p className="project-detail-label">
              Problem
            </p>
            <p className="project-detail-copy">
              {project.problem}
            </p>
          </div>

          <div className="project-detail-outcome">
            <p className="project-detail-label">
              Approach / How I Built It
            </p>
            <p className="project-detail-copy">
              {project.approach}
            </p>
          </div>

          <div className="project-detail-outcome">
            <p className="project-detail-label">
              Output / Result
            </p>
            <p className="project-detail-copy">
              {project.outcome}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900"
            >
              View GitHub
            </a>
          ) : null}
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-medium text-[#17171a] transition-transform duration-300 hover:-translate-y-0.5 dark:border-white/10 dark:text-white"
            >
              Live demo
            </a>
          ) : null}
        </div>
      </article>
    </main>
  );
}
