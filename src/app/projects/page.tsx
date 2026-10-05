import Link from "next/link";
import type { Metadata } from "next";
import { readPortfolioData } from "@/lib/portfolio-store";

export const metadata: Metadata = {
  title: "Projects | Kennedy",
  description: "Explore Kennedy's data analytics projects, dashboards, and business insight work.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const data = await readPortfolioData();
  const projects = data.projects.filter((project) => project.published);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 text-neutral-900 dark:text-white">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">Portfolio</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#17171a] dark:text-white">Selected work</h1>
        </div>
        <Link href="/" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#17171a] transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-neutral-900 dark:text-white">Back home</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {projects.map((project) => (
          <Link key={project.id} href={`/projects/${project.id}`} className="group block">
            <article className="glass-panel h-full rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(15,23,42,0.12)] dark:hover:shadow-[0_28px_60px_rgba(0,0,0,0.32)]">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">{project.category}</p>
              <h2 className="mt-5 text-xl font-semibold text-[#17171a] dark:text-white">{project.title}</h2>
              <p className="mt-4 text-sm leading-6 text-[#4d4b49] dark:text-neutral-300">{project.summary}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-[#e9dfd6] bg-[#f9f4f0] px-2.5 py-1 text-[11px] text-[#4d4b49] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">{tool}</span>
                ))}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
