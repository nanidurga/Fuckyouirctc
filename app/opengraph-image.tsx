import { renderOgCard } from "@/lib/og-card";

// Global share card — Next applies this to every route that doesn't define its
// own opengraph-image, and reuses it as the Twitter card too.
export const alt = "WAITLISTED — the citizens' record of Indian Railways";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderOgCard({
    title: "The network grew 23%. The passengers grew 1,344%.",
    kicker: "The citizens' record",
    meta: "Tatkal in 8 seconds · eWallet money you can't withdraw · coaches packed like freight",
    stamp: "Filed",
  });
}
