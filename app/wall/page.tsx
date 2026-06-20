import { getApprovedSubmissions, getStats } from "@/lib/store";
import { CATEGORY_MAP } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Wall of Shame — WAITLISTED",
};

export default async function Wall() {
  const [items, stats] = await Promise.all([getApprovedSubmissions(), getStats()]);

  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <div className="kicker">02 / The public record</div>
          <h1>Wall of Shame</h1>
          <p>
            Every entry is submitted by a traveller and reviewed before it appears. We publish
            the story, never the person who caused it &mdash; this is a record of a broken
            system, not a list of accusations.{" "}
            <b>{stats.approvedCount}</b> on record · <b>{stats.pendingCount}</b> in review.
          </p>
          <div className="btn-row">
            <a className="btn btn-stamp" href="/submit">
              Add Your Story
            </a>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="wrap">
          <div className="rule" style={{ marginBottom: 8 }} />
          {items.length === 0 && (
            <p className="mono" style={{ color: "var(--ink-faint)" }}>
              No entries yet. Be the first to put it on the record.
            </p>
          )}
          {items.map((s) => {
            const cat = CATEGORY_MAP[s.category];
            return (
              <div className="entry" key={s.id}>
                <div className="meta">
                  <span className="tag">{cat?.label ?? s.category}</span>
                  {s.route && <div>{s.route}</div>}
                  {s.trainNo && <div># {s.trainNo}</div>}
                  {s.amount && <div>{s.amount}</div>}
                  {s.city && <div>{s.city}</div>}
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
        </div>
      </section>
    </main>
  );
}
