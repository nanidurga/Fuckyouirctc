# WAITLISTED

**The citizens' public record of Indian Railways grievances.**

An independent, satirical civic-tech project. It turns scattered passenger anger into a
single, evidence-backed, public record — and routes that energy into *legal* action (RTI,
CPGRAMS, RailMadad, writing to MPs, a public no-booking pledge).

> It is **not affiliated with IRCTC / Indian Railways** and does **not** access, automate,
> or interfere with any booking system. The only tools here are truth, citizens' stories,
> and official channels.

---

## What's built (Phase 1)

- **Homepage** — the argument (23% vs 1,344%), the Vande-Bharat-creator witness quote, the
  named patterns (incl. the **eWallet trap**), a Wall of Shame preview, the action toolkit,
  and a live pledge counter.
- **/wall** — the full Wall of Shame (approved grievances only).
- **/submit** — moderated grievance submission (every entry starts as `pending`).
- **/act** — RTI template + real CPGRAMS/RailMadad links + MP letter + share buttons.
- **API** — `GET/POST /api/submissions`, `GET/POST /api/pledge`.

## Tech

- **Next.js (App Router) + TypeScript**, hand-crafted CSS (no UI kit) — concept:
  *"reservation-chart brutalism."*
- Fonts: Oswald (display) / Newsreader (body) / DM Mono (data), via `next/font`.
- Deploys free on **Vercel**.

## Architecture

```
Browser ──► Next.js App (Vercel)
   Pages (Server Components)        API routes
     /                              POST /api/submissions  → new (status: pending)
     /wall                          GET  /api/submissions  → approved only
     /submit (client form)          GET/POST /api/pledge
     /act
                    └── lib/store.ts     (data layer)
                        lib/supabase.ts  (Supabase client; in-memory fallback)
                        lib/data.ts      (sourced stats & categories)
```

**Moderation is structural:** submissions are never public until approved. **Defamation-safe:**
we publish patterns in aggregate, never name individuals.

## Run locally

```bash
npm install
npm run dev    # http://localhost:3000
```

> With no env vars set, it uses an **in-memory store with seed data** so it runs with zero
> credentials (data resets on restart). Add Supabase keys (below) for real persistence.

## Storage: Supabase

The data layer (`lib/store.ts`) automatically uses **Supabase** when `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` are present, and falls back to in-memory otherwise.

1. Create a project at [supabase.com](https://supabase.com).
2. Run **`supabase/schema.sql`** in the Supabase SQL editor (creates `submissions` +
   `pledges`, indexes, RLS policies, and a few seed rows).
3. Copy `.env.local.example` → `.env.local` and fill in from
   **Supabase → Project Settings → API**:
   ```
   SUPABASE_URL=https://<project>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # server-only, never commit/expose
   ```
4. `npm run dev` — the warning disappears and writes/reads now persist.

On **Vercel**, add the same two env vars in Project → Settings → Environment Variables.

**Security:** the app talks to Supabase from server code only, using the service-role key.
RLS is enabled so that even if the anon key is ever exposed, the public can read only
**approved** grievances — never `pending` ones.

### Still to add for production

- **Evidence upload** (Supabase Storage) instead of just a "has evidence" flag.
- **Rate-limiting** on the pledge + submit endpoints (dedupe by IP) for a credible counter.
- A `/admin` **moderation queue** (auth-gated) to approve/reject `pending` rows.

## Roadmap

- Auto-generated branded share cards (OG images) per grievance.
- AI-assisted evidence verification (the AirtelBlack move).
- Public data dashboards (sellout-time heatmaps by route).
- Regional-language versions (Hindi first).
- `/admin` moderation panel.

## Why this, not "take down IRCTC"

IRCTC is critical national infrastructure; attacking it is a serious crime and hurts the
exact passengers this defends. The AirtelBlack precedent proved the winning move is
**making the truth undeniable + crowdsourcing proof + official pressure** — that forced a
public climbdown without touching a single server. Same playbook here.
