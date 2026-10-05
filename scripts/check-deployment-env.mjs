import { createClient } from "@supabase/supabase-js";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

if (process.argv.includes("--if-vercel") && process.env.VERCEL !== "1") {
  console.log("Skipping Vercel environment check outside Vercel.");
  process.exit(0);
}

loadEnvConfig(process.cwd());

const requiredVariables = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "PORTFOLIO_SESSION_SECRET",
];

const missing = requiredVariables.filter((name) => !process.env[name]?.trim());

if (!process.env.ADMIN_PASSWORD?.trim() && !process.env.ADMIN_PASSWORD_HASH?.trim()) {
  missing.push("ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH)");
}

const adminPassword = process.env.ADMIN_PASSWORD?.trim();
if (adminPassword && adminPassword.length < 12) {
  missing.push("ADMIN_PASSWORD must be at least 12 characters");
}
if (adminPassword && /replace-with|change-this-password|change-me/i.test(adminPassword)) {
  missing.push("ADMIN_PASSWORD must not be a placeholder");
}

if (!process.env.ADMIN_EMAIL?.trim() && !process.env.PORTFOLIO_CONTACT_EMAIL?.trim()) {
  missing.push("ADMIN_EMAIL (or PORTFOLIO_CONTACT_EMAIL)");
}

for (const name of ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"]) {
  if (!process.env[name]?.trim()) {
    missing.push(name);
  }
}

const sessionSecret = process.env.PORTFOLIO_SESSION_SECRET?.trim();
if (sessionSecret && sessionSecret.length < 32) {
  missing.push("PORTFOLIO_SESSION_SECRET must be at least 32 characters");
}

for (const name of ["NEXT_PUBLIC_SITE_URL", "NEXT_PUBLIC_SUPABASE_URL"]) {
  const value = process.env[name]?.trim();
  if (value) {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") {
        missing.push(`${name} must use HTTPS`);
      }
    } catch {
      missing.push(`${name} must be a valid URL`);
    }
  }
}

if (/your-project|your-supabase|yourdomain\.com|your-email|your-gmail-app-password|replace-with|change-this-password|change-me/i.test(
  [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.ADMIN_EMAIL,
    process.env.PORTFOLIO_CONTACT_EMAIL,
    process.env.SMTP_HOST,
    process.env.SMTP_USER,
    process.env.SMTP_PASS,
    process.env.PORTFOLIO_SESSION_SECRET,
    process.env.ADMIN_PASSWORD_HASH,
  ].filter(Boolean).join(" "),
)) {
  missing.push("deployment variables must not contain .env.example placeholders");
}

if (missing.length > 0) {
  console.error("Deployment environment is incomplete:");
  for (const name of missing) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL.trim(),
  process.env.SUPABASE_SERVICE_ROLE_KEY.trim(),
  { auth: { autoRefreshToken: false, persistSession: false } },
);
const { error: stateError } = await supabase
  .from("portfolio_state")
  .select("key")
  .limit(1);

if (stateError) {
  throw new Error(`Supabase portfolio_state table check failed: ${stateError.message}`);
}

const bucketName = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "portfolio-assets";
const { data: bucket, error: bucketError } = await supabase.storage.getBucket(bucketName);
if (bucketError) {
  throw new Error(`Supabase storage bucket "${bucketName}" check failed: ${bucketError.message}`);
}
if (!bucket.public) {
  throw new Error(`Supabase storage bucket "${bucketName}" must be public to display portfolio images.`);
}

console.log("Deployment environment and Supabase setup look complete.");
