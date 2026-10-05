import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { readPortfolioData } from "@/lib/portfolio-store";

export default async function AdminProjectsPage() {
  const isAuthed = await requireAdmin();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  const data = await readPortfolioData();

  return (
    <main className="admin-page mx-auto max-w-6xl px-6 py-12 text-neutral-900 dark:text-white">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">Projects</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Manage your work</h1>
        </div>
        <Link href="/admin" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#17171a] dark:border-white/10 dark:bg-neutral-900 dark:text-white">Back</Link>
      </div>

      <div className="mb-6 flex justify-end">
        <Link href="/admin#projects" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900">Add Project</Link>
      </div>

      <div className="space-y-4">
        {data.projects.map((project) => (
          <article key={project.id} className="glass-panel rounded-[1.5rem] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <p className="mt-1 text-sm text-[#4d4b49] dark:text-neutral-300">{project.category}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-[#e9dfd6] bg-[#f9f4f0] px-2.5 py-1 text-[#4d4b49] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                  {project.published ? "Published" : "Draft"}
                </span>
                {project.featured ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">Featured</span>
                ) : null}
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-[#4d4b49] dark:text-neutral-300">{project.summary}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/projects/${project.id}`} className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#17171a] dark:border-white/10 dark:text-white">Preview</Link>
              <button type="button" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900">Edit</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
