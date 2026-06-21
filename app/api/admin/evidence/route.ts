import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { signedEvidenceUrl } from "@/lib/evidence";

export const dynamic = "force-dynamic";

// Admin-only: returns a short-lived signed URL for one evidence file so a
// moderator can view it while reviewing. The file lives in a PRIVATE bucket and
// is never otherwise reachable.
export async function GET(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path") || "";
  // Paths come from our own DB; reject anything with traversal just in case.
  if (!path || path.includes("..")) {
    return NextResponse.json({ error: "Bad evidence path." }, { status: 400 });
  }

  const url = await signedEvidenceUrl(path, 120);
  if (!url) {
    return NextResponse.json({ error: "Could not load evidence." }, { status: 404 });
  }
  return NextResponse.json({ url });
}
