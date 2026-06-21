import { cookies } from "next/headers";
import type { CategoryId } from "./data";
import { LANG_COOKIE, LOCALES, type Locale } from "./i18n-shared";

export { LANG_COOKIE, LOCALES };
export type { Locale };

// ─────────────────────────────────────────────────────────────────────────────
// i18n — cookie-driven, no URL change (per product decision).
//
// A language toggle in the masthead sets the `wl_lang` cookie; server components
// read it via getDict() and render the matching dictionary. English is the
// source of truth; `hi` must mirror its shape (enforced by the Dict type).
//
// Strings ending in "Html" may contain inline <b>/<br> and are rendered with
// dangerouslySetInnerHTML — keep them to our own trusted copy only.
// ─────────────────────────────────────────────────────────────────────────────

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  return c.get(LANG_COOKIE)?.value === "hi" ? "hi" : "en";
}

export async function getDict(): Promise<Dict> {
  return DICTS[await getLocale()];
}

type CatCopy = { codename: string; label: string; blurb: string };

type Dict = {
  nav: { wall: string; data: string; act: string; submit: string };
  toggle: { label: string; other: string };
  footerHtml: string; // {year} placeholder, may contain <b>
  home: {
    kicker: string;
    titlePre: string;
    titleMid: string;
    titleStruck: string;
    titlePost: string;
    ledeHtml: string;
    addStory: string;
    readWall: string;
    statLabels: [string, string, string, string];
    onRecord: string;
    s1: string;
    s2: string;
    s3: string;
    wallMeta: (approved: number, pending: number) => string;
    seeAll: string;
    tools: { n: string; title: string; desc: string }[];
  };
  categories: Record<CategoryId, CatCopy>;
  wall: { kicker: string; title: string; bodyHtml: (approved: number, pending: number) => string };
  data: {
    kicker: string;
    title: string;
    body: string;
    seeWall: string;
    statTotal: string;
    statTotalSrc: string;
    statEvidence: string;
    statEvidenceSrc: (withEvidence: number, total: number) => string;
    statPledge: string;
    statPledgeSrc: string;
    statCities: string;
    statCitiesSrc: string;
    secType: string;
    secWhere: string;
    secTime: string;
    noCities: string;
    noDated: string;
    note: string;
  };
};

const en: Dict = {
  nav: { wall: "Wall of Shame", data: "The Data", act: "Take Action", submit: "Add Your Story" },
  toggle: { label: "EN", other: "हिन्दी" },
  footerHtml:
    "WAITLISTED is an independent citizens’ record and satire project. It is " +
    "<b>not affiliated with IRCTC, Indian Railways, or any government body</b>, and does not " +
    "interact with, access, or interfere with any railway booking system. All grievances are " +
    "user-submitted, moderated, and published in aggregate — we do not name or accuse " +
    "individuals. Statistics are drawn from public sources (PRS India, NITI Aayog and press " +
    "reports), linked throughout. This is protected expression and civic advocacy: our only " +
    "tools are the truth, your stories, and the official channels — RTI, CPGRAMS and " +
    "RailMadad. © {year} WAITLISTED.",
  home: {
    kicker: "Indian Railways · Citizens’ Reservation Chart of Grievances",
    titlePre: "The whole nation",
    titleMid: "is ",
    titleStruck: "waitlisted",
    titlePost: ".",
    ledeHtml:
      "The network grew <b>23%</b>. The passengers grew <b>1,344%</b>. The difference is the " +
      "crush in your coach, the spinner on Tatkal, and the money stuck in your eWallet. This is " +
      "the public record — with your evidence on it.",
    addStory: "Add Your Story",
    readWall: "Read the Wall of Shame →",
    statLabels: [
      "Route kilometres added since Independence",
      "Passenger traffic growth over the same period",
      "Annual track addition — vs ~4.5% economic growth",
      "Capacity utilisation on major trunk routes",
    ],
    onRecord: "On Record",
    s1: "The patterns, named.",
    s2: "Wall of Shame",
    s3: "Don’t just vent. Make it official.",
    wallMeta: (a, p) => `${a} ON RECORD · ${p} IN REVIEW`,
    seeAll: "See all grievances →",
    tools: [
      { n: "TOOL 01", title: "File an RTI", desc: "Demand the data they won’t volunteer: Tatkal sellout times, coach-mix changes, action taken on agent bots." },
      { n: "TOOL 02", title: "Lodge a CPGRAMS / RailMadad complaint", desc: "One link to the official grievance portals, with pre-worded text so it takes a minute, not an afternoon." },
      { n: "TOOL 03", title: "Write to your MP", desc: "A ready letter to your constituency representative. Pressure they can’t auto-close." },
      { n: "TOOL 04", title: "Share the receipt", desc: "Auto-generated card for WhatsApp & X. Every share pulls one more person onto the record." },
    ],
  },
  categories: {
    tatkal: { codename: "Sold out in seconds", label: "Tatkal Roulette", blurb: "Tickets vanish in under 10 seconds to agents & bots while you watch the spinner." },
    ewallet: { codename: "Money in, never out", label: "The eWallet Trap", blurb: "IRCTC eWallet / RailOne let you load money in one tap — then withdrawing it is a maze. Your money, held hostage." },
    overcrowding: { codename: "Humans as freight", label: "Cattle Class", blurb: "Sleeper & general coaches packed past any safe limit, year after year." },
    cleanliness: { codename: "Ghost complaints", label: "Resolved, Not Fixed", blurb: "Filthy coaches, broken toilets, complaints auto-closed without anyone showing up." },
    refund: { codename: "Deducted & forgotten", label: "Refund Roulette", blurb: "Cancellations and failed bookings where the money disappears into the void." },
    safety: { codename: "Avoidable risk", label: "Safety Last", blurb: "Overloading, doors that won’t shut, no help when something goes wrong." },
    corruption: { codename: "Pay to travel", label: "Chai-Paani", blurb: "Pressure to pay extra for a berth that should already be yours. (Aggregated, no names.)" },
  },
  wall: {
    kicker: "02 / The public record",
    title: "Wall of Shame",
    bodyHtml: (a, p) =>
      "Every entry is submitted by a traveller and reviewed before it appears. We publish the " +
      "story, never the person who caused it — this is a record of a broken system, not a " +
      `list of accusations. <b>${a}</b> on record · <b>${p}</b> in review.`,
  },
  data: {
    kicker: "03 / The data",
    title: "Patterns in the record",
    body:
      "Aggregated from approved submissions — the shape of what travellers report, never " +
      "who reported it. The record is young, so early numbers are small and honest; they grow " +
      "with every story put on the wall.",
    seeWall: "See the Wall",
    statTotal: "Grievances on record",
    statTotalSrc: "Approved · public",
    statEvidence: "Backed by evidence on file",
    statEvidenceSrc: (w, t) => `${w} of ${t}`,
    statPledge: "No-booking pledges signed",
    statPledgeSrc: "Voluntary · public",
    statCities: "Cities represented",
    statCitiesSrc: "Top 8 shown below",
    secType: "By complaint type",
    secWhere: "Where it’s happening",
    secTime: "On the record over time",
    noCities: "No cities on record yet.",
    noDated: "No dated entries yet.",
    note:
      "Note: Tatkal sellout-time heatmaps need booking-window data we don’t collect or " +
      "scrape. This dashboard reports only what travellers put on the record — by design.",
  },
};

const hi: Dict = {
  nav: { wall: "शर्म की दीवार", data: "आँकड़े", act: "कार्रवाई करें", submit: "अपनी कहानी जोड़ें" },
  toggle: { label: "हिन्दी", other: "EN" },
  footerHtml:
    "WAITLISTED एक स्वतंत्र नागरिक रिकॉर्ड और व्यंग्य परियोजना है। यह " +
    "<b>IRCTC, भारतीय रेलवे या किसी सरकारी निकाय से संबद्ध नहीं है</b>, और किसी भी रेलवे बुकिंग प्रणाली को " +
    "न तो एक्सेस करता है, न छेड़ता है। सभी शिकायतें उपयोगकर्ताओं द्वारा भेजी जाती हैं, " +
    "मॉडरेट की जाती हैं और सामूहिक रूप से प्रकाशित होती हैं — हम किसी व्यक्ति का नाम नहीं लेते या आरोप नहीं लगाते। " +
    "आँकड़े सार्वजनिक स्रोतों (PRS India, NITI Aayog और प्रेस रिपोर्ट) से लिए गए हैं। " +
    "यह संरक्षित अभिव्यक्ति और नागरिक पैरवी है: हमारे हथियार सिर्फ सच, आपकी कहानियाँ और " +
    "आधिकारिक माध्यम — RTI, CPGRAMS और RailMadad — हैं। © {year} WAITLISTED.",
  home: {
    kicker: "भारतीय रेलवे · नागरिकों का शिकायत आरक्षण चार्ट",
    titlePre: "पूरा देश",
    titleMid: "",
    titleStruck: "वेटिंग-लिस्ट",
    titlePost: " में है।",
    ledeHtml:
      "रेल नेटवर्क <b>23%</b> बढ़ा। यात्री <b>1,344%</b> बढ़े। यही फ़र्क़ " +
      "आपके डिब्बे की भीड़, तत्काल के स्पिनर और ई-वॉलेट में फँसे पैसे में दिखता है। " +
      "यह सार्वजनिक रिकॉर्ड है — आपके सबूतों के साथ।",
    addStory: "अपनी कहानी जोड़ें",
    readWall: "शर्म की दीवार पढ़ें →",
    statLabels: [
      "आज़ादी के बाद जोड़े गए रूट किलोमीटर",
      "उसी अवधि में यात्री यातायात में वृद्धि",
      "वार्षिक ट्रैक वृद्धि — ~4.5% आर्थिक वृद्धि के मुकाबले",
      "प्रमुख ट्रंक मार्गों पर क्षमता उपयोग",
    ],
    onRecord: "रिकॉर्ड पर",
    s1: "पैटर्न, नाम के साथ।",
    s2: "शर्म की दीवार",
    s3: "सिर्फ गुस्सा मत करिए। इसे आधिकारिक बनाइए।",
    wallMeta: (a, p) => `${a} रिकॉर्ड पर · ${p} समीक्षा में`,
    seeAll: "सभी शिकायतें देखें →",
    tools: [
      { n: "टूल 01", title: "RTI दायर करें", desc: "वह डेटा मांगें जो वे खुद नहीं देते: तत्काल सेलआउट समय, कोच-मिक्स बदलाव, एजेंट बॉट्स पर की गई कार्रवाई।" },
      { n: "टूल 02", title: "CPGRAMS / RailMadad पर शिकायत दर्ज करें", desc: "आधिकारिक शिकायत पोर्टल का एक लिंक, पहले से लिखे गए टेक्स्ट के साथ — एक मिनट में, पूरी दोपहर नहीं।" },
      { n: "टूल 03", title: "अपने सांसद को लिखें", desc: "आपके निर्वाचन क्षेत्र के प्रतिनिधि के लिए तैयार पत्र। ऐसा दबाव जिसे वे ऑटो-क्लोज़ नहीं कर सकते।" },
      { n: "टूल 04", title: "रसीद शेयर करें", desc: "WhatsApp और X के लिए ऑटो-जेनरेटेड कार्ड। हर शेयर एक और व्यक्ति को रिकॉर्ड पर लाता है।" },
    ],
  },
  categories: {
    tatkal: { codename: "सेकंडों में सोल्ड आउट", label: "तत्काल रूलेट", blurb: "आप स्पिनर देखते रहते हैं और 10 सेकंड से भी कम में टिकट एजेंटों औ बॉट्स के पास चले जाते हैं।" },
    ewallet: { codename: "पैसा अंदर, बाहर नहीं", label: "ई-वॉलेट जाल", blurb: "IRCTC eWallet / RailOne में एक टैप में पैसा डालें — पर निकालना एक भूलभुलैया है। आपका पैसा, बंधक।" },
    overcrowding: { codename: "इंसान माल की तरह", label: "कैटल क्लास", blurb: "स्लीपर और जनरल डिब्बे हर साल किसी भी सुरक्षित सीमा से ज़्यादा भरे होते हैं।" },
    cleanliness: { codename: "भूतिया शिकायतें", label: "हल नहीं, सिर्फ बंद", blurb: "गंदे डिब्बे, टूटे शौचालय, और शिकायतें जो बिना किसी के आए ऑटो-क्लोज़ हो जाती हैं।" },
    refund: { codename: "कटा और भूला", label: "रिफंड रूलेट", blurb: "कैंसिलेशन और फेल बुकिंग जहां पैसा कहीं गायब हो जाता है।" },
    safety: { codename: "टालने योग्य जोखिम", label: "सुरक्षा सबसे पीछे", blurb: "ओवरलोडिंग, जो दरवाजे बंद नहीं होते, और गड़बड़ होने पर कोई मदद नहीं।" },
    corruption: { codename: "यात्रा के लिए भुगतान", label: "चाय-पानी", blurb: "उस बर्थ के लिए अतिरिक्त भुगतान का दबाव जो पहले से आपका होना चाहिए। (सामूहिक, बिना नाम।)" },
  },
  wall: {
    kicker: "02 / सार्वजनिक रिकॉर्ड",
    title: "शर्म की दीवार",
    bodyHtml: (a, p) =>
      "हर एंट्री एक यात्री द्वारा भेजी जाती है और दिखने से पहले समीक्षा की जाती है। हम कहानी " +
      "प्रकाशित करते हैं, उस व्यक्ति को कभी नहीं — यह एक टूटी व्यवस्था का रिकॉर्ड है, " +
      `आरोपों की सूची नहीं। <b>${a}</b> रिकॉर्ड पर · <b>${p}</b> समीक्षा में।`,
  },
  data: {
    kicker: "03 / आँकड़े",
    title: "रिकॉर्ड में पैटर्न",
    body:
      "स्वीकृत शिकायतों से सामूहिक रूप से — यात्री क्या रिपोर्ट करते हैं इसका स्वरूप, कभी यह नहीं कि किसने किया। " +
      "रिकॉर्ड अभी नया है, इसलिए शुरुआती आँकड़े छोटे और ईमानदार हैं; दीवार पर हर कहानी के साथ बढ़ते हैं।",
    seeWall: "दीवार देखें",
    statTotal: "रिकॉर्ड पर शिकायतें",
    statTotalSrc: "स्वीकृत · सार्वजनिक",
    statEvidence: "फाइल पर सबूत के साथ",
    statEvidenceSrc: (w, t) => `${t} में से ${w}`,
    statPledge: "नो-बुकिंग शपथ ली गई",
    statPledgeSrc: "स्वैच्छिक · सार्वजनिक",
    statCities: "शामिल शहर",
    statCitiesSrc: "नीचे शीर्ष 8",
    secType: "शिकायत के प्रकार से",
    secWhere: "कहाँ हो रहा है",
    secTime: "समय के साथ रिकॉर्ड पर",
    noCities: "अभी तक कोई शहर रिकॉर्ड पर नहीं।",
    noDated: "अभी तक कोई दिनांकित एंट्री नहीं।",
    note:
      "नोट: तत्काल सेलआउट-समय हीटमैप के लिए बुकिंग-विंडो डेटा चाहिए जो हम न एकत्र करते " +
      "हैं न स्क्रैप करते हैं। यह डैशबोर्ड केवल वही दिखाता है जो यात्री रिकॉर्ड पर डालते हैं — यह सोच-समझकर।",
  },
};

const DICTS: Record<Locale, Dict> = { en, hi };
