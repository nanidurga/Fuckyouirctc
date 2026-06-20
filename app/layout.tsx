import type { Metadata } from "next";
import { Oswald, Newsreader, DM_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "WAITLISTED — The citizens' record of Indian Railways",
  description:
    "The network grew 23%. The passengers grew 1,344%. WAITLISTED is the public, evidence-backed record of how Indian Railways fails ordinary travellers — and a toolkit to do something about it.",
  openGraph: {
    title: "WAITLISTED — The citizens' record of Indian Railways",
    description:
      "Tatkal in 8 seconds. eWallet money you can't withdraw. Coaches packed like freight. Add your story to the record.",
    type: "website",
  },
};

function Masthead() {
  return (
    <header className="masthead">
      <div className="masthead-row">
        <a href="/" className="brand">
          WAITLISTED <span className="pnr">PNR&nbsp;: WL/RAC</span>
        </a>
        <nav className="nav">
          <a href="/wall">Wall of Shame</a>
          <a href="/act">Take Action</a>
          <a href="/submit">Add Your Story</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="rule" style={{ marginBottom: 24 }} />
        <p className="disclaimer">
          WAITLISTED is an independent citizens&rsquo; record and satire project. It is{" "}
          <b>not affiliated with IRCTC, Indian Railways, or any government body</b>, and does
          not interact with, access, or interfere with any railway booking system. All
          grievances are user-submitted, moderated, and published in aggregate &mdash; we do
          not name or accuse individuals. Statistics are drawn from public sources (PRS India,
          NITI Aayog and press reports), linked throughout. This is protected expression and
          civic advocacy: our only tools are the truth, your stories, and the official
          channels &mdash; RTI, CPGRAMS and RailMadad. &copy; {new Date().getFullYear()}{" "}
          WAITLISTED.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${newsreader.variable} ${dmMono.variable}`}>
        <Masthead />
        {children}
        <Footer />
      </body>
    </html>
  );
}
