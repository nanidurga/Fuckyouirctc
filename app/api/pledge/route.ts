import { NextResponse } from "next/server";
import { addPledge, getStats } from "@/lib/store";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const { pledgeCount } = await getStats();
  return NextResponse.json({ pledgeCount });
}

export async function POST(req: Request) {
  // A pledge is a one-time act per person, so cap it hard per network. This is a
  // best-effort baseline (per-instance, IP-based) to keep the headline count
  // credible — back with Redis + dedup for a global guarantee.
  const rl = rateLimit(`pledge:${clientIp(req)}`, 10, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many pledges from this network. Try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }
  const pledgeCount = await addPledge();
  return NextResponse.json({ ok: true, pledgeCount });
}
