import Link from "next/link";
import type { Metadata } from "next";
import { readPortfolioData } from "@/lib/portfolio-store";
import { submitContactAction } from "./actions";

export const metadata: Metadata = {
  title: "Contact | Kennedy",
  description: "Start a conversation with Kennedy about analytics, dashboards, and data-driven work.",
  alternates: { canonical: "/contact" },
};

const fieldClassName = "min-h-11 w-full rounded-xl border border-black/10 bg-white/80 px-3 py-2.5 text-sm text-neutral-900 shadow-sm shadow-black/[0.02] outline-none transition-colors hover:border-black/15 focus-visible:border-neutral-500 focus-visible:ring-2 focus-visible:ring-neutral-900/20 dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-100 dark:hover:border-white/20 dark:focus-visible:border-neutral-400 dark:focus-visible:ring-white/20";

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; error?: string }>;
}) {
  const data = await readPortfolioData();
  const params = searchParams ? await searchParams : {};

  return (
    <main className="contact-page min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-5xl">
      <div className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6e6e73] dark:text-neutral-300">
            Contact
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-50">
            Need a clearer view?
          </h1>
        </div>
        <Link href="/" className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm shadow-black/[0.03] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-neutral-900">
          Back home
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <aside className="glass-panel rounded-3xl p-6 sm:p-7">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Reach me</h2>
          <ul className="mt-5 space-y-3 text-sm text-[#6e6e73] dark:text-neutral-300">
            <li>
              <a href={`mailto:${data.profile.email}`} className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-black/10 bg-white/60 px-3 py-2 font-medium text-neutral-900 transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-neutral-900">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
                  <path d="m5 7 7 6 7-6" />
                </svg>
                {data.profile.email}
              </a>
            </li>
            {data.contact.resumeUrl ? (
              <li>
                <a href={data.contact.resumeUrl} download className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-black/10 bg-white/60 px-3 py-2 font-medium text-neutral-900 transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-neutral-900">
                  Download resume (PDF)
                </a>
              </li>
            ) : null}
            {data.socialLinks.filter((link) => link.label === "X" || link.label === "WhatsApp" || link.label === "LinkedIn" || link.label === "GitHub").map((link) => (
              <li key={link.label}>
                <a href={link.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-black/10 bg-white/60 px-3 py-2 font-medium text-neutral-900 transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:ring-offset-2 dark:border-white/10 dark:bg-neutral-900/60 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus-visible:ring-white/30 dark:focus-visible:ring-offset-neutral-900">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    {link.label === "X" ? (
                      <path d="M18.9 2h3.4l-7.4 8.5L22.9 22h-6.7l-5.2-7.2L5.2 22H1.8l7.9-9.1L1 2h6.9l4.7 6.7L18.9 2Zm-1.2 18h1.9L7.1 3.9H5.1L17.7 20Z" />
                    ) : link.label === "WhatsApp" ? (
                      <path d="M12.04 2.1c-5.45 0-9.88 4.31-9.88 9.62 0 1.7.45 3.35 1.3 4.8L2.2 22l5.61-1.46a9.6 9.6 0 0 0 4.23 1.01c5.45 0 9.88-4.31 9.88-9.62 0-5.31-4.43-9.62-9.88-9.62Zm5.58 13.64c-.24.67-1.39 1.26-1.92 1.34-.49.08-1.12.11-3.6-.75-3.05-1.09-5.02-3.74-5.18-3.92-.16-.18-1.28-1.71-1.28-3.27 0-1.56.82-2.34 1.11-2.65.29-.31.63-.38.84-.38h.6c.19 0 .45.01.69.52.29.6.98 2.07 1.06 2.22.08.15.13.34.03.54-.1.2-.16.33-.32.51-.16.18-.34.4-.49.54-.16.15-.33.32-.14.64.2.32.9 1.49 1.92 2.42 1.33 1.19 2.45 1.58 2.78 1.75.33.17.52.14.7-.09.19-.24.8-1 .99-1.35.19-.35.39-.29.66-.17.27.12 1.7.8 1.99.95.29.15.48.22.55.35.07.13.07.75-.17 1.41Z" />
                    ) : link.label === "LinkedIn" ? (
                      <path d="M6.94 8.5A1.56 1.56 0 1 1 6.93 5.38a1.56 1.56 0 0 1 .01 3.12Zm-1.26 1.2h2.52v8.45H5.68V9.7Zm4.13 0h2.42v1.15h.03c.34-.64 1.17-1.32 2.4-1.32 2.57 0 3.04 1.69 3.04 3.88v6.74h-2.53v-6.3c0-1.5-.03-3.42-2.08-3.42-2.08 0-2.4 1.63-2.4 3.31v6.41h-2.53V9.7Z" />
                    ) : link.label === "GitHub" ? (
                      <path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.49.09.67-.21.67-.47v-1.65c-2.72.59-3.29-1.15-3.29-1.15-.45-1.13-1.09-1.43-1.09-1.43-.89-.61.07-.6.07-.6.98.07 1.5 1.01 1.5 1.01.88 1.5 2.3 1.07 2.86.82.09-.64.35-1.07.63-1.32-2.17-.25-4.46-1.08-4.46-4.81 0-1.06.38-1.93 1-2.61-.1-.25-.44-1.3.1-2.7 0 0 .82-.26 2.69 1a9.34 9.34 0 0 1 4.89 0c1.87-1.26 2.69-1 2.69-1 .54 1.4.2 2.45.1 2.7.62.68 1 1.55 1 2.61 0 3.74-2.29 4.56-4.47 4.8.35.31.67.92.67 1.86v2.76c0 .26.18.57.68.47A9.8 9.8 0 0 0 12 2.2Z" />
                    ) : (
                      <path d="M12.04 2.1c-5.45 0-9.88 4.31-9.88 9.62 0 1.7.45 3.35 1.3 4.8L2.2 22l5.61-1.46a9.6 9.6 0 0 0 4.23 1.01c5.45 0 9.88-4.31 9.88-9.62 0-5.31-4.43-9.62-9.88-9.62Zm5.58 13.64c-.24.67-1.39 1.26-1.92 1.34-.49.08-1.12.11-3.6-.75-3.05-1.09-5.02-3.74-5.18-3.92-.16-.18-1.28-1.71-1.28-3.27 0-1.56.82-2.34 1.11-2.65.29-.31.63-.38.84-.38h.6c.19 0 .45.01.69.52.29.6.98 2.07 1.06 2.22.08.15.13.34.03.54-.1.2-.16.33-.32.51-.16.18-.34.4-.49.54-.16.15-.33.32-.14.64.2.32.9 1.49 1.92 2.42 1.33 1.19 2.45 1.58 2.78 1.75.33.17.52.14.7-.09.19-.24.8-1 .99-1.35.19-.35.39-.29.66-.17.27.12 1.7.8 1.99.95.29.15.48.22.55.35.07.13.07.75-.17 1.41Z" />
                    )}
                  </svg>
                  {link.label === "X" ? "@kex_crypt" : link.label}
                </a>
              </li>
            ))}
            <li className="pt-1 text-[#86868b] dark:text-neutral-400">Location: {data.profile.location}</li>
          </ul>
        </aside>

        <form action={submitContactAction} className="glass-panel rounded-3xl p-6 sm:p-7">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#6e6e73] dark:text-neutral-300">Name</label>
              <input id="name" name="name" required className={fieldClassName} />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#6e6e73] dark:text-neutral-300">Email</label>
              <input id="email" name="email" type="email" required className={fieldClassName} />
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[#6e6e73] dark:text-neutral-300">Subject</label>
            <input id="subject" name="subject" required className={fieldClassName} />
          </div>

          <div className="mt-5">
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#6e6e73] dark:text-neutral-300">Message</label>
            <textarea id="message" name="message" rows={6} required className={fieldClassName} />
          </div>

          <ContactFeedback params={params} />

          <button type="submit" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:ring-offset-2 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white dark:focus-visible:ring-white/40 dark:focus-visible:ring-offset-neutral-900">
            Send message
          </button>
        </form>
      </div>
      </div>
    </main>
  );
}

function ContactFeedback({ params }: { params: { success?: string; error?: string } }) {
  if (params.success === "1") {
    return <p role="status" aria-live="polite" className="mt-4 text-sm text-green-700 dark:text-green-400">Your message was sent successfully. I&apos;ll get back to you soon.</p>;
  }
  if (params.error === "missing") {
    return <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">Please complete all required fields before sending.</p>;
  }
  if (params.error === "invalid-email") {
    return <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">Please enter a valid email address.</p>;
  }
  return null;
}
