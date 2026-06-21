import { NextResponse } from "next/server";
import { createSubmission, attachEvidence, getApprovedSubmissions } from "@/lib/store";
import { CATEGORY_MAP, type CategoryId } from "@/lib/data";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { uploadEvidence, validateEvidence } from "@/lib/evidence";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getApprovedSubmissions();
  return NextResponse.json({ items });
}

function clean(v: FormDataEntryValue | null, max: number): string {
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

  // Submissions are multipart/form-data so they can carry an optional evidence
  // file alongside the text fields.
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const category = clean(fd.get("category"), 40) as CategoryId;
  const title = clean(fd.get("title"), 140);
  const story = clean(fd.get("story"), 4000);

  if (!CATEGORY_MAP[category]) {
    return NextResponse.json({ error: "Pick a valid category." }, { status: 400 });
  }
  if (title.length < 8) {
    return NextResponse.json({ error: "Give it a short headline (8+ chars)." }, { status: 400 });
  }
  if (story.length < 40) {
    return NextResponse.json({ error: "Tell us what happened (40+ chars)." }, { status: 400 });
  }

  // Optional evidence file — validate BEFORE creating the row so the user can fix
  // a bad file without leaving an orphan submission.
  const fileEntry = fd.get("evidence");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;
  if (file) {
    const invalid = validateEvidence(file);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });
  }
  const checkbox = fd.get("hasEvidence") === "on" || fd.get("hasEvidence") === "true";

  const sub = await createSubmission({
    category,
    title,
    story,
    route: clean(fd.get("route"), 40) || undefined,
    trainNo: clean(fd.get("trainNo"), 20) || undefined,
    amount: clean(fd.get("amount"), 20) || undefined,
    city: clean(fd.get("city"), 60) || undefined,
    hasEvidence: checkbox || file !== null,
  });

  // Upload after the row exists so the file lives under the submission id. A
  // failed upload doesn't lose the grievance — it stays pending without a file.
  let evidenceWarning: string | undefined;
  if (file) {
    const up = await uploadEvidence(sub.id, file);
    if (up.ok) await attachEvidence(sub.id, up.path);
    else evidenceWarning = up.error;
  }

  // We return only the id + status — the submission is NOT public yet.
  return NextResponse.json(
    { ok: true, id: sub.id, status: sub.status, evidenceWarning },
    { status: 201 },
  );
}
