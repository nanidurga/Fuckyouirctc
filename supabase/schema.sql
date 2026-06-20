-- WAITLISTED — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

-- ── Grievances ───────────────────────────────────────────────────────────────
create table if not exists public.submissions (
  id           uuid primary key default gen_random_uuid(),
  category     text not null,
  title        text not null,
  story        text not null,
  route        text,
  train_no     text,
  amount       text,
  city         text,
  status       text not null default 'pending'
                 check (status in ('pending','approved','rejected')),
  has_evidence boolean not null default false,
  created_at   timestamptz not null default now()
);

create index if not exists submissions_status_created_idx
  on public.submissions (status, created_at desc);

-- ── Pledges (one row per pledge; count = total) ──────────────────────────────
create table if not exists public.pledges (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────────────────
-- The app talks to Supabase with the SERVICE ROLE key from server code only,
-- which bypasses RLS. We still enable RLS so that if you ever expose the ANON
-- key to the browser, the public CANNOT read pending grievances or write freely.
alter table public.submissions enable row level security;
alter table public.pledges     enable row level security;

-- Anon may read ONLY approved grievances.
create policy "approved are public"
  on public.submissions for select
  to anon
  using (status = 'approved');

-- (No anon insert/update policy: submissions and pledges go through the server
--  with the service role key. Add anon-insert policies only if you move writes
--  to the browser, and add rate-limiting first.)

-- ── DEMO SEED (opt-in) ───────────────────────────────────────────────────────
-- These are ILLUSTRATIVE sample stories, not real submissions. The public Wall
-- must show real, moderated grievances — do NOT run this block in production.
-- Uncomment only for a local/staging demo where an empty wall is awkward.
--
-- insert into public.submissions (category, title, story, route, train_no, amount, city, status, has_evidence)
-- values
--  ('tatkal','Tatkal sold out before the clock finished ticking',
--   'Logged in 5 minutes early, payment ready. Window opened at 10:00:00. By 10:00:08 every AC Tatkal berth on NDLS–BCT was gone. Agent shops outside guarantee confirmed tickets for ₹800 extra. How?',
--   'NDLS → BCT','12952',null,'Delhi','approved',true),
--  ('ewallet','Loaded ₹2,000 into IRCTC eWallet — can''t get it back',
--   'Loaded ₹2,000 for quick Tatkal booking. Plans changed. There is no clean withdraw-to-bank option. Raised a ticket, got a number, auto-closed "resolved". Money still stuck.',
--   null,null,'₹2,000','Pune','approved',true),
--  ('overcrowding','Sleeper coach with 4x the people, on a confirmed ticket',
--   'Confirmed sleeper berth, but so many unreserved passengers I could not reach my own seat. 14-hour journey standing in the aisle. This is normal now.',
--   'PNBE → NDLS','12394',null,'Patna','approved',false);
