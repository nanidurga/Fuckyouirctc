import { getSupabase } from "./supabase";

// ─────────────────────────────────────────────────────────────────────────────
// EVIDENCE STORAGE (server-only)
//
// Evidence files (screenshots, tickets, PNRs) go into a PRIVATE Supabase Storage
// bucket — they often contain PII, so they must NEVER be public. The Wall only
// ever shows a "✓ Evidence on file" badge; the file itself is visible only to a
// logged-in moderator, via a short-lived signed URL. All access is server-side
// with the service-role key. The bucket also enforces size/MIME limits at the
// storage layer (defense in depth) — these checks mirror that.
// ─────────────────────────────────────────────────────────────────────────────

export const EVIDENCE_BUCKET = "evidence";
export const MAX_EVIDENCE_BYTES = 5 * 1024 * 1024; // 5 MB

// mime → file extension. Keep in sync with the bucket's allowed_mime_types.
export const ALLOWED_EVIDENCE_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

/** Pre-flight validation. Returns an error message, or null when the file is OK. */
export function validateEvidence(file: File): string | null {
  if (file.size === 0) return "The evidence file is empty.";
  if (file.size > MAX_EVIDENCE_BYTES) return "Evidence must be under 5 MB.";
  if (!ALLOWED_EVIDENCE_MIME[file.type]) {
    return "Evidence must be a JPG, PNG, WebP, GIF or PDF.";
  }
  return null;
}

export type EvidenceUpload = { ok: true; path: string } | { ok: false; error: string };

/** Uploads a file to the private bucket under `<submissionId>/evidence.<ext>`. */
export async function uploadEvidence(submissionId: string, file: File): Promise<EvidenceUpload> {
  const sb = getSupabase();
  if (!sb) return { ok: false, error: "Storage is not configured." };

  const invalid = validateEvidence(file);
  if (invalid) return { ok: false, error: invalid };

  const ext = ALLOWED_EVIDENCE_MIME[file.type];
  const path = `${submissionId}/evidence.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await sb.storage.from(EVIDENCE_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });
  if (error) return { ok: false, error: `Upload failed: ${error.message}` };
  return { ok: true, path };
}

/** Short-lived signed URL for a moderator to view one evidence file. */
export async function signedEvidenceUrl(path: string, expiresSec = 120): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.storage.from(EVIDENCE_BUCKET).createSignedUrl(path, expiresSec);
  if (error) return null;
  return data?.signedUrl ?? null;
}
