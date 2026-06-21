# CLAUDE.md

Guidance for Claude Code when working in this repo.

## What this is

**WAITLISTED** — an independent, satirical **civic-tech protest + grievance platform** about
Indian Railways. It aggregates passenger grievances into a public, evidence-backed record and
routes that energy into **legal** action (RTI, CPGRAMS, RailMadad, MP letters, a public
no-booking pledge).

Inspired by the **AirtelBlack.com** playbook: win with *satire + crowdsourced evidence +
official pressure*, not by attacking anything.

## ⚠️ Ethical boundary (do not cross)

The owner originally framed the goal as "stop a day of IRCTC bookings / bring down IRCTC."
We deliberately redirected this to **legal protest only**. IRCTC is critical national
infrastructure; attacking it is a serious crime (IT Act §66F) and would hurt the ordinary
passengers this project defends.

**Never** help with: DoS/hacking/automating/interfering with any booking system, scraping or
attacking IRCTC, naming individuals as corrupt without proof (defamation), or mass-targeting.
The "stop bookings" idea lives **only** as a voluntary public pledge/boycott counter.

## Conventions

- **Moderation is structural:** every submission is created with `status = 'pending'` and is
  never public until approved. Keep it that way.
- **Defamation-safe:** publish patterns in aggregate; never publish a user's identity or name
  individuals. RLS lets anon read only `approved` rows.
- **Sourced claims only:** stats in `lib/data.ts` must have a real public source (PRS India,
  NITI Aayog, press). Don't invent numbers.
- **Aesthetic:** "reservation-chart brutalism" — cream paper, ink, vermillion rubber-stamps,
  perforated ticket cards, dot-matrix data. Fonts: Oswald (display) / Newsreader (body) /
  DM Mono (data). Don't drift to generic AI styling.

## Tech stack

- **Next.js (App Router) + TypeScript**, hand-crafted CSS in `app/globals.css` (no UI kit).
- **Supabase (Postgres)** for storage, region `ap-south-1`. Project ref: `rxwitzesjqgtyvuvhzwv`.
- Deploy target: **Vercel**.

## File map

```
app/
  layout.tsx          masthead + footer (disclaimer) + fonts
  globals.css         the entire design system
  page.tsx            homepage (hero, stats, witness, categories, wall preview, actions)
  pledge-block.tsx    client component — live pledge counter
  wall/page.tsx       full Wall of Shame (approved only)
  submit/             page.tsx + submit-form.tsx (client) — moderated submission
  act/page.tsx        RTI template + CPGRAMS/RailMadad links + MP letter + share
  admin/              page.tsx + admin-login.tsx + admin-dashboard.tsx (moderation desk)
  api/submissions/route.ts   GET approved · POST new (pending)
  api/pledge/route.ts        GET count · POST add
  api/admin/login|logout/route.ts   password gate (cookie session)
  api/admin/submissions/[id]/route.ts  PATCH approve/reject (auth required)
lib/auth.ts           /admin password gate (HMAC cookie; ADMIN_PASSWORD env)
lib/
  data.ts             sourced stats, witness quote, categories (incl. eWallet trap)
  store.ts            data layer — Supabase when env set, else in-memory fallback
  supabase.ts         server-only Supabase client (service-role key)
supabase/schema.sql   run-once DDL: submissions + pledges + RLS + seed
```

## Commands

```bash
npm run dev      # http://localhost:3000
npm run build    # type-check + production build
npm run lint
```

## Supabase

- App reads `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` (gitignored).
  Without them, `lib/store.ts` falls back to in-memory + seed data (prints a warning).
- **Key type:** the project uses Supabase's **new API-key system**. `SUPABASE_SERVICE_ROLE_KEY`
  now holds a modern **secret key** (`sb_secret_…`), not the legacy `service_role` JWT. Secret
  keys are a drop-in for `createClient()` (no code change) and are independently rotatable.
  The legacy `service_role` JWT was rotated out (it had been exposed in chat) and should be
  revoked in the dashboard. The env var name stays `SUPABASE_SERVICE_ROLE_KEY` for continuity.
- The **Supabase MCP server** is configured in `.mcp.json` (gitignored; contains the
  `sbp_` access token + project ref). It loads at Claude Code startup — prefer MCP tools for
  DB work when available.
- If MCP isn't loaded, DB queries can be run via the Management API:
  `POST https://api.supabase.com/v1/projects/<ref>/database/query` with
  `{"query": "..."}` and `Authorization: Bearer <sbp_ token>`.

## Status

Verified end-to-end against Supabase: homepage, wall, submit (persists as pending), act
toolkit, pledge counter, API routes, and the **`/admin` moderation desk** (login → approve /
reject; approved rows appear on `/wall`). `ADMIN_PASSWORD` gates `/admin` (in `.env.local`).

**OG share cards (done):** branded 1200×630 cards in the reservation-chart-brutalist look
(cream paper, Oswald ink headline, DM Mono data, vermillion rubber-stamp, perforated edge).
- `lib/og-card.tsx` — shared `renderOgCard()` (the `next/og` `ImageResponse` renderer).
- `app/opengraph-image.tsx` — global/homepage card, statically prerendered; Next applies it to
  every route without its own card and reuses it as the Twitter card.
- `app/api/og/route.tsx` — dynamic per-grievance card: `?title=&cat=&meta=&stamp=`. Publishes
  only approved/public fields — never a submitter's identity.
- Brand TTFs live in `lib/og-fonts/` (Oswald instanced to a **static** wght=700 — satori can't
  parse the variable font; DM Mono Medium). `next.config.mjs` `outputFileTracingIncludes` bundles
  them into the `/api/og` function. `metadataBase` (`NEXT_PUBLIC_SITE_URL`, set it in Vercel) makes
  the card URL absolute for unfurls.

## Deployment (Vercel)

- `.env.local` is gitignored, so it does **not** reach Vercel. The env vars
  (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and
  `NEXT_PUBLIC_SITE_URL` = the production domain, for absolute OG-card URLs) must be set in
  **Vercel → Settings → Environment Variables** for all environments, then **redeploy**
  (env changes don't apply to existing deployments).
- Symptom of missing vars on Vercel: admin login never succeeds (`adminConfigured()` false)
  and submissions don't persist (`getSupabase()` returns null → silent in-memory fallback).
  If the live site "works locally but not on Vercel," check the env vars first.

## Roadmap (next)

1. **Automated moderation** — once the site is live the owner can't hand-approve
   every row through `/admin`, so the queue needs a machine triage layer on submit.
   **Must preserve the structural guarantees** ("Moderation is structural" +
   "Ethical boundary"): submissions stay `pending` by default; the automation may
   **auto-reject / flag** PII (phone, email, Aadhaar/PNR), named individuals, and
   unsourced accusations (defamation-safe), and may **auto-approve only
   high-confidence-safe** rows — everything uncertain stays queued for a human.
   Keep an audit trail (who/what decided) and a manual override in `/admin`.
   Candidate approach: LLM/classifier screen in `createSubmission` →
   reject obvious violations · publish clearly-safe · queue the rest.
2. ~~Auto-generated branded share cards (OG images)~~ — **done** (see Status).
3. Public data dashboards (Tatkal sellout-time heatmaps).
4. Hindi (then regional) language versions.
5. Evidence upload (Supabase Storage). *(Rate-limiting on submit/pledge is done —
   `lib/rate-limit.ts`.)*

## Security

- `.mcp.json` and `.env.local` are gitignored — never commit secrets.
- The legacy `service_role` JWT key was **rotated** to a modern `sb_secret_…` key after being
  exposed in chat, and the old legacy key has been **revoked** (verified dead: REST API returns
  HTTP 401 for it, HTTP 200 for the new secret key).
- The `sbp_` Supabase access token (in `.mcp.json`) was also exposed in chat; **rotate it**
  before pushing the repo public.
- Patch note: keep `next` on the latest patched 15.x (a critical CVE was already patched).
```
