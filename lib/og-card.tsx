import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// ─────────────────────────────────────────────────────────────────────────────
// OG SHARE CARD — the virality engine.
//
// Renders a 1200×630 "reservation-chart brutalism" card: cream paper, ink type,
// a vermillion rubber-stamp, a perforated ticket edge, dot-matrix meta. Used by
// `app/opengraph-image.tsx` (the global/homepage card) and `app/api/og/route.tsx`
// (dynamic per-grievance share cards).
//
// Brand fonts (Oswald display / DM Mono data) are bundled in `lib/og-fonts/` and
// read from disk — no runtime network fetch, renders identically everywhere. The
// static homepage card reads them at build time; the dynamic /api/og route reads
// them at request time (next.config `outputFileTracingIncludes` bundles them).
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  paper: "#efe7d6",
  paper2: "#e7ddc7",
  ink: "#1a1714",
  inkSoft: "#4a4137",
  inkFaint: "#8a7d68",
  line: "#c9bca0",
  lineStrong: "#a99571",
  stamp: "#b6321f",
  stampDeep: "#8a1f12",
  signal: "#1f6f57",
};

// Cache the font buffers across invocations (module scope survives warm starts).
let fontsPromise: Promise<{ oswald: Buffer; mono: Buffer }> | null = null;
function loadFonts() {
  if (!fontsPromise) {
    const dir = join(process.cwd(), "lib", "og-fonts");
    fontsPromise = Promise.all([
      readFile(join(dir, "Oswald-Bold.ttf")),
      readFile(join(dir, "DMMono-Medium.ttf")),
    ]).then(([oswald, mono]) => ({ oswald, mono }));
  }
  return fontsPromise;
}

export type OgCardOpts = {
  /** Big headline. A grievance title, or the site tagline on the global card. */
  title: string;
  /** Small label above the title (e.g. the category). */
  kicker?: string;
  /** Dot-matrix meta line below the title (e.g. "NDLS → BCT · 12952 · DELHI"). */
  meta?: string;
  /** Rubber-stamp word, top-right. */
  stamp?: string;
};

const SIZE = { width: 1200, height: 630 };

export async function renderOgCard(opts: OgCardOpts): Promise<ImageResponse> {
  const { oswald, mono } = await loadFonts();

  // Keep the headline within ~3 lines so it never overflows the card.
  const title = opts.title.length > 120 ? `${opts.title.slice(0, 117)}…` : opts.title;
  const kicker = (opts.kicker ?? "The citizens' record").toUpperCase();
  const stamp = (opts.stamp ?? "Filed").toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: C.paper,
          color: C.ink,
          fontFamily: "DM Mono",
          position: "relative",
          padding: 56,
        }}
      >
        {/* Inset ink frame */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: `2px solid ${C.ink}`,
          }}
        />

        {/* Faint corner watermark */}
        <div
          style={{
            position: "absolute",
            right: 36,
            bottom: 8,
            fontFamily: "Oswald",
            fontSize: 240,
            color: C.paper2,
            letterSpacing: -4,
            transform: "rotate(-8deg)",
          }}
        >
          WL
        </div>

        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Oswald",
                fontSize: 58,
                lineHeight: 1,
                letterSpacing: 2,
                color: C.ink,
              }}
            >
              WAITLISTED
            </div>
            <div
              style={{
                fontSize: 18,
                marginTop: 10,
                letterSpacing: 1,
                color: C.inkFaint,
              }}
            >
              PNR : WL/RAC · INDIAN RAILWAYS
            </div>
          </div>

          {/* Rubber stamp */}
          <div
            style={{
              display: "flex",
              border: `3px solid ${C.stamp}`,
              color: C.stamp,
              fontFamily: "Oswald",
              fontSize: 30,
              letterSpacing: 3,
              padding: "8px 18px",
              transform: "rotate(-7deg)",
              opacity: 0.92,
            }}
          >
            {stamp}
          </div>
        </div>

        {/* Perforated divider */}
        <div style={{ display: "flex", gap: 8, marginTop: 30, marginBottom: 30, zIndex: 1 }}>
          {Array.from({ length: 70 }).map((_, i) => (
            <div
              key={i}
              style={{ width: 6, height: 6, borderRadius: 6, backgroundColor: C.lineStrong }}
            />
          ))}
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1, zIndex: 1 }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 3,
              color: C.stamp,
            }}
          >
            {kicker}
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Oswald",
              fontSize: 64,
              lineHeight: 1.08,
              color: C.ink,
              marginTop: 16,
              maxWidth: 1020,
            }}
          >
            {title}
          </div>
          {opts.meta ? (
            <div style={{ fontSize: 22, color: C.inkSoft, marginTop: 22, letterSpacing: 1 }}>
              {opts.meta}
            </div>
          ) : null}
        </div>

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: C.inkSoft,
            letterSpacing: 1,
            zIndex: 1,
          }}
        >
          <div style={{ display: "flex" }}>Add your story → waitlisted</div>
          <div style={{ display: "flex", color: C.signal }}>
            Network +23% · Passengers +1,344%
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Oswald", data: oswald, weight: 700, style: "normal" },
        { name: "DM Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
