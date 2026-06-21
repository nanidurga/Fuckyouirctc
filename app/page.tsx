import { HEADLINE_STATS, WITNESS, CATEGORIES, CATEGORY_MAP } from "@/lib/data";
import { getApprovedSubmissions, getStats } from "@/lib/store";
import { getDict } from "@/lib/i18n";
import PledgeBlock from "./pledge-block";

// Reads live counts (approved/pending/pledge) — never statically cache, or the
// homepage would freeze these numbers at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [stats, submissions, t] = await Promise.all([
    getStats(),
    getApprovedSubmissions(),
    getDict(),
  ]);
  const recent = submissions.slice(0, 3);
  const h = t.home;

  return (
    <main>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="wrap">
          <div className="kicker reveal d1">{h.kicker}</div>
          <h1 className="reveal d2">
            {h.titlePre}
            <br />
            {h.titleMid}
            <span className="struck">{h.titleStruck}</span>
            {h.titlePost}
          </h1>
          <p
            className="lede reveal d3"
            dangerouslySetInnerHTML={{ __html: h.ledeHtml }}
          />
          <div className="btn-row reveal d4">
            <a className="btn btn-stamp" href="/submit">
              {h.addStory}
            </a>
            <a className="btn btn-ghost" href="/wall">
              {h.readWall}
            </a>
          </div>

          {/* Stat strip */}
          <div className="stats reveal d4">
            {HEADLINE_STATS.map((s, i) => (
              <div className="stat" key={s.label}>
                <div className="num">{s.value}</div>
                <div className="lab">{h.statLabels[i] ?? s.label}</div>
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
              {h.onRecord}
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
            <h2>{h.s1}</h2>
          </div>
          <div className="cards">
            {CATEGORIES.map((c) => {
              const cc = t.categories[c.id];
              return (
                <a className="cat" href={`/submit?category=${c.id}`} key={c.id}>
                  <span className="code">{cc.codename}</span>
                  <h3>{cc.label}</h3>
                  <p>{cc.blurb}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WALL PREVIEW ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">02 /</span>
            <h2>{h.s2}</h2>
            <span className="mono" style={{ marginLeft: "auto", color: "var(--ink-faint)", fontSize: "0.8rem" }}>
              {h.wallMeta(stats.approvedCount, stats.pendingCount)}
            </span>
          </div>
          {recent.map((s) => {
            const cat = t.categories[s.category] ?? CATEGORY_MAP[s.category];
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
              {h.seeAll}
            </a>
          </div>
        </div>
      </section>

      {/* ── ACTION ────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">03 /</span>
            <h2>{h.s3}</h2>
          </div>
          <div className="actions">
            {h.tools.map((tool, i) => (
              <a className="action" href={["/act#rti", "/act#cpgrams", "/act#mp", "/act#share"][i]} key={tool.n}>
                <div className="n">{tool.n}</div>
                <h3>{tool.title}</h3>
                <p>{tool.desc}</p>
              </a>
            ))}
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
