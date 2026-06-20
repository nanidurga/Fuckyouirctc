import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase client. Uses the SERVICE ROLE key, so this module must
// only ever be imported from server code (API routes / Server Components) —
// never from a "use client" component.
//
// If env vars are missing we return null and the store falls back to the
// in-memory implementation, so local dev still runs with zero setup.

let client: SupabaseClient | null = null;
let resolved = false;

export function getSupabase(): SupabaseClient | null {
  if (resolved) return client;
  resolved = true;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  // SERVICE ROLE only. We deliberately do NOT fall back to the anon key: server
  // writes (insert submission, insert pledge) and pending reads have no anon RLS
  // policy, so an anon-keyed client would silently fail under RLS — a confusing
  // half-broken state. If the service-role key is absent we fall back to the
  // in-memory store, which always works.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(
      "[store] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — using in-memory store " +
        "(data resets on restart). Set both for persistence.",
    );
    return null;
  }

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}
