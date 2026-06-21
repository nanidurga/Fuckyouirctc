import { getDict } from "@/lib/i18n";

export const metadata = {
  title: "Take Action — WAITLISTED",
};

export default async function Act() {
  const t = await getDict();
  const a = t.act;
  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <div className="kicker">{a.kicker}</div>
          <h1>{a.title}</h1>
          <p>{a.intro}</p>
        </div>
      </section>

      {/* RTI */}
      <section className="section" id="rti" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">{a.rti.no}</span>
            <h2>{a.rti.h}</h2>
          </div>
          <p style={{ maxWidth: 720 }} dangerouslySetInnerHTML={{ __html: a.rti.descHtml }} />
          <div className="ticket" style={{ marginTop: 18 }}>
            <pre
              className="mono"
              style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "0.82rem", lineHeight: 1.6 }}
            >
              {a.rti.template}
            </pre>
          </div>
          <div className="btn-row">
            <a className="btn btn-stamp" href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer">
              {a.rti.openBtn}
            </a>
          </div>
        </div>
      </section>

      {/* CPGRAMS */}
      <section className="section" id="cpgrams">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">{a.complaint.no}</span>
            <h2>{a.complaint.h}</h2>
          </div>
          <div className="actions">
            <a className="action" href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer">
              <div className="n">{a.complaint.cpgramsTag}</div>
              <h3>{a.complaint.cpgramsTitle}</h3>
              <p>{a.complaint.cpgramsDesc}</p>
            </a>
            <a className="action" href="https://railmadad.indianrailways.gov.in" target="_blank" rel="noopener noreferrer">
              <div className="n">{a.complaint.railmadadTag}</div>
              <h3>{a.complaint.railmadadTitle}</h3>
              <p>{a.complaint.railmadadDesc}</p>
            </a>
          </div>
        </div>
      </section>

      {/* MP */}
      <section className="section" id="mp">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">{a.mp.no}</span>
            <h2>{a.mp.h}</h2>
          </div>
          <p style={{ maxWidth: 720 }} dangerouslySetInnerHTML={{ __html: a.mp.descHtml }} />
          <div className="ticket" style={{ marginTop: 18 }}>
            <pre className="mono" style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "0.82rem", lineHeight: 1.6 }}>
              {a.mp.letter}
            </pre>
          </div>
        </div>
      </section>

      {/* Share */}
      <section className="section" id="share">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">{a.share.no}</span>
            <h2>{a.share.h}</h2>
          </div>
          <p style={{ maxWidth: 720 }} dangerouslySetInnerHTML={{ __html: a.share.descHtml }} />
          <div className="actions">
            <a
              className="action"
              href="https://wa.me/?text=The%20network%20grew%2023%25.%20Passengers%20grew%201%2C344%25.%20That's%20why%20Tatkal%20sells%20out%20in%208%20seconds.%20Put%20your%20story%20on%20the%20record%3A%20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="n">{a.share.waTag}</div>
              <h3>{a.share.waTitle}</h3>
              <p>{a.share.waDesc}</p>
            </a>
            <a
              className="action"
              href="https://twitter.com/intent/tweet?text=The%20network%20grew%2023%25.%20Passengers%20grew%201%2C344%25.%20%23TatkalRoulette%20%23WAITLISTED"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="n">{a.share.xTag}</div>
              <h3>{a.share.xTitle}</h3>
              <p>{a.share.xDesc}</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
