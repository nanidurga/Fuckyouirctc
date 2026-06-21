"use client";

import { LANG_COOKIE, type Locale } from "@/lib/i18n-shared";

// Flips the language cookie and reloads so server components re-render in the new
// locale. No URL change (per product decision) — one shared URL for all languages.
export default function LangToggle({ locale, otherLabel }: { locale: Locale; otherLabel: string }) {
  const next: Locale = locale === "hi" ? "en" : "hi";

  function switchTo() {
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={switchTo}
      aria-label={`Switch language to ${otherLabel}`}
    >
      {otherLabel}
    </button>
  );
}
