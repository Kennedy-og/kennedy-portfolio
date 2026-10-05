import crypto from "node:crypto";
import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import portfolioSeed from "@/data/portfolio-data.json";
import { getSupabaseAdmin, readAppState, usesSupabaseStorage, writeAppState } from "@/lib/supabase";

export type SocialLink = {
  label: string;
  url: string;
};

export type Project = {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  published: boolean;
  date: string;
  tools: string[];
  githubUrl?: string;
  liveUrl?: string;
  problem?: string;
  approach?: string;
  outcome?: string;
  image?: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
};

export type EducationItem = {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Certification = {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
};

export type Testimonial = {
  name: string;
  role: string;
  company?: string;
  quote: string;
  approved: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
  replied: boolean;
};

export type PortfolioData = {
  profile: {
    name: string;
    title: string;
    headline: string;
    bio: string;
    location: string;
    email: string;
    phone: string;
    availability: string;
    photo: string;
    heroPhoto: string;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
    resumeUrl: string;
    linkedin: string;
    github: string;
  };
  socialLinks: SocialLink[];
  skills: Array<{ category: string; items: string[] }>;
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: Certification[];
  testimonials: Testimonial[];
  siteSettings: {
    siteName: string;
    tagline: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    heroPrimaryLink: string;
    heroSecondaryLink: string;
    footerText: string;
    showTestimonials: boolean;
    showBlog: boolean;
    hireMeEnabled: boolean;
    defaultTheme: string;
  };
};

const portfolioPath = path.join(process.cwd(), "src/data/portfolio-data.json");
const contactPath = path.join(process.cwd(), "src/data/contact-messages.json");

async function ensureFile(pathToFile: string) {
  await fs.mkdir(path.dirname(pathToFile), { recursive: true });
  try {
    await fs.access(pathToFile);
  } catch {
    await fs.writeFile(pathToFile, "[]\n", "utf8");
  }
}

export async function readPortfolioData(): Promise<PortfolioData> {
  if (usesSupabaseStorage()) {
    return readAppState("portfolio", portfolioSeed);
  }

  await ensureFile(portfolioPath);
  const raw = await fs.readFile(portfolioPath, "utf8");
  return JSON.parse(raw) as PortfolioData;
}

export async function writePortfolioData(data: PortfolioData) {
  if (usesSupabaseStorage()) {
    await writeAppState("portfolio", data);
    return;
  }

  await ensureFile(portfolioPath);
  await fs.writeFile(portfolioPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function readContactMessages(): Promise<ContactMessage[]> {
  if (usesSupabaseStorage()) {
    return readAppState("contact-messages", []);
  }

  await ensureFile(contactPath);
  const raw = await fs.readFile(contactPath, "utf8");
  try {
    return JSON.parse(raw) as ContactMessage[];
  } catch {
    return [];
  }
}

export async function writeContactMessages(messages: ContactMessage[]) {
  if (usesSupabaseStorage()) {
    await writeAppState("contact-messages", messages);
    return;
  }

  await ensureFile(contactPath);
  await fs.writeFile(contactPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
}

export async function getPublishedProjects() {
  const data = await readPortfolioData();
  return data.projects.filter((project) => project.published);
}

export async function getProjectBySlug(slug: string) {
  const data = await readPortfolioData();
  return data.projects.find((project) => project.id === slug);
}

export async function saveContactMessage(message: Omit<ContactMessage, "id" | "createdAt" | "read" | "replied">) {
  const messages = await readContactMessages();
  const nextMessage: ContactMessage = {
    ...message,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    read: false,
    replied: false,
  };
  const nextMessages = [nextMessage, ...messages].slice(0, 250);
  await writeContactMessages(nextMessages);
  return nextMessage;
}

export async function saveUploadedImage(file: File | Blob, folder: "profile" | "projects") {
  if (!file || typeof file === "string") {
    return "";
  }

  const fileName = "name" in file && typeof file.name === "string" ? file.name : "upload";
  const mimeType = "type" in file && typeof file.type === "string" ? file.type : "application/octet-stream";

  if (!mimeType.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  const sourceBuffer = Buffer.from(await file.arrayBuffer());
  const resizedBuffer = await sharp(sourceBuffer)
    .rotate()
    .resize(1440, 810, {
      fit: "cover",
      position: "centre",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82, progressive: true })
    .toBuffer();

  const safeBaseName = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "-") || "upload";
  const safeFileName = `${Date.now()}-${crypto.randomUUID()}-${safeBaseName}.jpg`;

  if (usesSupabaseStorage()) {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "portfolio-assets";
    const storagePath = `${folder}/${safeFileName}`;
    const { error } = await getSupabaseAdmin()
      .storage
      .from(bucket)
      .upload(storagePath, resizedBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) {
      throw new Error(`Unable to save uploaded image: ${error.message}`);
    }

    return getSupabaseAdmin().storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
  }

  const targetDir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, safeFileName);
  await fs.writeFile(targetPath, resizedBuffer);
  return `/uploads/${folder}/${safeFileName}`;
}
