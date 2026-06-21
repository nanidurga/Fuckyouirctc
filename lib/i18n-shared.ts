// Server-free i18n primitives — safe to import from client components.
// (lib/i18n.ts imports next/headers and must stay server-only.)

export type Locale = "en" | "hi";
export const LOCALES: Locale[] = ["en", "hi"];
export const LANG_COOKIE = "wl_lang";
