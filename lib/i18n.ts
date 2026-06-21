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
  act: {
    kicker: string;
    title: string;
    intro: string;
    rti: { no: string; h: string; descHtml: string; template: string; openBtn: string };
    complaint: {
      no: string;
      h: string;
      cpgramsTag: string;
      cpgramsTitle: string;
      cpgramsDesc: string;
      railmadadTag: string;
      railmadadTitle: string;
      railmadadDesc: string;
    };
    mp: { no: string; h: string; descHtml: string; letter: string };
    share: {
      no: string;
      h: string;
      descHtml: string;
      shareMsg: string;
      shareTags: string;
      waTag: string;
      waTitle: string;
      waDesc: string;
      xTag: string;
      xTitle: string;
      xDesc: string;
    };
  };
  submitPage: { kicker: string; title: string; intro: string };
  form: {
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
  act: {
    kicker: "03 / The toolkit",
    title: "Make it official.",
    intro:
      "Anger trends for a day. Paperwork they are legally required to answer lasts. Here are " +
      "the real, legal levers — each one takes minutes.",
    rti: {
      no: "TOOL 01 /",
      h: "File an RTI",
      descHtml:
        "The Right to Information Act forces a public answer. If thousands ask the same " +
        "questions, the data they avoid publishing has to come out. File online at " +
        '<a href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer">rtionline.gov.in</a>' +
        " (₹10 fee). Copy the template below and fill the brackets.",
      template: `To: The Central Public Information Officer (CPIO),
Ministry of Railways / IRCTC

Subject: Request for information under the Right to Information Act, 2005

Please provide the following information for the period [START DATE] to [END DATE]:

1. The exact time (to the second) at which Tatkal quota for train no. [TRAIN NO],
   route [FROM]–[TO], class [AC/SLEEPER], was fully booked on each date.
2. The number of bookings on the above made through registered agents vs.
   individual users.
3. Details of measures taken in the last 12 months to detect and prevent
   automated/bot bookings, and the number of agent IDs suspended as a result.
4. The change in the number of Sleeper (SL) and General (GEN) coaches vs.
   AC coaches on the above route over the last 5 years.
5. The total amount currently held in user IRCTC eWallet balances, and the
   process and average time for a user to withdraw eWallet funds to a bank account.

I am an Indian citizen. The application fee of Rs.10 is enclosed/attached.

Name: [YOUR NAME]
Address: [YOUR ADDRESS]
Date: [DATE]`,
      openBtn: "Open RTI Online →",
    },
    complaint: {
      no: "TOOL 02 /",
      h: "Lodge an official complaint",
      cpgramsTag: "CPGRAMS",
      cpgramsTitle: "Central grievance portal →",
      cpgramsDesc:
        "The government’s own complaint system. Creates a tracked, time-bound case the ministry must respond to.",
      railmadadTag: "RAILMADAD",
      railmadadTitle: "Railway complaint portal →",
      railmadadDesc:
        "For journey, refund, cleanliness and safety complaints. Keep the reference number — screenshot the “resolved” that didn’t fix anything.",
    },
    mp: {
      no: "TOOL 03 /",
      h: "Write to your MP",
      descHtml:
        "Your Member of Parliament can raise this in Parliament and with the Railway Ministry. " +
        'Find yours at <a href="https://sansad.in/ls/members" target="_blank" rel="noopener noreferrer">sansad.in</a>. ' +
        "A short, specific letter — one failure, one ask — works best.",
      letter: `Respected [MP NAME],

I am a constituent from [PLACE]. As a regular railway traveller I am
unable to get confirmed Tatkal tickets — seats vanish within seconds —
and my money loaded in the IRCTC eWallet cannot be easily withdrawn.

Sleeper and general capacity has not kept pace with our population,
while premium services expand. I request you to raise in Parliament:
better non-AC capacity, action on bot/agent bookings, and a clear
eWallet withdrawal process.

Sincerely,
[YOUR NAME], [CONSTITUENCY]`,
    },
    share: {
      no: "TOOL 04 /",
      h: "Share the receipt",
      descHtml:
        "Reach in India runs on WhatsApp and X. Forward the record — every link you share now " +
        "unfurls as a branded WAITLISTED card.",
      shareMsg:
        "The network grew 23%. Passengers grew 1,344%. That's why Tatkal sells out in 8 seconds. Put your story on the record:",
      shareTags: "#TatkalRoulette #WAITLISTED",
      waTag: "WHATSAPP",
      waTitle: "Forward on WhatsApp →",
      waDesc: "The distribution layer of India. One forward = one more person on the record.",
      xTag: "X / TWITTER",
      xTitle: "Post with #TatkalRoulette →",
      xDesc: "Where journalists and the ministry actually watch. Tag rail reporters.",
    },
  },
  submitPage: {
    kicker: "File a grievance",
    title: "Put it on the record.",
    intro:
      "Tell us what happened. Keep it true and specific — the stronger the detail and evidence, " +
      "the harder it is to dismiss. Submissions are reviewed before they go public, and we never " +
      "publish your name or contact details.",
  },
  form: {
    category: "Category",
    headline: "Headline",
    headlinePh: "e.g. Loaded ₹2,000 in eWallet, can't withdraw it",
    story: "What happened",
    storyPh: "Dates, times, what you tried, how it was 'resolved' without being fixed. Be specific.",
    routeOpt: "Route (optional)",
    routePh: "NDLS → BCT",
    trainOpt: "Train no. (optional)",
    trainPh: "12952",
    amountOpt: "Amount involved (optional)",
    amountPh: "₹2,000",
    cityOpt: "City (optional)",
    cityPh: "Pune",
    evidenceUpload: "Upload evidence (optional)",
    evidenceHint:
      "Screenshot, ticket or PNR — JPG, PNG, WebP, GIF or PDF, up to 5 MB. Stored privately and shown only to moderators; never published.",
    evidenceLabel:
      "I have a screenshot / ticket / PNR as evidence and can provide it on request. (Evidence makes your story far harder to dismiss.)",
    truthNote:
      "Keep it true. Don’t name individuals as corrupt without proof — we publish patterns, not accusations. We never publish your identity.",
    fileBtn: "File This Grievance",
    filingBtn: "Filing…",
    loading: "Loading form…",
    okTag: "Received",
    okTitle: "PNR confirmed.",
    okMsg:
      "On the record. Our moderators will review it before it appears on the Wall of Shame. Thank you for speaking up.",
    okSeeWall: "See the Wall →",
    okAddAnother: "Add another",
    errGeneric: "Something went wrong.",
    errNetwork: "Network error. Please try again.",
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
  act: {
    kicker: "03 / टूलकिट",
    title: "इसे आधिकारिक बनाइए।",
    intro:
      "गुस्सा एक दिन ट्रेंड करता है। वह कागज़ी कार्रवाई टिकती है जिसका जवाब देना उनकी कानूनी " +
      "ज़िम्मेदारी है। ये रहे असली, कानूनी रास्ते — हर एक में बस कुछ मिनट लगते हैं।",
    rti: {
      no: "टूल 01 /",
      h: "RTI दायर करें",
      descHtml:
        "सूचना का अधिकार अधिनियम सार्वजनिक जवाब देने पर मजबूर करता है। अगर हज़ारों लोग एक ही " +
        "सवाल पूछें, तो वह डेटा भी बाहर आना पड़ता है जिसे वे छुपाते हैं। ऑनलाइन दायर करें " +
        '<a href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer">rtionline.gov.in</a>' +
        " पर (₹10 शुल्क)। नीचे दिया टेम्पलेट कॉपी करें और कोष्ठक भरें।",
      template: `सेवा में: केंद्रीय जन सूचना अधिकारी (CPIO),
रेल मंत्रालय / IRCTC

विषय: सूचना का अधिकार अधिनियम, 2005 के तहत सूचना हेतु आवेदन

कृपया [प्रारंभ तिथि] से [अंतिम तिथि] की अवधि के लिए निम्नलिखित सूचना दें:

1. प्रत्येक तिथि पर ट्रेन नं. [ट्रेन नं], मार्ग [से]–[तक], श्रेणी [AC/स्लीपर] का
   तत्काल कोटा किस सटीक समय (सेकंड तक) पूर्णतः बुक हुआ।
2. उपरोक्त में से कितनी बुकिंग पंजीकृत एजेंटों द्वारा बनाम व्यक्तिगत
   उपयोगकर्ताओं द्वारा की गईं।
3. पिछले 12 महीनों में स्वचालित/बॉट बुकिंग का पता लगाने और रोकने हेतु
   उठाए गए कदमों का विवरण, और परिणामस्वरूप निलंबित एजेंट IDs की संख्या।
4. उपरोक्त मार्ग पर पिछले 5 वर्षों में स्लीपर (SL) और जनरल (GEN) डिब्बों
   बनाम AC डिब्बों की संख्या में बदलाव।
5. वर्तमान में उपयोगकर्ताओं के IRCTC eWallet बैलेंस में रखी कुल राशि, और
   उपयोगकर्ता द्वारा eWallet राशि बैंक खाते में निकालने की प्रक्रिया व औसत समय।

मैं एक भारतीय नागरिक हूँ। ₹10 का आवेदन शुल्क संलग्न है।

नाम: [आपका नाम]
पता: [आपका पता]
दिनांक: [दिनांक]`,
      openBtn: "RTI ऑनलाइन खोलें →",
    },
    complaint: {
      no: "टूल 02 /",
      h: "आधिकारिक शिकायत दर्ज करें",
      cpgramsTag: "CPGRAMS",
      cpgramsTitle: "केंद्रीय शिकायत पोर्टल →",
      cpgramsDesc:
        "सरकार की अपनी शिकायत प्रणाली। एक ट्रैक की गई, समयबद्ध शिकायत बनाती है जिसका मंत्रालय को जवाब देना होता है।",
      railmadadTag: "RAILMADAD",
      railmadadTitle: "रेलवे शिकायत पोर्टल →",
      railmadadDesc:
        "यात्रा, रिफंड, सफाई और सुरक्षा शिकायतों के लिए। रेफरेंस नंबर संभालें — उस “हल हो गया” का स्क्रीनशॉट लें जिसने कुछ ठीक नहीं किया।",
    },
    mp: {
      no: "टूल 03 /",
      h: "अपने सांसद को लिखें",
      descHtml:
        "आपके सांसद इसे संसद में और रेल मंत्रालय के समक्ष उठा सकते हैं। अपना सांसद यहाँ खोजें " +
        '<a href="https://sansad.in/ls/members" target="_blank" rel="noopener noreferrer">sansad.in</a>। ' +
        "एक छोटा, सटीक पत्र — एक समस्या, एक माँग — सबसे असरदार होता है।",
      letter: `आदरणीय [सांसद का नाम],

मैं [स्थान] का निवासी हूँ। एक नियमित रेल यात्री के रूप में मुझे कन्फर्म
तत्काल टिकट नहीं मिल पाते — सीटें सेकंडों में गायब हो जाती हैं — और
IRCTC eWallet में जमा मेरा पैसा आसानी से नहीं निकाला जा सकता।

जनसंख्या के अनुपात में स्लीपर और जनरल क्षमता नहीं बढ़ी है, जबकि
प्रीमियम सेवाएँ बढ़ रही हैं। मेरा अनुरोध है कि आप संसद में उठाएँ:
बेहतर नॉन-AC क्षमता, बॉट/एजेंट बुकिंग पर कार्रवाई, और स्पष्ट
eWallet निकासी प्रक्रिया।

सादर,
[आपका नाम], [निर्वाचन क्षेत्र]`,
    },
    share: {
      no: "टूल 04 /",
      h: "रसीद शेयर करें",
      descHtml:
        "भारत में पहुँच WhatsApp और X पर चलती है। रिकॉर्ड को आगे भेजें — अब आप जो भी लिंक शेयर " +
        "करते हैं वह एक ब्रांडेड WAITLISTED कार्ड के रूप में खुलता है।",
      shareMsg:
        "रेल नेटवर्क 23% बढ़ा। यात्री 1,344% बढ़े। इसीलिए तत्काल 8 सेकंड में बिक जाता है। अपनी कहानी रिकॉर्ड पर लाइए:",
      shareTags: "#TatkalRoulette #WAITLISTED",
      waTag: "WHATSAPP",
      waTitle: "WhatsApp पर फॉरवर्ड करें →",
      waDesc: "भारत की वितरण परत। एक फॉरवर्ड = एक और व्यक्ति रिकॉर्ड पर।",
      xTag: "X / TWITTER",
      xTitle: "#TatkalRoulette के साथ पोस्ट करें →",
      xDesc: "जहाँ पत्रकार और मंत्रालय वाकई नज़र रखते हैं। रेल रिपोर्टरों को टैग करें।",
    },
  },
  submitPage: {
    kicker: "शिकायत दर्ज करें",
    title: "इसे रिकॉर्ड पर लाइए।",
    intro:
      "बताइए क्या हुआ। इसे सच और सटीक रखें — जितना मज़बूत विवरण और सबूत, उतना ही मुश्किल इसे " +
      "खारिज करना। शिकायतें सार्वजनिक होने से पहले समीक्षा की जाती हैं, और हम आपका नाम या संपर्क " +
      "विवरण कभी प्रकाशित नहीं करते।",
  },
  form: {
    category: "श्रेणी",
    headline: "शीर्षक",
    headlinePh: "जैसे: eWallet में ₹2,000 डाले, निकाल नहीं पा रहा",
    story: "क्या हुआ",
    storyPh: "तारीखें, समय, आपने क्या कोशिश की, बिना ठीक हुए कैसे 'हल' कर दिया गया। सटीक रहें।",
    routeOpt: "मार्ग (वैकल्पिक)",
    routePh: "NDLS → BCT",
    trainOpt: "ट्रेन नं. (वैकल्पिक)",
    trainPh: "12952",
    amountOpt: "शामिल राशि (वैकल्पिक)",
    amountPh: "₹2,000",
    cityOpt: "शहर (वैकल्पिक)",
    cityPh: "पुणे",
    evidenceUpload: "सबूत अपलोड करें (वैकल्पिक)",
    evidenceHint:
      "स्क्रीनशॉट, टिकट या PNR — JPG, PNG, WebP, GIF या PDF, अधिकतम 5 MB। निजी रूप से सहेजा जाता है और केवल मॉडरेटर देखते हैं; कभी प्रकाशित नहीं होता।",
    evidenceLabel:
      "मेरे पास सबूत के तौर पर स्क्रीनशॉट / टिकट / PNR है और माँगे जाने पर दे सकता/सकती हूँ। (सबूत आपकी कहानी को खारिज करना बहुत मुश्किल बना देता है।)",
    truthNote:
      "इसे सच रखें। बिना सबूत किसी व्यक्ति को भ्रष्ट न बताएँ — हम पैटर्न प्रकाशित करते हैं, आरोप नहीं। हम आपकी पहचान कभी प्रकाशित नहीं करते।",
    fileBtn: "यह शिकायत दर्ज करें",
    filingBtn: "दर्ज हो रही है…",
    loading: "फॉर्म लोड हो रहा है…",
    okTag: "प्राप्त हुआ",
    okTitle: "PNR कन्फर्म।",
    okMsg:
      "रिकॉर्ड पर। शर्म की दीवार पर दिखने से पहले हमारे मॉडरेटर इसकी समीक्षा करेंगे। आवाज़ उठाने के लिए धन्यवाद।",
    okSeeWall: "दीवार देखें →",
    okAddAnother: "एक और जोड़ें",
    errGeneric: "कुछ गड़बड़ हो गई।",
    errNetwork: "नेटवर्क त्रुटि। कृपया फिर कोशिश करें।",
  },
};

const DICTS: Record<Locale, Dict> = { en, hi };
