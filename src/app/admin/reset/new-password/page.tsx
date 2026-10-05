import Link from "next/link";
import { redirect } from "next/navigation";
import { PasswordField } from "@/app/admin/PasswordField";
import { submitNewPasswordAction } from "@/app/admin/actions";
import { getPasswordResetStatus, requireAdmin } from "@/lib/auth";

export default async function NewPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const authed = await requireAdmin();
  if (authed) {
    redirect("/admin");
  }

  const status = await getPasswordResetStatus();
  if (!status.active || !status.verified) {
    redirect("/admin/forgot-password?message=Please complete the OTP step before creating a new password.");
  }

  const params = await searchParams;
  const errorMessage = params.message || "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d0f] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111315]/90 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
          Password reset
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Create new password
        </h1>
        <p className="mt-3 text-sm text-neutral-300">
          Use a strong password with at least 12 characters, uppercase and lowercase letters, a number, and a symbol.
        </p>

        <form action={submitNewPasswordAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
              New password
            </label>
            <PasswordField id="password" name="password" autoComplete="new-password" required />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-white">
              Confirm new password
            </label>
            <PasswordField id="confirmPassword" name="confirmPassword" autoComplete="new-password" required />
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900"
          >
            Update password
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
