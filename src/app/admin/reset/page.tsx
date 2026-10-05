import Link from "next/link";
import { redirect } from "next/navigation";
import { OtpCooldown } from "@/app/admin/OtpCooldown";
import { resendResetOtpAction, verifyResetOtpAction } from "@/app/admin/actions";
import { getPasswordResetStatus, getAdminEmail, requireAdmin } from "@/lib/auth";

function getResetCooldownSeconds(resendAllowedAt: number) {
  if (!resendAllowedAt) {
    return 0;
  }

  return Math.max(0, Math.ceil((resendAllowedAt - Date.now()) / 1000));
}

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string; error?: string }>;
}) {
  const authed = await requireAdmin();
  if (authed) {
    redirect("/admin");
  }

  const params = await searchParams;
  const resetStatus = await getPasswordResetStatus();
  const adminEmail = await getAdminEmail();

  if (!resetStatus.active) {
    redirect("/admin/forgot-password?message=Your reset session has expired. Please request a new code.");
  }

  const statusMessage = params.message || "";
  const cooldown = getResetCooldownSeconds(resetStatus.resendAllowedAt);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0d0f] px-6 py-12 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#111315]/90 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-400">
          Verification
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
          Enter verification code
        </h1>
        <p className="mt-3 text-sm text-neutral-300">
          We sent a 6-digit code to {adminEmail}. Enter it below to continue.
        </p>

        <form action={verifyResetOtpAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-medium text-white">
              One-time password
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              className="w-full rounded-xl border border-white/10 bg-[#181b1e] px-3 py-2.5 text-center text-lg tracking-[0.35em] text-white placeholder:text-neutral-400 outline-none transition focus:border-white/30 focus:ring-2 focus:ring-white/10"
              required
            />
          </div>

          {statusMessage ? (
            <p className="text-sm text-red-700 dark:text-red-400">{statusMessage}</p>
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              className="flex-1 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition-transform duration-300 hover:-translate-y-0.5 dark:bg-white dark:text-neutral-900"
            >
              Verify code
            </button>
          </div>

          <div className="space-y-2 text-center">
            <button
              type="submit"
              formAction={resendResetOtpAction}
              disabled={cooldown > 0}
              className="text-sm font-medium text-[#17171a] underline decoration-[#17171a]/30 underline-offset-4 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:decoration-white/30"
            >
              Resend OTP
            </button>
            <OtpCooldown secondsRemaining={cooldown} />
          </div>

          <div className="text-center text-sm">
            <Link href="/admin/login" className="font-medium text-[#17171a] underline decoration-[#17171a]/30 underline-offset-4 dark:text-white dark:decoration-white/30">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
