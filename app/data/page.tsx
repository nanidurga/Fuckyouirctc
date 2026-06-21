import { getDashboardData } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "The Data — WAITLISTED",
  description:
    "Patterns from the public record of Indian Railways grievances — by complaint type, city, and month. Aggregate only; never an individual.",
};

function pct(count: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(2, Math.round((count / max) * 100));
}

function monthLabel(ym: string): string {
  // "2026-06" → "JUN '26"
  const [y, m] = ym.split("-");
  const names = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return `${names[Number(m) - 1] ?? m} '${y.slice(2)}`;
}

export default async function DataPage() {
  const data = await getDashboardData();

  const catMax = Math.max(1, ...data.byCategory.map((c) => c.count));
  const cityMax = Math.max(1, ...data.byCity.map((c) => c.count));
  const monthMax = Math.max(1, ...data.byMonth.map((m) => m.count));
  const evidencePct = data.total > 0 ? Math.round((data.withEvidence / data.total) * 100) : 0;

  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <div className="kicker">03 / The data</div>
          <h1>Patterns in the record</h1>
          <p>
            Aggregated from approved submissions — the shape of what travellers report, never
            who reported it. The record is young, so early numbers are small and honest; they
            grow with every story put on the wall.
          </p>
          <div className="btn-row">
            <a className="btn btn-stamp" href="/submit">
              Add Your Story
            </a>
            <a className="btn btn-ghost" href="/wall">
              See the Wall
            </a>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="rule" style={{ marginBottom: 0 }} />
          <div className="stats">
            <div className="stat">
              <div className="num">{data.total}</div>
              <div className="lab">Grievances on record</div>
              <div className="src">Approved · public</div>
            </div>
            <div className="stat">
              <div className="num">{evidencePct}%</div>
              <div className="lab">Backed by evidence on file</div>
              <div className="src">{data.withEvidence} of {data.total}</div>
            </div>
            <div className="stat">
              <div className="num">{data.pledgeCount}</div>
              <div className="lab">No-booking pledges signed</div>
              <div className="src">Voluntary · public</div>
            </div>
            <div className="stat">
              <div className="num">{data.byCity.length}</div>
              <div className="lab">Cities represented</div>
              <div className="src">Top 8 shown below</div>
            </div>
          </div>
          <div className="rule" />
        </div>
      </section>

      {/* By complaint type */}
      <section className="section" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">A</span>
            <h2>By complaint type</h2>
          </div>
          <div className="chart">
            {data.byCategory.map((c) => (
              <div className="bar-row" key={c.id}>
                <div className="bar-label">{c.label}</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct(c.count, catMax)}%` }} />
                </div>
                <div className="bar-num">{c.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where it's happening */}
      <section className="section" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">B</span>
            <h2>Where it&rsquo;s happening</h2>
          </div>
          {data.byCity.length === 0 ? (
            <p className="chart-empty">No cities on record yet.</p>
          ) : (
            <div className="chart">
              {data.byCity.map((c) => (
                <div className="bar-row" key={c.name}>
                  <div className="bar-label">{c.name}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${pct(c.count, cityMax)}%` }} />
                  </div>
                  <div className="bar-num">{c.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Over time */}
      <section className="section" style={{ paddingTop: 8 }}>
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">C</span>
            <h2>On the record over time</h2>
          </div>
          {data.byMonth.length === 0 ? (
            <p className="chart-empty">No dated entries yet.</p>
          ) : (
            <div className="chart-months">
              {data.byMonth.map((m) => (
                <div className="month-col" key={m.month}>
                  <div className="col-num">{m.count}</div>
                  <div className="col-bar" style={{ height: `${pct(m.count, monthMax)}%` }} />
                  <div className="col-lab">{monthLabel(m.month)}</div>
                </div>
              ))}
            </div>
          )}
          <p className="chart-empty" style={{ marginTop: 22, maxWidth: 640, lineHeight: 1.7 }}>
            Note: Tatkal sellout-time heatmaps need booking-window data we don&rsquo;t collect or
            scrape. This dashboard reports only what travellers put on the record — by design.
          </p>
        </div>
      </section>
    </main>
  );
}
