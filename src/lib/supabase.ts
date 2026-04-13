import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/** Browser / public anon client — use in Client Components or when only the anon key is appropriate. */
export function createBrowserSupabaseClient(): SupabaseClient {
  const url = requireEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  const anonKey = requireEnv(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  return createClient(url, anonKey);
}

/**
 * Server-side client with the service role key — bypasses RLS; never import this from Client Components.
 */
export function createServerSupabaseClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("createServerSupabaseClient must only run on the server");
  }
  const url = requireEnv(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );
  const serviceKey = requireEnv(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
