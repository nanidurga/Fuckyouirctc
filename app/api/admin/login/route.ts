import { NextResponse } from "next/server";
import { checkPassword, expectedToken, adminConfigured, ADMIN_COOKIE } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin is not configured. Set ADMIN_PASSWORD in the environment." },
      { status: 503 },
    );
  }

  // Lockout: throttle brute-force against the single shared admin password.
  const rl = rateLimit(`admin-login:${clientIp(req)}`, 5, 5 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let password = "";
  try {
    const body = await req.json();
    // Cap length so a huge payload can't be used as a DoS lever.
    password = typeof body.password === "string" ? body.password.slice(0, 256) : "";
  } catch {
    /* empty */
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const token = expectedToken();
  if (!token) {
    return NextResponse.json({ error: "Admin is not configured." }, { status: 503 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
