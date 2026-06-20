import { Suspense } from "react";
import SubmitForm from "./submit-form";

export const metadata = {
  title: "Add Your Story — WAITLISTED",
};

export default function SubmitPage() {
  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <div className="kicker">File a grievance</div>
          <h1>Put it on the record.</h1>
          <p>
            Tell us what happened. Keep it true and specific &mdash; the stronger the detail and
            evidence, the harder it is to dismiss. Submissions are reviewed before they go
            public, and we never publish your name or contact details.
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <Suspense fallback={<p className="mono">Loading form…</p>}>
            <SubmitForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
