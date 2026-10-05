import nodemailer from "nodemailer";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const requiredVariables = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"];
const missing = requiredVariables.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error(`SMTP check cannot run. Missing: ${missing.join(", ")}`);
  process.exit(1);
}

if (/your-email|your-gmail-app-password|replace-with|change-me/i.test(process.env.SMTP_PASS)) {
  console.error("SMTP check cannot run: SMTP_PASS is still an example placeholder.");
  process.exit(1);
}

const port = Number(process.env.SMTP_PORT ?? "587");
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("SMTP_PORT must be a valid TCP port number.");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST.trim(),
  port,
  secure: (process.env.SMTP_SECURE ?? "false") === "true",
  auth: {
    user: process.env.SMTP_USER.trim(),
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

await transporter.verify();
console.log("SMTP connection and authentication succeeded.");
