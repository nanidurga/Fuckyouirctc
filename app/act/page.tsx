import { getDict } from "@/lib/i18n";
import ShareSheet from "@/app/share-sheet";

export const metadata = {
  title: "Take Action — WAITLISTED",
};

export default async function Act() {
  const t = await getDict();
  const a = t.act;

  // A share only unfurls an OG card if the shared TEXT contains a URL pointing at
  // the live site. Set NEXT_PUBLIC_SITE_URL in Vercel to the production domain.
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://fuckyouirctc.vercel.app";
  const waHref = `https://wa.me/?text=${encodeURIComponent(`${a.share.shareMsg} ${site}`)}`;
  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${a.share.shareMsg} ${a.share.shareTags}`,
  )}&url=${encodeURIComponent(site)}`;
  // Generic (non-grievance) vertical story card for the toolkit's share section.
  const storyImg = `${site}/api/og/story`;

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
          <ShareSheet
            storyImg={storyImg}
            shareText={`${a.share.shareMsg} ${site}`}
            waHref={waHref}
            xHref={xHref}
            labels={{
              storyTag: a.share.storyTag,
              storyTitle: a.share.storyTitle,
              storyDesc: a.share.storyDesc,
              storyBusy: a.share.storyBusy,
              storyDone: a.share.storyDone,
              storyErr: a.share.storyErr,
              waTag: a.share.waTag,
              waTitle: a.share.waTitle,
              waDesc: a.share.waDesc,
              xTag: a.share.xTag,
              xTitle: a.share.xTitle,
              xDesc: a.share.xDesc,
            }}
          />
        </div>
      </section>
    </main>
  );
}
