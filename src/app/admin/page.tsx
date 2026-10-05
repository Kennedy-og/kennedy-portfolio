import Link from "next/link";
import { redirect } from "next/navigation";
import AdminDashboard from "@/app/admin/dashboard";
import { logoutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { readContactMessages, readPortfolioData } from "@/lib/portfolio-store";

export default async function AdminPage() {
  const isAuthed = await requireAdmin();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  const data = await readPortfolioData();
  const messages = await readContactMessages();

  return (
    <div className="admin-page px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Overview</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/messages" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#17171a] dark:border-white/10 dark:bg-neutral-900 dark:text-white">Messages ({messages.length})</Link>
          <Link href="/admin/projects" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900">Projects</Link>
          <form action={logoutAction}>
            <button type="submit" className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">Sign Out</button>
          </form>
        </div>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">Projects</p>
          <p className="mt-4 text-3xl font-semibold">{data.projects.length}</p>
        </div>
        <div className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">Published</p>
          <p className="mt-4 text-3xl font-semibold">{data.projects.filter((item) => item.published).length}</p>
        </div>
        <div className="glass-panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">Unread</p>
          <p className="mt-4 text-3xl font-semibold">{messages.filter((item) => !item.read).length}</p>
        </div>
      </div>

      <AdminDashboard initialData={data} />
    </div>
  );
}
