import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Minimal password-gate for /admin. Set ADMIN_PASSWORD in .env.local.
// The session cookie holds an HMAC of a fixed string keyed by the password —
// so the password itself never sits in the cookie, and the cookie can't be
// forged without knowing ADMIN_PASSWORD.

export const ADMIN_COOKIE = "wl_admin";

function adminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export function expectedToken(): string | null {
  const pw = adminPassword();
  if (!pw) return null;
  return createHmac("sha256", pw).update("waitlisted-admin-session-v1").digest("hex");
}

export function checkPassword(input: string): boolean {
  const pw = adminPassword();
  if (!pw) return false;
  return safeEqual(input, pw);
}

export async function isAuthed(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, expected);
}

// True when an admin password has been configured at all.
export function adminConfigured(): boolean {
  return adminPassword() !== null;
}
