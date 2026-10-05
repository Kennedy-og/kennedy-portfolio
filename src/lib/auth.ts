import crypto from "node:crypto";
import { promises as fs } from "fs";
import path from "path";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { readAppState, usesSupabaseStorage, writeAppState } from "@/lib/supabase";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const SESSION_COOKIE_NAME = "portfolio_admin_session";
const RESET_COOKIE_NAME = "portfolio_reset_session";
const AUTH_PATH = path.join(process.cwd(), "src/data/admin-auth.json");
const RESET_PATH = path.join(process.cwd(), "src/data/admin-reset.json");
const SECURITY_PATH = path.join(process.cwd(), "src/data/admin-security.json");
const DEFAULT_EMAIL = process.env.ADMIN_EMAIL ?? process.env.PORTFOLIO_CONTACT_EMAIL ?? "hello@yourdomain.com";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD ?? "change-this-password";

function getSessionSecret() {
  const secret = process.env.PORTFOLIO_SESSION_SECRET?.trim();
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("PORTFOLIO_SESSION_SECRET must be set in production.");
  }
  if (secret && secret.length < 32) {
    throw new Error("PORTFOLIO_SESSION_SECRET must be at least 32 characters.");
  }

  return secret || "portfolio-dev-session-secret";
}

export type AdminAuthConfig = {
  username: string;
  email: string;
  passwordHash: string;
  updatedAt: string;
};

export type ResetRecord = {
  email: string;
  otpHash: string;
  expiresAt: number;
  attemptsLeft: number;
  verified: boolean;
  used: boolean;
  sessionId: string;
  resendAllowedAt: number;
  createdAt: string;
};

export type AdminSecurityState = {
  loginFailures: number;
  loginLockedUntil: number;
};

async function ensureJsonFile(filePath: string, defaultValue: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, `${JSON.stringify(defaultValue, null, 2)}\n`, "utf8");
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  if (usesSupabaseStorage()) {
    return readAppState(path.basename(filePath, ".json"), fallback);
  }

  await ensureJsonFile(filePath, fallback);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, value: T) {
  if (usesSupabaseStorage()) {
    await writeAppState(path.basename(filePath, ".json"), value);
    return;
  }

  await ensureJsonFile(filePath, value);
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readAdminConfig(): Promise<AdminAuthConfig> {
  const existing = await readJsonFile<Partial<AdminAuthConfig>>(AUTH_PATH, {} as Partial<AdminAuthConfig>);
  const hasConfiguredPassword = Boolean(
    process.env.ADMIN_PASSWORD?.trim() || process.env.ADMIN_PASSWORD_HASH?.trim(),
  );

  if (process.env.NODE_ENV === "production" && !existing.passwordHash?.trim() && !hasConfiguredPassword) {
    throw new Error("Set ADMIN_PASSWORD or ADMIN_PASSWORD_HASH before using the production admin.");
  }

  const configuredPassword = process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD;
  const configuredHash = process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD_HASH.trim() ? process.env.ADMIN_PASSWORD_HASH.trim() : await bcrypt.hash(configuredPassword, 12);
  const config: AdminAuthConfig = {
    username: existing.username || ADMIN_USERNAME,
    email: existing.email || process.env.ADMIN_EMAIL || process.env.PORTFOLIO_CONTACT_EMAIL || DEFAULT_EMAIL,
    passwordHash: existing.passwordHash && existing.passwordHash.trim() ? existing.passwordHash : configuredHash,
    updatedAt: existing.updatedAt ?? new Date().toISOString(),
  };

  if (!existing.passwordHash || existing.passwordHash.trim() !== config.passwordHash) {
    await writeJsonFile(AUTH_PATH, config);
  }

  return config;
}

async function readSecurityState(): Promise<AdminSecurityState> {
  return await readJsonFile<AdminSecurityState>(SECURITY_PATH, {
    loginFailures: 0,
    loginLockedUntil: 0,
  });
}

async function writeSecurityState(state: AdminSecurityState) {
  await writeJsonFile(SECURITY_PATH, state);
}

export function createSessionToken(username: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(`portfolio-admin:${username}`)
    .digest("hex");
}

export async function getAdminUsername() {
  const config = await readAdminConfig();
  return config.username || ADMIN_USERNAME;
}

export async function getAdminEmail() {
  const config = await readAdminConfig();
  return config.email || DEFAULT_EMAIL;
}

export async function setAdminPasswordHash(password: string) {
  const config = await readAdminConfig();
  const nextConfig: AdminAuthConfig = {
    ...config,
    passwordHash: await bcrypt.hash(password, 12),
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(AUTH_PATH, nextConfig);
}

export async function isLoginBlocked() {
  const security = await readSecurityState();
  return security.loginLockedUntil > Date.now();
}

export async function recordLoginFailure() {
  const security = await readSecurityState();
  const nextFailures = security.loginFailures + 1;
  await writeSecurityState({
    loginFailures: nextFailures,
    loginLockedUntil: nextFailures >= 5 ? Date.now() + 1000 * 60 * 10 : 0,
  });
}

export async function clearLoginFailures() {
  await writeSecurityState({ loginFailures: 0, loginLockedUntil: 0 });
}

export async function clearLoginLock() {
  await writeSecurityState({ loginFailures: 0, loginLockedUntil: 0 });
}

export async function verifyAdminCredentials(username: string, password: string) {
  if (!username || !password) {
    return false;
  }

  if (await isLoginBlocked()) {
    return false;
  }

  const config = await readAdminConfig();
  if (username.trim() !== config.username) {
    await recordLoginFailure();
    return false;
  }

  const passwordMatches = await bcrypt.compare(password, config.passwordHash);
  if (passwordMatches) {
    await clearLoginFailures();
    return true;
  }

  await recordLoginFailure();
  return false;
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) return false;

  return session === createSessionToken((await getAdminUsername()));
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(await getAdminUsername()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function requireAdmin() {
  return await isAuthenticated();
}

export async function readResetRecord(): Promise<ResetRecord | null> {
  const record = await readJsonFile<Partial<ResetRecord>>(RESET_PATH, {} as Partial<ResetRecord>);
  if (!record || !record.sessionId || typeof record.expiresAt !== "number") {
    return null;
  }

  if (record.expiresAt <= Date.now() || record.used) {
    await writeJsonFile(RESET_PATH, {});
    return null;
  }

  return record as ResetRecord;
}

export async function clearResetRecord() {
  await writeJsonFile(RESET_PATH, {});
  const cookieStore = await cookies();
  cookieStore.set(RESET_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getActiveResetSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(RESET_COOKIE_NAME)?.value;
  if (!sessionId) return null;

  const record = await readJsonFile<Partial<ResetRecord>>(RESET_PATH, {} as Partial<ResetRecord>);
  if (!record || !record.sessionId || record.sessionId !== sessionId || typeof record.expiresAt !== "number") {
    return null;
  }

  if (record.expiresAt <= Date.now() || record.used) {
    await writeJsonFile(RESET_PATH, {});
    return null;
  }

  return record as ResetRecord;
}

export async function setResetSession(record: ResetRecord) {
  const cookieStore = await cookies();
  cookieStore.set(RESET_COOKIE_NAME, record.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  await writeJsonFile(RESET_PATH, record);
}

export async function requestPasswordReset(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const configuredEmail = (await getAdminEmail()).trim().toLowerCase();
  if (!normalizedEmail || normalizedEmail !== configuredEmail) {
    return {
      success: true,
      code: "sent",
      message: "If this email is associated with an account, a reset code has been sent.",
    };
  }

  const existing = await readJsonFile<Partial<ResetRecord>>(RESET_PATH, {} as Partial<ResetRecord>);
  if (existing.sessionId && existing.resendAllowedAt && existing.resendAllowedAt > Date.now()) {
    return {
      success: true,
      code: "cooldown",
      message: "A reset code has already been sent recently. Please wait a moment and try again.",
    };
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = crypto.createHash("sha256").update(`${configuredEmail}:${otp}:${getSessionSecret()}`).digest("hex");
  const now = Date.now();
  const record: ResetRecord = {
    email: configuredEmail,
    otpHash,
    expiresAt: now + 1000 * 60 * 10,
    attemptsLeft: 5,
    verified: false,
    used: false,
    sessionId: crypto.randomBytes(24).toString("hex"),
    resendAllowedAt: now + 1000 * 30,
    createdAt: new Date().toISOString(),
  };

  await sendPasswordResetEmail(configuredEmail, otp);
  await setResetSession(record);

  return {
    success: true,
    code: "sent",
    message: "If this email is associated with an account, a reset code has been sent.",
  };
}

export async function resendPasswordResetOtp() {
  const active = await getActiveResetSession();
  if (!active) {
    return { success: false, code: "expired", message: "Your reset session has expired. Please request a new code." };
  }

  if (active.resendAllowedAt > Date.now()) {
    const remaining = Math.max(0, Math.ceil((active.resendAllowedAt - Date.now()) / 1000));
    return { success: false, code: "cooldown", message: `Please wait ${remaining} seconds before requesting a new code.`, remaining };
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otpHash = crypto.createHash("sha256").update(`${active.email}:${otp}:${getSessionSecret()}`).digest("hex");
  const nextRecord: ResetRecord = {
    ...active,
    otpHash,
    expiresAt: Date.now() + 1000 * 60 * 10,
    attemptsLeft: 5,
    verified: false,
    resendAllowedAt: Date.now() + 1000 * 30,
  };

  await sendPasswordResetEmail(active.email, otp);
  await setResetSession(nextRecord);
  return { success: true, code: "resent", message: "A new reset code has been sent." };
}

export async function verifyPasswordResetOtp(otp: string) {
  const active = await getActiveResetSession();
  if (!active) {
    return { success: false, code: "expired", message: "Your reset session has expired. Please request a new code." };
  }

  if (active.expiresAt <= Date.now()) {
    await clearResetRecord();
    return { success: false, code: "expired", message: "This reset code has expired. Please request a new one." };
  }

  const candidateHash = crypto.createHash("sha256").update(`${active.email}:${otp}:${getSessionSecret()}`).digest("hex");
  if (candidateHash !== active.otpHash) {
    const nextAttempts = Math.max(0, active.attemptsLeft - 1);
    const nextRecord: ResetRecord = { ...active, attemptsLeft: nextAttempts };
    await setResetSession(nextRecord);

    if (nextAttempts <= 0) {
      await clearResetRecord();
      return { success: false, code: "limit", message: "Too many invalid attempts. Please request a new reset code." };
    }

    return { success: false, code: "invalid", message: `Invalid code. ${nextAttempts} attempts remaining.`, attemptsLeft: nextAttempts };
  }

  const verifiedRecord: ResetRecord = { ...active, verified: true, attemptsLeft: 5 };
  await setResetSession(verifiedRecord);
  return { success: true, code: "verified", message: "Code verified." };
}

export async function completePasswordReset(newPassword: string) {
  const active = await getActiveResetSession();
  if (!active) {
    return { success: false, code: "expired", message: "Your reset session has expired. Please request a new code." };
  }

  if (!active.verified) {
    return { success: false, code: "pending", message: "Please verify the code before creating a new password." };
  }

  if (newPassword.length < 12) {
    return { success: false, code: "weak", message: "Your password must be at least 12 characters long." };
  }

  const commonPasswords = ["password", "admin", "welcome", "letmein", "qwerty", "changeme", "portfolio", "secret", "password123", "admin123"];
  const lowered = newPassword.toLowerCase();
  if (commonPasswords.includes(lowered) || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
    return { success: false, code: "weak", message: "Use a stronger password with upper/lowercase letters, numbers, and a symbol." };
  }

  await setAdminPasswordHash(newPassword);

  const finalRecord: ResetRecord = { ...active, used: true, verified: false, sessionId: "" };
  await writeJsonFile(RESET_PATH, finalRecord);
  await clearResetRecord();

  return { success: true, code: "updated", message: "Password updated successfully." };
}

async function sendPasswordResetEmail(email: string, otp: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = (process.env.SMTP_SECURE ?? "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const sender = process.env.SMTP_FROM ?? process.env.ADMIN_EMAIL ?? "Portfolio Admin <noreply@yourdomain.com>";

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are missing. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your environment before sending mail.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: sender,
    to: email,
    subject: "Portfolio admin password reset",
    text: `Your portfolio admin password reset code is ${otp}. This code expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2 style="margin-bottom: 12px;">Portfolio admin password reset</h2>
        <p>Your one-time password reset code is:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 0.2em; margin: 16px 0;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}

export async function getPasswordResetStatus() {
  const record = await getActiveResetSession();
  if (!record) {
    return { active: false, verified: false, resendAllowedAt: 0 };
  }

  return {
    active: true,
    verified: record.verified,
    attemptsLeft: record.attemptsLeft,
    expiresAt: record.expiresAt,
    resendAllowedAt: record.resendAllowedAt,
  };
}

export async function sendContactMessageEmail(message: {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
}) {
  const recipient = (await getAdminEmail()).trim();
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const secure = (process.env.SMTP_SECURE ?? "false") === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const sender = process.env.SMTP_FROM ?? process.env.ADMIN_EMAIL ?? recipient;

  if (!host || !user || !pass) {
    throw new Error("SMTP credentials are missing. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your environment before sending mail.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: sender,
    to: recipient,
    replyTo: message.email,
    subject: `New portfolio enquiry: ${message.subject}`,
    text: [
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Subject: ${message.subject}`,
      "",
      message.message,
      "",
      `Received: ${message.createdAt ? new Date(message.createdAt).toLocaleString() : new Date().toLocaleString()}`,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
        <h2 style="margin: 0 0 16px;">New portfolio enquiry</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Received:</strong> ${message.createdAt ? new Date(message.createdAt).toLocaleString() : new Date().toLocaleString()}</p>
        <div style="margin-top: 18px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 10px; background: #f9fafb;">
          ${message.message.replace(/\n/g, "<br />")}
        </div>
      </div>
    `,
  });
}

export async function clearResetSessionValue() {
  const cookieStore = await cookies();
  cookieStore.set(RESET_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function normaliseResetSession() {
  const record = await getActiveResetSession();
  if (!record) return null;
  return record;
}

export async function isPasswordStrong(password: string) {
  return password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
}

export async function getResetCooldownRemaining() {
  const record = await getActiveResetSession();
  if (!record) return 0;
  return Math.max(0, Math.ceil((record.resendAllowedAt - Date.now()) / 1000));
}
