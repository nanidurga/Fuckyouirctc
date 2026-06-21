"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { type CategoryId } from "@/lib/data";

type FormStrings = {
  category: string;
  headline: string;
  headlinePh: string;
  story: string;
  storyPh: string;
  routeOpt: string;
  routePh: string;
  trainOpt: string;
  trainPh: string;
  amountOpt: string;
  amountPh: string;
  cityOpt: string;
  cityPh: string;
  evidenceUpload: string;
  evidenceHint: string;
  evidenceLabel: string;
  truthNote: string;
  fileBtn: string;
  filingBtn: string;
  loading: string;
  okTag: string;
  okTitle: string;
  okMsg: string;
  okSeeWall: string;
  okAddAnother: string;
  errGeneric: string;
  errNetwork: string;
};

type Cat = { id: CategoryId; label: string; codename: string };

type State = { kind: "idle" | "sending" | "ok" | "error"; msg?: string };

export default function SubmitForm({ t, cats }: { t: FormStrings; cats: Cat[] }) {
  const params = useSearchParams();
  const preset = (params.get("category") as CategoryId) || cats[0].id;
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "sending" });
    const form = e.currentTarget;
    // Send the form as multipart/form-data so the optional evidence file rides
    // along. Don't set Content-Type — the browser adds the multipart boundary.
    const fd = new FormData(form);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setState({ kind: "error", msg: data.error || t.errGeneric });
        return;
      }
      setState({ kind: "ok" });
      form.reset();
    } catch {
      setState({ kind: "error", msg: t.errNetwork });
    }
  }

  if (state.kind === "ok") {
    return (
      <div className="ticket">
        <div className="kicker" style={{ color: "var(--signal)" }}>{t.okTag}</div>
        <h2 className="display" style={{ fontSize: "2rem", margin: "10px 0" }}>
          {t.okTitle}
        </h2>
        <p className="notice notice-ok" style={{ marginTop: 14 }}>{t.okMsg}</p>
        <div className="btn-row">
          <a className="btn btn-ghost" href="/wall">{t.okSeeWall}</a>
          <button className="btn" onClick={() => setState({ kind: "idle" })}>{t.okAddAnother}</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="ticket">
      <div className="field">
        <label htmlFor="category">{t.category}</label>
        <select id="category" name="category" defaultValue={preset} required>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label} — {c.codename}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="title">{t.headline}</label>
        <input id="title" name="title" maxLength={140} placeholder={t.headlinePh} required />
      </div>

      <div className="field">
        <label htmlFor="story">{t.story}</label>
        <textarea id="story" name="story" maxLength={4000} placeholder={t.storyPh} required />
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="route">{t.routeOpt}</label>
          <input id="route" name="route" maxLength={40} placeholder={t.routePh} />
        </div>
        <div className="field">
          <label htmlFor="trainNo">{t.trainOpt}</label>
          <input id="trainNo" name="trainNo" maxLength={20} placeholder={t.trainPh} />
        </div>
      </div>

      <div className="grid-2">
        <div className="field">
          <label htmlFor="amount">{t.amountOpt}</label>
          <input id="amount" name="amount" maxLength={20} placeholder={t.amountPh} />
        </div>
        <div className="field">
          <label htmlFor="city">{t.cityOpt}</label>
          <input id="city" name="city" maxLength={60} placeholder={t.cityPh} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="evidence">{t.evidenceUpload}</label>
        <input
          id="evidence"
          name="evidence"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        />
        <p className="mono" style={{ fontSize: "0.7rem", color: "var(--ink-faint)", marginTop: 7 }}>
          {t.evidenceHint}
        </p>
      </div>

      <div className="field">
        <label className="checkrow">
          <input type="checkbox" name="hasEvidence" />
          <span>{t.evidenceLabel}</span>
        </label>
      </div>

      {state.kind === "error" && (
        <p className="notice notice-err" style={{ marginBottom: 16 }}>{state.msg}</p>
      )}

      <p className="mono" style={{ fontSize: "0.72rem", color: "var(--ink-faint)", marginBottom: 18 }}>
        {t.truthNote}
      </p>

      <button className="btn btn-stamp" type="submit" disabled={state.kind === "sending"}>
        {state.kind === "sending" ? t.filingBtn : t.fileBtn}
      </button>
    </form>
  );
}
