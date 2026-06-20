// Static, sourced content for the site. Every stat here is traceable to a public source
// (see /act and the README). Keeping these in one file makes them easy to audit & update.

export type Stat = {
  value: string;
  label: string;
  source: string;
  sourceUrl: string;
};

// The spine of the argument. Numbers are public-record; sources linked.
export const HEADLINE_STATS: Stat[] = [
  {
    value: "+23%",
    label: "Route kilometres added since Independence",
    source: "PRS India — State of Indian Railways",
    sourceUrl: "https://prsindia.org/policy/analytical-reports/state-indian-railways",
  },
  {
    value: "+1,344%",
    label: "Passenger traffic growth over the same period",
    source: "PRS India — State of Indian Railways",
    sourceUrl: "https://prsindia.org/policy/analytical-reports/state-indian-railways",
  },
  {
    value: "<0.5%",
    label: "Annual track addition — vs ~4.5% economic growth",
    source: "NITI Aayog — Efficiency & Competitiveness of Indian Railways",
    sourceUrl:
      "https://www.niti.gov.in/sites/default/files/2025-03/Efficiency%20and%20competitiveness%20of%20Indian%20Railways.pdf",
  },
  {
    value: ">100%",
    label: "Capacity utilisation on major trunk routes",
    source: "NITI Aayog",
    sourceUrl:
      "https://www.niti.gov.in/sites/default/files/2025-03/Efficiency%20and%20competitiveness%20of%20Indian%20Railways.pdf",
  },
];

// A real quote — our strongest witness.
export const WITNESS = {
  quote:
    "The railway perhaps made a mistake — the focus stayed on Vande Bharat while attention was diverted from the needs of people who can't afford AC travel.",
  attribution: "Sudhanshu Mani",
  role: "Former railway officer, creator of Vande Bharat",
  sourceUrl:
    "https://www.businesstoday.in/india/story/railway-made-a-mistake-vande-bharat-creator-says-govt-should-restore-increase-non-ac-coaches-433602-2024-06-17",
};

export type CategoryId =
  | "tatkal"
  | "ewallet"
  | "overcrowding"
  | "cleanliness"
  | "refund"
  | "safety"
  | "corruption";

export type Category = {
  id: CategoryId;
  label: string;
  blurb: string;
  // The satirical "official" name for the dark pattern.
  codename: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "tatkal",
    label: "Tatkal Roulette",
    codename: "Sold out in seconds",
    blurb: "Tickets vanish in under 10 seconds to agents & bots while you watch the spinner.",
  },
  {
    id: "ewallet",
    label: "The eWallet Trap",
    codename: "Money in, never out",
    blurb:
      "IRCTC eWallet / RailOne let you load money in one tap — then withdrawing it is a maze. Your money, held hostage.",
  },
  {
    id: "overcrowding",
    label: "Cattle Class",
    codename: "Humans as freight",
    blurb: "Sleeper & general coaches packed past any safe limit, year after year.",
  },
  {
    id: "cleanliness",
    label: "Resolved, Not Fixed",
    codename: "Ghost complaints",
    blurb: "Filthy coaches, broken toilets, complaints auto-closed without anyone showing up.",
  },
  {
    id: "refund",
    label: "Refund Roulette",
    codename: "Deducted & forgotten",
    blurb: "Cancellations and failed bookings where the money disappears into the void.",
  },
  {
    id: "safety",
    label: "Safety Last",
    codename: "Avoidable risk",
    blurb: "Overloading, doors that won't shut, no help when something goes wrong.",
  },
  {
    id: "corruption",
    label: "Chai-Paani",
    codename: "Pay to travel",
    blurb: "Pressure to pay extra for a berth that should already be yours. (Aggregated, no names.)",
  },
];

export const CATEGORY_MAP: Record<CategoryId, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;
