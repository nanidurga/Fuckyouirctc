import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { setSubmissionStatus } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let status = "";
  try {
    const body = await req.json();
    status = typeof body.status === "string" ? body.status : "";
  } catch {
    /* empty */
  }

  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json(
      { error: "status must be 'approved' or 'rejected'." },
      { status: 400 },
    );
  }

  await setSubmissionStatus(id, status);
  return NextResponse.json({ ok: true, id, status });
}
