"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, type CategoryId } from "@/lib/data";

type State = { kind: "idle" | "sending" | "ok" | "error"; msg?: string };

export default function SubmitForm() {
  const params = useSearchParams();
  const preset = (params.get("category") as CategoryId) || CATEGORIES[0].id;
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "sending" });
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      category: fd.get("category"),
      title: fd.get("title"),
      story: fd.get("story"),
      route: fd.get("route"),
      trainNo: fd.get("trainNo"),
      amount: fd.get("amount"),
      city: fd.get("city"),
      hasEvidence: fd.get("hasEvidence") === "on",
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ kind: "error", msg: data.error || "Something went wrong." });
        return;
      }
      setState({
        kind: "ok",
        msg: "On the record. Our moderators will review it before it appears on the Wall of Shame. Thank you for speaking up.",
      });
      form.reset();
    } catch {
      setState({ kind: "error", msg: "Network error. Please try again." });
    }
  }

  if (state.kind === "ok") {
    return (
      <div className="ticket">
        <div className="kicker" style={{ color: "var(--signal)" }}>Received</div>
        <h2 className="display" style={{ fontSize: "2rem", margin: "10px 0" }}>
          PNR confirmed.
        </h2>
        <p className="notice notice-ok" style={{ marginTop: 14 }}>{state.msg}</p>
        <div className="btn-row">
          <a className="btn btn-ghost" href="/wall">See the Wall →</a>
          <button className="btn" onClick={() => setState({ kind: "idle" })}>Add another</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="ticket">
      <div className="field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" defaultValue={preset} required>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label} — {c.codename}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="title">Headline</label>
        <input id="title" name="title" maxLength={140} placeholder="e.g. Loaded ₹2,000 in eWallet, can't withdraw it" required />
      </div>

      <div className="field">
        <label htmlFor="story">What happened</label>
        <textarea id="story" name="story" maxLength={4000} placeholder="Dates, times, what you tried, how it was 'resolved' without being fixed. Be specific." required />
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="route">Route (optional)</label>
          <input id="route" name="route" maxLength={40} placeholder="NDLS → BCT" />
        </div>
        <div className="field">
          <label htmlFor="trainNo">Train no. (optional)</label>
          <input id="trainNo" name="trainNo" maxLength={20} placeholder="12952" />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="amount">Amount involved (optional)</label>
          <input id="amount" name="amount" maxLength={20} placeholder="₹2,000" />
        </div>
        <div className="field">
          <label htmlFor="city">City (optional)</label>
          <input id="city" name="city" maxLength={60} placeholder="Pune" />
        </div>
      </div>

      <div className="field">
        <label className="checkrow">
          <input type="checkbox" name="hasEvidence" />
          <span>
            I have a screenshot / ticket / PNR as evidence and can provide it on request.
            (Evidence makes your story far harder to dismiss.)
          </span>
        </label>
      </div>

      {state.kind === "error" && (
        <p className="notice notice-err" style={{ marginBottom: 16 }}>{state.msg}</p>
      )}

      <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)", marginBottom: 18 }}>
        Keep it true. Don&rsquo;t name individuals as corrupt without proof &mdash; we publish
        patterns, not accusations. We never publish your identity.
      </p>

      <button className="btn btn-stamp" type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? "Filing…" : "File This Grievance"}
      </button>
    </form>
  );
}
