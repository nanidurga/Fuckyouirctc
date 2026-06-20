export const metadata = {
  title: "Take Action — WAITLISTED",
};

const RTI_TEMPLATE = `To: The Central Public Information Officer (CPIO),
Ministry of Railways / IRCTC

Subject: Request for information under the Right to Information Act, 2005

Please provide the following information for the period [START DATE] to [END DATE]:

1. The exact time (to the second) at which Tatkal quota for train no. [TRAIN NO],
   route [FROM]–[TO], class [AC/SLEEPER], was fully booked on each date.
2. The number of bookings on the above made through registered agents vs.
   individual users.
3. Details of measures taken in the last 12 months to detect and prevent
   automated/bot bookings, and the number of agent IDs suspended as a result.
4. The change in the number of Sleeper (SL) and General (GEN) coaches vs.
   AC coaches on the above route over the last 5 years.
5. The total amount currently held in user IRCTC eWallet balances, and the
   process and average time for a user to withdraw eWallet funds to a bank account.

I am an Indian citizen. The application fee of Rs.10 is enclosed/attached.

Name: [YOUR NAME]
Address: [YOUR ADDRESS]
Date: [DATE]`;

export default function Act() {
  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <div className="kicker">03 / The toolkit</div>
          <h1>Make it official.</h1>
          <p>
            Anger trends for a day. Paperwork they are legally required to answer lasts. Here are
            the real, legal levers &mdash; each one takes minutes.
          </p>
        </div>
      </section>

      {/* RTI */}
      <section className="section" id="rti" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">TOOL 01 /</span>
            <h2>File an RTI</h2>
          </div>
          <p style={{ maxWidth: 720 }}>
            The Right to Information Act forces a public answer. If thousands ask the same
            questions, the data they avoid publishing has to come out. File online at{" "}
            <a href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer">
              rtionline.gov.in
            </a>{" "}
            (₹10 fee). Copy the template below and fill the brackets.
          </p>
          <div className="ticket" style={{ marginTop: 18 }}>
            <pre
              className="mono"
              style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "0.82rem", lineHeight: 1.6 }}
            >
              {RTI_TEMPLATE}
            </pre>
          </div>
          <div className="btn-row">
            <a className="btn btn-stamp" href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer">
              Open RTI Online →
            </a>
          </div>
        </div>
      </section>

      {/* CPGRAMS */}
      <section className="section" id="cpgrams">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">TOOL 02 /</span>
            <h2>Lodge an official complaint</h2>
          </div>
          <div className="actions">
            <a className="action" href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer">
              <div className="n">CPGRAMS</div>
              <h3>Central grievance portal →</h3>
              <p>The government&rsquo;s own complaint system. Creates a tracked, time-bound case the ministry must respond to.</p>
            </a>
            <a className="action" href="https://railmadad.indianrailways.gov.in" target="_blank" rel="noopener noreferrer">
              <div className="n">RAILMADAD</div>
              <h3>Railway complaint portal →</h3>
              <p>For journey, refund, cleanliness and safety complaints. Keep the reference number &mdash; screenshot the &ldquo;resolved&rdquo; that didn&rsquo;t fix anything.</p>
            </a>
          </div>
        </div>
      </section>

      {/* MP */}
      <section className="section" id="mp">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">TOOL 03 /</span>
            <h2>Write to your MP</h2>
          </div>
          <p style={{ maxWidth: 720 }}>
            Your Member of Parliament can raise this in Parliament and with the Railway Ministry.
            Find yours at{" "}
            <a href="https://sansad.in/ls/members" target="_blank" rel="noopener noreferrer">
              sansad.in
            </a>
            . A short, specific letter &mdash; one failure, one ask &mdash; works best.
          </p>
          <div className="ticket" style={{ marginTop: 18 }}>
            <pre className="mono" style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "0.82rem", lineHeight: 1.6 }}>
{`Respected [MP NAME],

I am a constituent from [PLACE]. As a regular railway traveller I am
unable to get confirmed Tatkal tickets — seats vanish within seconds —
and my money loaded in the IRCTC eWallet cannot be easily withdrawn.

Sleeper and general capacity has not kept pace with our population,
while premium services expand. I request you to raise in Parliament:
better non-AC capacity, action on bot/agent bookings, and a clear
eWallet withdrawal process.

Sincerely,
[YOUR NAME], [CONSTITUENCY]`}
            </pre>
          </div>
        </div>
      </section>

      {/* Share */}
      <section className="section" id="share">
        <div className="wrap">
          <div className="section-head">
            <span className="section-no">TOOL 04 /</span>
            <h2>Share the receipt</h2>
          </div>
          <p style={{ maxWidth: 720 }}>
            Reach in India runs on WhatsApp and X. Forward the record. (Auto-generated, branded
            share cards are on the build roadmap &mdash; for now, share the line and the link.)
          </p>
          <div className="actions">
            <a
              className="action"
              href="https://wa.me/?text=The%20network%20grew%2023%25.%20Passengers%20grew%201%2C344%25.%20That's%20why%20Tatkal%20sells%20out%20in%208%20seconds.%20Put%20your%20story%20on%20the%20record%3A%20"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="n">WHATSAPP</div>
              <h3>Forward on WhatsApp →</h3>
              <p>The distribution layer of India. One forward = one more person on the record.</p>
            </a>
            <a
              className="action"
              href="https://twitter.com/intent/tweet?text=The%20network%20grew%2023%25.%20Passengers%20grew%201%2C344%25.%20%23TatkalRoulette%20%23WAITLISTED"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="n">X / TWITTER</div>
              <h3>Post with #TatkalRoulette →</h3>
              <p>Where journalists and the ministry actually watch. Tag rail reporters.</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
