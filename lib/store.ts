import type { CategoryId } from "./data";
import { getSupabase } from "./supabase";

// ─────────────────────────────────────────────────────────────────────────────
// DATA LAYER
//
// Uses Supabase (Postgres) when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set.
// Falls back to an in-memory store + seed data when they aren't, so `npm run dev`
// works with zero credentials. See supabase/schema.sql for the tables and
// README "Going to production" for setup.
// ─────────────────────────────────────────────────────────────────────────────

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  category: CategoryId;
  title: string;
  story: string;
  route?: string;
  trainNo?: string;
  amount?: string;
  city?: string;
  status: SubmissionStatus;
  createdAt: string;
  hasEvidence: boolean;
};

type NewSubmission = Omit<Submission, "id" | "status" | "createdAt">;

// ── Row mapping (Postgres snake_case ⇄ app camelCase) ───────────────────────
type Row = {
  id: string;
  category: string;
  title: string;
  story: string;
  route: string | null;
  train_no: string | null;
  amount: string | null;
  city: string | null;
  status: string;
  has_evidence: boolean;
  created_at: string;
};

function rowToSubmission(r: Row): Submission {
  return {
    id: r.id,
    category: r.category as CategoryId,
    title: r.title,
    story: r.story,
    route: r.route ?? undefined,
    trainNo: r.train_no ?? undefined,
    amount: r.amount ?? undefined,
    city: r.city ?? undefined,
    status: r.status as SubmissionStatus,
    createdAt: r.created_at,
    hasEvidence: r.has_evidence,
  };
}

// ── In-memory fallback ──────────────────────────────────────────────────────
const seed: Submission[] = [
  {
    id: "s-1001",
    category: "tatkal",
    title: "Tatkal sold out before the clock finished ticking",
    story:
      "Logged in 5 minutes early, payment ready. Window opened at 10:00:00. By 10:00:08 every AC Tatkal berth on NDLS–BCT was gone. Same agent shops outside the station 'guarantee' confirmed tickets for ₹800 extra. How?",
    route: "NDLS → BCT",
    trainNo: "12952",
    city: "Delhi",
    status: "approved",
    createdAt: "2026-06-18T04:30:08.000Z",
    hasEvidence: true,
  },
  {
    id: "s-1002",
    category: "ewallet",
    title: "Loaded ₹2,000 into IRCTC eWallet — can't get it back",
    story:
      "Loaded ₹2,000 for quick Tatkal booking. Plans changed. There is no clean 'withdraw to bank' option — only use-it-on-IRCTC. Raised a ticket, got a request number, auto-closed 'resolved'. Money still stuck.",
    amount: "₹2,000",
    city: "Pune",
    status: "approved",
    createdAt: "2026-06-15T11:05:00.000Z",
    hasEvidence: true,
  },
  {
    id: "s-1003",
    category: "overcrowding",
    title: "Sleeper coach with 4x the people, on a confirmed ticket",
    story:
      "Confirmed sleeper berth, but the coach had so many unreserved passengers I could not reach my own seat. 14-hour journey standing in the aisle. This is normal now.",
    route: "PNBE → NDLS",
    trainNo: "12394",
    city: "Patna",
    status: "approved",
    createdAt: "2026-06-10T19:40:00.000Z",
    hasEvidence: false,
  },
];

// `seed` is illustrative sample data for the zero-config dev fallback only; it
// never reaches the Supabase-backed production path. Start the pledge counter at
// a real 0 — the headline number must never be fabricated.
const mem: Submission[] = [...seed];
let memPledges = 0;
let memCounter = 2000;

// ── Public API ──────────────────────────────────────────────────────────────

export async function getApprovedSubmissions(): Promise<Submission[]> {
  const sb = getSupabase();
  if (!sb) {
    return mem
      .filter((s) => s.status === "approved")
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  const { data, error } = await sb
    .from("submissions")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Supabase getApprovedSubmissions: ${error.message}`);
  return (data as Row[]).map(rowToSubmission);
}

export async function createSubmission(input: NewSubmission): Promise<Submission> {
  const sb = getSupabase();
  if (!sb) {
    const sub: Submission = {
      ...input,
      id: `s-${++memCounter}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    mem.push(sub);
    return sub;
  }
  const { data, error } = await sb
    .from("submissions")
    .insert({
      category: input.category,
      title: input.title,
      story: input.story,
      route: input.route ?? null,
      train_no: input.trainNo ?? null,
      amount: input.amount ?? null,
      city: input.city ?? null,
      has_evidence: input.hasEvidence,
      status: "pending", // ALWAYS pending — nothing public without moderation.
    })
    .select("*")
    .single();
  if (error) throw new Error(`Supabase createSubmission: ${error.message}`);
  return rowToSubmission(data as Row);
}

export async function getStats(): Promise<{
  approvedCount: number;
  pendingCount: number;
  pledgeCount: number;
  byCategory: Record<string, number>;
}> {
  const sb = getSupabase();
  if (!sb) {
    const approved = mem.filter((s) => s.status === "approved");
    const byCategory: Record<string, number> = {};
    for (const s of approved) byCategory[s.category] = (byCategory[s.category] ?? 0) + 1;
    return {
      approvedCount: approved.length,
      pendingCount: mem.filter((s) => s.status === "pending").length,
      pledgeCount: memPledges,
      byCategory,
    };
  }

  const [approvedHead, pendingHead, pledgeHead, approvedCats] = await Promise.all([
    sb.from("submissions").select("id", { count: "exact", head: true }).eq("status", "approved"),
    sb.from("submissions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    sb.from("pledges").select("id", { count: "exact", head: true }),
    sb.from("submissions").select("category").eq("status", "approved"),
  ]);

  const byCategory: Record<string, number> = {};
  for (const r of (approvedCats.data as { category: string }[] | null) ?? []) {
    byCategory[r.category] = (byCategory[r.category] ?? 0) + 1;
  }

  return {
    approvedCount: approvedHead.count ?? 0,
    pendingCount: pendingHead.count ?? 0,
    pledgeCount: pledgeHead.count ?? 0,
    byCategory,
  };
}

export async function addPledge(): Promise<number> {
  const sb = getSupabase();
  if (!sb) return ++memPledges;

  const { error } = await sb.from("pledges").insert({});
  if (error) throw new Error(`Supabase addPledge: ${error.message}`);
  const { count, error: countErr } = await sb
    .from("pledges")
    .select("id", { count: "exact", head: true });
  if (countErr) throw new Error(`Supabase addPledge count: ${countErr.message}`);
  return count ?? 0;
}

// ── Moderation ──────────────────────────────────────────────────────────────

export async function getPendingSubmissions(): Promise<Submission[]> {
  const sb = getSupabase();
  if (!sb) {
    return mem
      .filter((s) => s.status === "pending")
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }
  const { data, error } = await sb
    .from("submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Supabase getPendingSubmissions: ${error.message}`);
  return (data as Row[]).map(rowToSubmission);
}

export async function setSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<void> {
  const sb = getSupabase();
  if (!sb) {
    const s = mem.find((x) => x.id === id);
    if (s) s.status = status;
    return;
  }
  const { error } = await sb.from("submissions").update({ status }).eq("id", id);
  if (error) throw new Error(`Supabase setSubmissionStatus: ${error.message}`);
}
