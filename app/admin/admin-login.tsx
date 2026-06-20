"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setErr(data.error || "Login failed.");
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="ticket" onSubmit={onSubmit}>
      {!configured && (
        <p className="notice notice-err" style={{ marginBottom: 16 }}>
          ADMIN_PASSWORD is not set. Add it to <span className="mono">.env.local</span> and
          restart the dev server.
        </p>
      )}
      <div className="field">
        <label htmlFor="pw">Admin password</label>
        <input
          id="pw"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoFocus
          required
        />
      </div>
      {err && (
        <p className="notice notice-err" style={{ marginBottom: 16 }}>
          {err}
        </p>
      )}
      <button className="btn btn-stamp" type="submit" disabled={busy || !configured}>
        {busy ? "Checking…" : "Enter"}
      </button>
    </form>
  );
}
