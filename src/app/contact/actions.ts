"use server";

import { redirect } from "next/navigation";
import { sendContactMessageEmail } from "@/lib/auth";
import { saveContactMessage } from "@/lib/portfolio-store";

export async function submitContactAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !subject || !message) {
    redirect("/contact?error=missing");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    redirect("/contact?error=invalid-email");
  }

  const savedMessage = await saveContactMessage({
    name,
    email,
    subject,
    message,
  });

  try {
    await sendContactMessageEmail(savedMessage);
  } catch (error) {
    console.error("Failed to send contact message email:", error);
  }

  redirect("/contact?success=1");
}
