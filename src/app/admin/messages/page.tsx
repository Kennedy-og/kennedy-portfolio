import { redirect } from "next/navigation";
import { clearContactMessagesAction, deleteMessageAction, markMessageReadAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { readContactMessages } from "@/lib/portfolio-store";

export default async function AdminMessagesPage() {
  const isAuthed = await requireAdmin();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  const messages = await readContactMessages();

  return (
    <main className="admin-page mx-auto max-w-6xl px-6 py-12 text-neutral-900 dark:text-white">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">Inbox</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Messages</h1>
        </div>

        <form action={clearContactMessagesAction}>
          <button type="submit" className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
            Clear All
          </button>
        </form>
      </div>

      {messages.length === 0 ? (
        <div className="glass-panel rounded-[2rem] p-8 text-sm text-[#4d4b49] dark:text-neutral-300">No contact messages yet.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article key={message.id} className={`glass-panel rounded-[1.5rem] p-5 ${message.read ? "opacity-80" : ""}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{message.name}</h2>
                  <p className="text-sm text-[#4d4b49] dark:text-neutral-300">{message.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#e9dfd6] bg-[#f9f4f0] px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#4d4b49] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
                    {message.read ? "Read" : "Unread"}
                  </span>
                  {!message.read ? (
                    <form action={markMessageReadAction}>
                      <input type="hidden" name="id" value={message.id} />
                      <button type="submit" className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-[#17171a] dark:border-white/10 dark:text-white">Mark read</button>
                    </form>
                  ) : null}
                  <form action={deleteMessageAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <button type="submit" className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">Delete</button>
                  </form>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#e9dfd6] bg-[#f7f1ea]/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/70">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#67635f] dark:text-neutral-300">{message.subject}</p>
                <p className="mt-3 text-sm leading-6 text-[#4d4b49] dark:text-neutral-300">{message.message}</p>
              </div>

              <p className="mt-4 text-xs text-[#67635f] dark:text-neutral-400">{new Date(message.createdAt).toLocaleString()}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
