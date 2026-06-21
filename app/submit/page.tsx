import { Suspense } from "react";
import SubmitForm from "./submit-form";
import { getDict } from "@/lib/i18n";
import { CATEGORIES } from "@/lib/data";

export const metadata = {
  title: "Add Your Story — WAITLISTED",
};

export default async function SubmitPage() {
  const t = await getDict();
  const cats = CATEGORIES.map((c) => ({
    id: c.id,
    label: t.categories[c.id].label,
    codename: t.categories[c.id].codename,
  }));

  return (
    <main>
      <section className="page-intro">
        <div className="wrap">
          <div className="kicker">{t.submitPage.kicker}</div>
          <h1>{t.submitPage.title}</h1>
          <p>{t.submitPage.intro}</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 24 }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          <Suspense fallback={<p className="mono">{t.form.loading}</p>}>
            <SubmitForm t={t.form} cats={cats} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
