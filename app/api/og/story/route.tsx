import { renderStoryCard } from "@/lib/og-card";
import { CATEGORY_MAP, type CategoryId } from "@/lib/data";

// Vertical 1080×1920 share card for Instagram / WhatsApp *stories*. Query params
// (all optional) mirror /api/og:
//   ?title=...   headline (a grievance title)
//   ?cat=tatkal  category id → its label becomes the kicker
//   ?meta=...    dot-matrix meta line (route · train · city)
//   ?stamp=...   rubber-stamp word (default "On the record")
// Publishes only public/approved fields — never a submitter's identity.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const title = (searchParams.get("title") || "This is the citizens' record of Indian Railways").slice(0, 140);
  const catId = searchParams.get("cat") as CategoryId | null;
  const kicker = catId && CATEGORY_MAP[catId] ? CATEGORY_MAP[catId].label : "The citizens' record";
  const meta = (searchParams.get("meta") || "").slice(0, 80) || undefined;
  const stamp = (searchParams.get("stamp") || "On the record").slice(0, 24);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://fuckyouirctc.vercel.app";

  return renderStoryCard({ title, kicker, meta, stamp, site });
}
