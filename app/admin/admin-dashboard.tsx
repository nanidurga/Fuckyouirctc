"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORY_MAP } from "@/lib/data";
import type { Submission } from "@/lib/store";

export default function AdminDashboard({ items }: { items: Submission[] }) {
  const router = useRouter();
  const [list, setList] = useState<Submission[]>(items);
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function act(id: string, status: "approved" | "rejected") {
    setBusy(id);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || "Action failed.");
        return;
      }
      setList((l) => l.filter((x) => x.id !== id));
      router.refresh(); // keep public pages / counts in sync
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(null);
    }
  }

  async function viewEvidence(path: string) {
    setErr(null);
    try {
      const res = await fetch(`/api/admin/evidence?path=${encodeURIComponent(path)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setErr(data.error || "Could not load evidence.");
        return;
      }
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch {
      setErr("Network error.");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div>
      <div className="btn-row" style={{ marginTop: 0, marginBottom: 18, justifyContent: "flex-end" }}>
        <button className="btn btn-ghost" onClick={logout}>
          Log out
        </button>
      </div>

      {err && (
        <p className="notice notice-err" style={{ marginBottom: 16 }}>
          {err}
        </p>
      )}

      {list.length === 0 && (
        <p className="mono" style={{ color: "var(--ink-faint)" }}>
          Nothing left to review.
        </p>
      )}

      <div className="rule" style={{ marginBottom: 8 }} />
      {list.map((s) => {
        const cat = CATEGORY_MAP[s.category];
        const working = busy === s.id;
        return (
          <div className="entry" key={s.id}>
            <div className="meta">
              <span className="tag">{cat?.label ?? s.category}</span>
              {s.route && <div>{s.route}</div>}
              {s.trainNo && <div># {s.trainNo}</div>}
              {s.amount && <div>{s.amount}</div>}
              {s.city && <div>{s.city}</div>}
              <div>{new Date(s.createdAt).toLocaleString("en-IN")}</div>
            </div>
            <div>
              <h4>{s.title}</h4>
              <p className="story">{s.story}</p>
              {s.hasEvidence && (
                <span className="verified">
                  ✓ Evidence {s.evidencePath ? "uploaded" : "on file (on request)"}
                </span>
              )}
              <div className="btn-row" style={{ marginTop: 16 }}>
                {s.evidencePath && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => viewEvidence(s.evidencePath!)}
                    disabled={working}
                  >
                    View evidence →
                  </button>
                )}
                <button
                  className="btn"
                  style={{ background: "var(--signal)", borderColor: "var(--signal)" }}
                  onClick={() => act(s.id, "approved")}
                  disabled={working}
                >
                  {working ? "…" : "Approve"}
                </button>
                <button
                  className="btn btn-stamp"
                  onClick={() => act(s.id, "rejected")}
                  disabled={working}
                >
                  {working ? "…" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
