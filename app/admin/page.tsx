import { isAuthed, adminConfigured } from "@/lib/auth";
import { getPendingSubmissions } from "@/lib/store";
import AdminLogin from "./admin-login";
import AdminDashboard from "./admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Moderation — WAITLISTED",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAuthed();

  if (!authed) {
    return (
      <main>
        <section className="page-intro">
          <div className="wrap">
            <div className="kicker">Restricted</div>
            <h1>Moderation desk</h1>
            <p>Approve or reject grievances before they reach the public record.</p>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 24 }}>
          <div className="wrap" style={{ maxWidth: 460 }}>
            <AdminLogin configured={adminConfigured()} />
          </div>
        </section>
      </main>
    );
  }

  const pending = await getPendingSubmissions();

  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <div className="kicker">Moderation desk</div>
          <h1>In the queue</h1>
          <p>
            {pending.length === 0
              ? "Inbox zero. Nothing waiting."
              : `${pending.length} grievance${pending.length === 1 ? "" : "s"} awaiting review. Approve only what is true, specific, and free of named accusations.`}
          </p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap">
          <AdminDashboard items={pending} />
        </div>
      </section>
    </main>
  );
}
