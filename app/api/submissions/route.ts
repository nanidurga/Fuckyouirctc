import { NextResponse } from "next/server";
import { createSubmission, getApprovedSubmissions } from "@/lib/store";
import { CATEGORY_MAP, type CategoryId } from "@/lib/data";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getApprovedSubmissions();
  return NextResponse.json({ items });
}

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  // Throttle to keep the moderation queue from being flooded. Checked before we
  // even parse the body, so oversized-payload spam is cheap to reject.
  const rl = rateLimit(`submit:${clientIp(req)}`, 5, 10 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a few minutes." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const category = clean(body.category, 40) as CategoryId;
  const title = clean(body.title, 140);
  const story = clean(body.story, 4000);

  if (!CATEGORY_MAP[category]) {
    return NextResponse.json({ error: "Pick a valid category." }, { status: 400 });
  }
  if (title.length < 8) {
    return NextResponse.json({ error: "Give it a short headline (8+ chars)." }, { status: 400 });
  }
  if (story.length < 40) {
    return NextResponse.json({ error: "Tell us what happened (40+ chars)." }, { status: 400 });
  }

  const sub = await createSubmission({
    category,
    title,
    story,
    route: clean(body.route, 40) || undefined,
    trainNo: clean(body.trainNo, 20) || undefined,
    amount: clean(body.amount, 20) || undefined,
    city: clean(body.city, 60) || undefined,
    hasEvidence: Boolean(body.hasEvidence),
  });

  // We return only the id + status — the submission is NOT public yet.
  return NextResponse.json(
    { ok: true, id: sub.id, status: sub.status },
    { status: 201 },
  );
}
