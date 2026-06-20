import { HEADLINE_STATS, WITNESS, CATEGORIES, CATEGORY_MAP } from "@/lib/data";
import { getApprovedSubmissions, getStats } from "@/lib/store";
import PledgeBlock from "./pledge-block";

// Reads live counts (approved/pending/pledge) — never statically cache, or the
// homepage would freeze these numbers at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, submissions] = await Promise.all([getStats(), getApprovedSubmissions()]);
  const recent = submissions.slice(0, 3);

  return (
    <main>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="wrap">
          <div className="kicker reveal d1">
            Indian Railways · Citizens&rsquo; Reservation Chart of Grievances
          </div>
          <h1 className="reveal d2">
            The whole nation
            <br />
            is <span className="struck">waitlisted</span>.
          </h1>
          <p className="lede reveal d3">
            The network grew <b>23%</b>. The passengers grew <b>1,344%</b>. The difference is
            the crush in your coach, the spinner on Tatkal, and the money stuck in your eWallet.
            This is the public record &mdash; with your evidence on it.
          </p>
          <div className="btn-row reveal d4">
            <a className="btn btn-stamp" href="/submit">
              Add Your Story
            </a>
            <a className="btn btn-ghost" href="/wall">
              Read the Wall of Shame →
            </a>
          </div>

          {/* Stat strip */}
          <div className="stats reveal d4">
            {HEADLINE_STATS.map((s) => (
              <div className="stat" key={s.label}>
                <div className="num">{s.value}</div>
                <div className="lab">{s.label}</div>
                <div className="src">
                  <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer">
                    ◦ {s.source}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WITNESS ───────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <div className="witness">
            <span className="stamp" style={{ position: "absolute", top: -18, right: 24 }}>
              On Record
            </span>
            <blockquote>&ldquo;{WITNESS.quote}&rdquo;</blockquote>
            <div className="by">
              &mdash;{" "}
              <a href={WITNESS.sourceUrl} target="_blank" rel="noopener noreferrer">
                <b>{WITNESS.attribution}</b>
              </a>
              , {WITNESS.role}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <section className="section" id="categories">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">01 /</span>
            <h2>The patterns, named.</h2>
          </div>
          <div className="cards">
            {CATEGORIES.map((c) => (
              <a className="cat" href={`/submit?category=${c.id}`} key={c.id}>
                <span className="code">{c.codename}</span>
                <h3>{c.label}</h3>
                <p>{c.blurb}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── WALL PREVIEW ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">02 /</span>
            <h2>Wall of Shame</h2>
            <span className="mono" style={{ marginLeft: "auto", color: "var(--ink-faint)", fontSize: "0.8rem" }}>
              {stats.approvedCount} ON RECORD · {stats.pendingCount} IN REVIEW
            </span>
          </div>
          {recent.map((s) => {
            const cat = CATEGORY_MAP[s.category];
            return (
              <div className="entry" key={s.id}>
                <div className="meta">
                  <span className="tag">{cat?.label ?? s.category}</span>
                  {s.route && <div>{s.route}</div>}
                  {s.trainNo && <div># {s.trainNo}</div>}
                  {s.amount && <div>{s.amount}</div>}
                  <div>{new Date(s.createdAt).toLocaleDateString("en-IN")}</div>
                </div>
                <div>
                  <h4>{s.title}</h4>
                  <p className="story">{s.story}</p>
                  {s.hasEvidence && <span className="verified">✓ Evidence on file</span>}
                </div>
              </div>
            );
          })}
          <div className="btn-row">
            <a className="btn btn-ghost" href="/wall">
              See all grievances →
            </a>
          </div>
        </div>
      </section>

      {/* ── ACTION ────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">03 /</span>
            <h2>Don&rsquo;t just vent. Make it official.</h2>
          </div>
          <div className="actions">
            <a className="action" href="/act#rti">
              <div className="n">TOOL 01</div>
              <h3>File an RTI</h3>
              <p>Demand the data they won&rsquo;t volunteer: Tatkal sellout times, coach-mix changes, action taken on agent bots.</p>
            </a>
            <a className="action" href="/act#cpgrams">
              <div className="n">TOOL 02</div>
              <h3>Lodge a CPGRAMS / RailMadad complaint</h3>
              <p>One link to the official grievance portals, with pre-worded text so it takes a minute, not an afternoon.</p>
            </a>
            <a className="action" href="/act#mp">
              <div className="n">TOOL 03</div>
              <h3>Write to your MP</h3>
              <p>A ready letter to your constituency representative. Pressure they can&rsquo;t auto-close.</p>
            </a>
            <a className="action" href="/act#share">
              <div className="n">TOOL 04</div>
              <h3>Share the receipt</h3>
              <p>Auto-generated card for WhatsApp & X. Every share pulls one more person onto the record.</p>
            </a>
          </div>
        </div>
      </section>

      {/* ── PLEDGE ────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <PledgeBlock initial={stats.pledgeCount} />
        </div>
      </section>
    </main>
  );
}
