import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-6 text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <div className="w-full max-w-lg rounded-4xl border border-black/10 bg-white/80 p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-neutral-900/80">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#67635f] dark:text-neutral-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#17171a] dark:text-white">This page doesn’t exist yet.</h1>
        <p className="mt-4 text-sm leading-6 text-[#4d4b49] dark:text-neutral-300">The page you were looking for may have moved, or it may not be published yet.</p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900">Back to homepage</Link>
      </div>
    </main>
  );
}
