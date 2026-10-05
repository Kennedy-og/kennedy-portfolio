import { redirect } from "next/navigation";
import Link from "next/link";
import { requestResetAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string; email?: string }>;
}) {
  const authed = await requireAdmin();
  if (authed) {
    redirect("/admin");
  }

  const params = await searchParams;
  const message = params.message || "";
  const email = params.email || "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d0f] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111315]/90 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
          Password recovery
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Reset password
        </h1>
        <p className="mt-3 text-sm text-neutral-300">
          Enter your admin email address and we’ll send a one-time code to continue.
        </p>

        <form action={requestResetAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
              Admin email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              defaultValue={email}
              placeholder="you@yourdomain.com"
              className="w-full rounded-xl border border-white/10 bg-[#181b1e] px-3 py-2.5 text-sm text-white placeholder:text-neutral-400 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
              required
            />
          </div>

          {message ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">{message}</p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900"
          >
            Send verification code
          </button>

          <div className="text-center text-sm">
            <Link href="/admin/login" className="font-medium text-[#17171a] underline decoration-[#17171a]/30 underline-offset-4 dark:text-white dark:decoration-white/30">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
