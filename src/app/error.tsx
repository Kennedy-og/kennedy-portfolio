"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3efe9] px-6 text-black">
      <div className="w-full max-w-lg text-center">
        <p className="text-xs font-medium uppercase tracking-[0.24em]">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">This page needs another try.</h1>
        <p className="mt-4 text-base text-[#4d4b49]">
          The page could not load right now. Please try again.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-8 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
