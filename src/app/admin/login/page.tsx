import Link from "next/link";
import { loginAction } from "@/app/admin/actions";
import { PasswordField } from "@/app/admin/PasswordField";
import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; message?: string }>;
}) {
  const authed = await requireAdmin();
  if (authed) {
    redirect("/admin");
  }

  const params = await searchParams;
  const error = params.error === "invalid"
    ? "Invalid username or password."
    : params.error === "locked"
      ? "Too many failed attempts. Please try again later."
      : "";
  const successMessage = params.success === "password-reset" ? params.message || "Password updated successfully." : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d0f] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111315]/90 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
          Portfolio admin
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Log in
        </h1>
        <p className="mt-3 text-sm text-neutral-300">
          Sign in to manage the portfolio content securely.
        </p>

        <form action={loginAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-white">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              defaultValue="admin"
              className="w-full rounded-xl border border-white/10 bg-[#181b1e] px-3 py-2.5 text-sm text-white placeholder:text-neutral-400 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
              Password
            </label>
            <PasswordField id="password" name="password" autoComplete="current-password" />
          </div>

          {error ? (
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          ) : null}

          {successMessage ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">{successMessage}</p>
          ) : null}

          <div className="text-right">
            <Link href="/admin/forgot-password" className="text-sm font-medium text-[#17171a] underline decoration-[#17171a]/30 underline-offset-4 hover:text-black dark:text-white dark:decoration-white/30 dark:hover:text-white">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
