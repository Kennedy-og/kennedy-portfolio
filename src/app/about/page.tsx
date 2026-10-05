import Link from "next/link";
import type { Metadata } from "next";
import { readPortfolioData } from "@/lib/portfolio-store";

export const metadata: Metadata = {
  title: "About | Kennedy",
  description: "Learn about Kennedy's approach to data analytics and practical business insight.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const data = await readPortfolioData();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-neutral-900 dark:text-white">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#67635f] dark:text-neutral-300">About</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#17171a] dark:text-white">
            {data.profile.headline}
          </h1>
        </div>
        <Link href="/" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#17171a] transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-neutral-900 dark:text-white">
          Back home
        </Link>
      </div>

      <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <p className="text-base leading-8 text-[#4d4b49] dark:text-neutral-300">{data.profile.bio}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e9dfd6] bg-[#f7f1ea]/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/70">
            <h2 className="text-lg font-semibold text-[#17171a] dark:text-white">What I do</h2>
            <p className="mt-3 text-sm leading-6 text-[#4d4b49] dark:text-neutral-300">
              Data analysis. Dashboarding. Decision support.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e9dfd6] bg-[#f7f1ea]/80 p-5 dark:border-neutral-800 dark:bg-neutral-900/70">
            <h2 className="text-lg font-semibold text-[#17171a] dark:text-white">Approach</h2>
            <p className="mt-3 text-sm leading-6 text-[#4d4b49] dark:text-neutral-300">
              Understand the decision. Review the data. Communicate the answer.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
