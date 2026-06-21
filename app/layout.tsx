import type { Metadata } from "next";
import { Oswald, Newsreader, DM_Mono } from "next/font/google";
import "./globals.css";
import { getLocale, getDict, type Locale } from "@/lib/i18n";
import LangToggle from "./lang-toggle";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

// metadataBase lets Next resolve the auto-generated opengraph-image to an
// absolute URL (required for link unfurls). Set NEXT_PUBLIC_SITE_URL in Vercel
// to the production domain; falls back to the default Vercel URL otherwise.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://waitlisted.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "WAITLISTED — The citizens' record of Indian Railways",
  description:
    "The network grew 23%. The passengers grew 1,344%. WAITLISTED is the public, evidence-backed record of how Indian Railways fails ordinary travellers — and a toolkit to do something about it.",
  openGraph: {
    title: "WAITLISTED — The citizens' record of Indian Railways",
    description:
      "Tatkal in 8 seconds. eWallet money you can't withdraw. Coaches packed like freight. Add your story to the record.",
    type: "website",
  },
  twitter: {
    // No twitter-image file → Next reuses opengraph-image as the Twitter card.
    card: "summary_large_image",
    title: "WAITLISTED — The citizens' record of Indian Railways",
    description:
      "Tatkal in 8 seconds. eWallet money you can't withdraw. Coaches packed like freight. Add your story to the record.",
  },
};

async function Masthead() {
  const [locale, t] = await Promise.all([getLocale(), getDict()]);
  return (
    <header className="masthead">
      <div className="masthead-row">
        <a href="/" className="brand">
          WAITLISTED <span className="pnr">PNR&nbsp;: WL/RAC</span>
        </a>
        <nav className="nav">
          <a href="/wall">{t.nav.wall}</a>
          <a href="/data">{t.nav.data}</a>
          <a href="/act">{t.nav.act}</a>
          <a href="/submit">{t.nav.submit}</a>
          <LangToggle locale={locale} otherLabel={t.toggle.other} />
        </nav>
      </div>
    </header>
  );
}

async function Footer() {
  const t = await getDict();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="rule" style={{ marginBottom: 24 }} />
        <p
          className="disclaimer"
          dangerouslySetInnerHTML={{
            __html: t.footerHtml.replace("{year}", String(new Date().getFullYear())),
          }}
        />
      </div>
    </footer>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale: Locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${oswald.variable} ${newsreader.variable} ${dmMono.variable}`}>
        <Masthead />
        {children}
        <Footer />
      </body>
    </html>
  );
}
