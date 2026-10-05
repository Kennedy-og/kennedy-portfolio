import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | undefined;

export function usesSupabaseStorage() {
  return (
    process.env.NODE_ENV === "production" ||
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  if (!adminClient) {
    adminClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

export async function readAppState<T>(key: string, fallback: T): Promise<T> {
  const { data, error } = await getSupabaseAdmin()
    .from("portfolio_state")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to read portfolio state "${key}": ${error.message}`);
  }

  return data ? (data.value as T) : fallback;
}

export async function writeAppState<T>(key: string, value: T) {
  const { error } = await getSupabaseAdmin()
    .from("portfolio_state")
    .upsert(
      { key, value, updated_at: new Date().toISOString() },
      { onConflict: "key" },
    );

  if (error) {
    throw new Error(`Unable to save portfolio state "${key}": ${error.message}`);
  }
}
