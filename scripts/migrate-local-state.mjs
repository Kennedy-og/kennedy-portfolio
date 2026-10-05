import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before migrating local data.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const bucketName = process.env.SUPABASE_STORAGE_BUCKET?.trim() || "portfolio-assets";
const uploadsRoot = path.join(process.cwd(), "public", "uploads");
const uploadedAssetUrls = new Map();

async function uploadExistingAssets(folder) {
  const localFolder = path.join(uploadsRoot, folder);
  let files;
  try {
    files = await readdir(localFolder, { withFileTypes: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return;
    }
    throw error;
  }

  for (const entry of files) {
    if (!entry.isFile()) {
      continue;
    }

    const fileName = entry.name;
    const localUrl = `/uploads/${folder}/${fileName}`;
    const storagePath = `${folder}/${fileName}`;
    const fileBuffer = await readFile(path.join(localFolder, fileName));
    const contentType = fileName.toLowerCase().endsWith(".webp")
      ? "image/webp"
      : fileName.toLowerCase().endsWith(".png")
        ? "image/png"
        : fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")
          ? "image/jpeg"
          : "application/octet-stream";

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, { contentType, upsert: true });

    if (error) {
      throw new Error(`Unable to migrate image "${localUrl}": ${error.message}`);
    }

    const publicUrl = supabase.storage.from(bucketName).getPublicUrl(storagePath).data.publicUrl;
    uploadedAssetUrls.set(localUrl, publicUrl);
    console.log(`Migrated image "${localUrl}".`);
  }
}

function replaceLocalUploadUrls(value) {
  if (typeof value === "string") {
    return uploadedAssetUrls.get(value) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map(replaceLocalUploadUrls);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, replaceLocalUploadUrls(nestedValue)]),
    );
  }
  return value;
}

await uploadExistingAssets("profile");
await uploadExistingAssets("projects");

const stateFiles = [
  ["portfolio", path.join(process.cwd(), "src", "data", "portfolio-data.json")],
  ["contact-messages", path.join(process.cwd(), "src", "data", "contact-messages.json")],
];

for (const [key, filePath] of stateFiles) {
  const localValue = JSON.parse(await readFile(filePath, "utf8"));
  const value = key === "portfolio" ? replaceLocalUploadUrls(localValue) : localValue;
  const { data: existing, error: readError } = await supabase
    .from("portfolio_state")
    .select("key")
    .eq("key", key)
    .maybeSingle();

  if (readError) {
    throw new Error(`Unable to check Supabase state "${key}": ${readError.message}`);
  }

  if (existing) {
    console.log(`Skipped "${key}": Supabase already has this state.`);
    continue;
  }

  const { error: insertError } = await supabase
    .from("portfolio_state")
    .insert({ key, value, updated_at: new Date().toISOString() });

  if (insertError) {
    throw new Error(`Unable to migrate "${key}": ${insertError.message}`);
  }

  console.log(`Migrated "${key}".`);
}
