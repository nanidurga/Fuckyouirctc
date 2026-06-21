import { renderOgCard } from "@/lib/og-card";
import { CATEGORY_MAP, type CategoryId } from "@/lib/data";

// Dynamic per-grievance share card. Query params (all optional):
//   ?title=...   headline (a grievance title)
//   ?cat=tatkal  category id → its label becomes the kicker
//   ?meta=...    dot-matrix meta line (route · train · city)
//   ?stamp=...   rubber-stamp word (default "Filed")
// Used for shareable cards of individual approved grievances. Never embeds a
// submitter's identity — only the public, approved fields.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = (searchParams.get("title") || "The citizens' record of Indian Railways").slice(0, 140);
  const catId = searchParams.get("cat") as CategoryId | null;
  const kicker = catId && CATEGORY_MAP[catId] ? CATEGORY_MAP[catId].label : "The citizens' record";
  const meta = (searchParams.get("meta") || "").slice(0, 80) || undefined;
  const stamp = (searchParams.get("stamp") || "Filed").slice(0, 16);

  return renderOgCard({ title, kicker, meta, stamp });
}
