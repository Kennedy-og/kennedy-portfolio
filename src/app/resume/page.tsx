import Link from "next/link";
import type { Metadata } from "next";
import { readPortfolioData } from "@/lib/portfolio-store";

export const metadata: Metadata = {
  title: "Resume | Kennedy",
  description: "Professional overview of Kennedy's analytics skills, experience, and availability.",
  alternates: { canonical: "/resume" },
};

export default async function ResumePage() {
  const data = await readPortfolioData();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-neutral-900 dark:text-white">
      <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">Resume</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#17171a] dark:text-white">Professional overview</h1>
        </div>
        <Link href="/" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#17171a] transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-neutral-900 dark:text-white">Back home</Link>
      </div>

      <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <p className="text-base leading-8 text-[#4d4b49] dark:text-neutral-300">
          Practical analytics. Clear dashboards. Better decisions.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e9dfd6] bg-[#f7f1ea]/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/70">
            <h2 className="text-lg font-semibold text-[#17171a] dark:text-white">Core strengths</h2>
            <ul className="mt-4 space-y-2 text-sm text-[#4d4b49] dark:text-neutral-300">
              {data.skills.flatMap((group) => group.items).slice(0, 8).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#e9dfd6] bg-[#f7f1ea]/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/70">
            <h2 className="text-lg font-semibold text-[#17171a] dark:text-white">Contact</h2>
            <ul className="mt-4 space-y-2 text-sm text-[#4d4b49] dark:text-neutral-300">
              <li>Email: <span className="break-all">{data.contact.email}</span></li>
              <li>Location: {data.contact.location}</li>
              <li>Availability: {data.profile.availability}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <a href={data.contact.resumeUrl} className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900">
            Download resume
          </a>
        </div>
      </div>
    </main>
  );
}
