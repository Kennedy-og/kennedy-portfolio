export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-[#f3efe9] px-6 text-black">
      <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
        Loading
      </div>
    </main>
  );
}
