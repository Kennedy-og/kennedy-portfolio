"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearAdminSession,
  clearResetRecord,
  completePasswordReset,
  getAdminEmail,
  isLoginBlocked,
  requestPasswordReset,
  requireAdmin,
  resendPasswordResetOtp,
  setAdminSession,
  verifyAdminCredentials,
  verifyPasswordResetOtp,
} from "@/lib/auth";
import { writePortfolioData, readContactMessages, writeContactMessages } from "@/lib/portfolio-store";
import type { PortfolioData } from "@/lib/portfolio-store";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (await isLoginBlocked()) {
    redirect("/admin/login?error=locked");
  }

  const valid = await verifyAdminCredentials(username, password);
  if (!valid) {
    redirect("/admin/login?error=invalid");
  }

  await setAdminSession();
  redirect("/admin");
}

export async function requestResetAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const configuredEmail = (await getAdminEmail()).trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();

  const result = await requestPasswordReset(normalizedEmail);
  const params = new URLSearchParams({
    status: result.code,
    message: result.message,
    email: configuredEmail === normalizedEmail ? configuredEmail : "",
  });

  redirect(`/admin/reset?${params.toString()}`);
}

export async function resendResetOtpAction() {
  const result = await resendPasswordResetOtp();
  const params = new URLSearchParams({
    status: result.code,
    message: result.message,
  });

  redirect(`/admin/reset?${params.toString()}`);
}

export async function verifyResetOtpAction(formData: FormData) {
  const otp = String(formData.get("otp") ?? "").replace(/\s+/g, "");
  const result = await verifyPasswordResetOtp(otp);

  if (!result.success) {
    const params = new URLSearchParams({
      status: result.code,
      message: result.message,
    });
    redirect(`/admin/reset?${params.toString()}`);
  }

  redirect("/admin/reset/new-password");
}

export async function submitNewPasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    redirect("/admin/reset/new-password?error=mismatch&message=Passwords%20do%20not%20match.");
  }

  const result = await completePasswordReset(password);
  if (!result.success) {
    const params = new URLSearchParams({
      error: result.code,
      message: result.message,
    });
    redirect(`/admin/reset/new-password?${params.toString()}`);
  }

  await clearResetRecord();
  redirect("/admin/login?success=password-reset&message=Password%20updated%20successfully.");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function savePortfolioAction(formData: FormData) {
  const isAllowed = await requireAdmin();
  if (!isAllowed) {
    redirect("/admin/login");
  }

  const payload = String(formData.get("portfolioData") ?? "");

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    throw new Error("Invalid JSON format. Please correct the portfolio data and try again.");
  }

  await writePortfolioData(parsed as PortfolioData);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function clearContactMessagesAction() {
  const isAllowed = await requireAdmin();
  if (!isAllowed) {
    redirect("/admin/login");
  }

  await writeContactMessages([]);
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

export async function markMessageReadAction(formData: FormData) {
  const isAllowed = await requireAdmin();
  if (!isAllowed) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const messages = await readContactMessages();
  const updated = messages.map((message) =>
    message.id === id ? { ...message, read: true } : message,
  );

  await writeContactMessages(updated);
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}

export async function deleteMessageAction(formData: FormData) {
  const isAllowed = await requireAdmin();
  if (!isAllowed) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "");
  const messages = await readContactMessages();
  const updated = messages.filter((message) => message.id !== id);

  await writeContactMessages(updated);
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}
