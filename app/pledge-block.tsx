"use client";

import { useState } from "react";

export default function PledgeBlock({ initial }: { initial: number }) {
  const [count, setCount] = useState(initial);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function pledge() {
    if (done || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/pledge", { method: "POST" });
      const data = await res.json();
      if (data.pledgeCount) setCount(data.pledgeCount);
      setDone(true);
    } catch {
      /* keep it silent — the count just won't move */
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pledge">
      <div className="kicker" style={{ color: "var(--amber)" }}>
        The People&rsquo;s No-Booking Day
      </div>
      <div className="count">
        {count.toLocaleString("en-IN")}
        <span className="tick">.</span>
      </div>
      <p>
        A legal, public protest: pledge not to book on a chosen day and let the count speak.
        We don&rsquo;t touch any system &mdash; we just make the number impossible to ignore.
      </p>
      <button className="btn" onClick={pledge} disabled={done || busy}>
        {done ? "✓ You're on the record" : busy ? "Recording…" : "Add My Pledge"}
      </button>
    </div>
  );
}
