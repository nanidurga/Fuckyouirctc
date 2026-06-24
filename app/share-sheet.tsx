"use client";

import { useState } from "react";

// One-tap sharing. Three destinations:
//   1. Story  — fetches the vertical 1080×1920 PNG and opens the phone's native
//      share sheet (Web Share API w/ files) so the user can post it straight to
//      an Instagram / WhatsApp story. No share sheet (desktop) → download.
//   2. WhatsApp — text + link (the link unfurls the landscape OG card).
//   3. X / Twitter — text + tags + link.
// All inputs are prebuilt server-side from public/approved fields only.

export type ShareLabels = {
  storyTag: string;
  storyTitle: string;
  storyDesc: string;
  storyBusy: string;
  storyDone: string;
  storyErr: string;
  waTag: string;
  waTitle: string;
  waDesc: string;
  xTag: string;
  xTitle: string;
  xDesc: string;
};

export default function ShareSheet({
  storyImg,
  shareText,
  waHref,
  xHref,
  labels,
}: {
  /** URL of the vertical story PNG (e.g. /api/og/story?title=…). */
  storyImg: string;
  /** Caption suggested in the native share sheet. */
  shareText: string;
  waHref: string;
  xHref: string;
  labels: ShareLabels;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "err">("idle");

  async function postToStory() {
    setState("busy");
    try {
      const res = await fetch(storyImg);
      if (!res.ok) throw new Error(`og story ${res.status}`);
      const blob = await res.blob();
      const file = new File([blob], "waitlisted-story.png", { type: "image/png" });

      // Web Share API Level 2 — opens the native sheet → Instagram/WhatsApp story.
      // Probe the EXACT payload we'll send: some Android targets accept files but
      // reject a `text` field alongside them, so fall back to a files-only share
      // before giving up on the native sheet entirely.
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };
      const withText: ShareData = { files: [file], text: shareText };
      const filesOnly: ShareData = { files: [file] };
      const shareData = nav.canShare?.(withText)
        ? withText
        : nav.canShare?.(filesOnly)
          ? filesOnly
          : null;
      if (shareData) {
        await nav.share(shareData);
        setState("idle");
        return;
      }

      // No file-share support (most desktops) → download the image instead.
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "waitlisted-story.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Defer the revoke so the download has committed before the URL is freed.
      setTimeout(() => URL.revokeObjectURL(url), 0);
      setState("done");
    } catch (err) {
      // User dismissing the share sheet throws AbortError — that's not a failure.
      if (err instanceof DOMException && err.name === "AbortError") {
        setState("idle");
        return;
      }
      setState("err");
    }
  }

  const storyNote =
    state === "busy"
      ? labels.storyBusy
      : state === "done"
        ? labels.storyDone
        : state === "err"
          ? labels.storyErr
          : labels.storyDesc;

  return (
    <div className="actions">
      <button
        type="button"
        className="action"
        onClick={postToStory}
        disabled={state === "busy"}
        style={{
          textAlign: "left",
          cursor: state === "busy" ? "progress" : "pointer",
          font: "inherit",
        }}
      >
        <div className="n">{labels.storyTag}</div>
        <h3>{labels.storyTitle}</h3>
        <p>{storyNote}</p>
      </button>

      <a className="action" href={waHref} target="_blank" rel="noopener noreferrer">
        <div className="n">{labels.waTag}</div>
        <h3>{labels.waTitle}</h3>
        <p>{labels.waDesc}</p>
      </a>

      <a className="action" href={xHref} target="_blank" rel="noopener noreferrer">
        <div className="n">{labels.xTag}</div>
        <h3>{labels.xTitle}</h3>
        <p>{labels.xDesc}</p>
      </a>
    </div>
  );
}
