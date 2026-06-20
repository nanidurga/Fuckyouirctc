// ─────────────────────────────────────────────────────────────────────────────
// In-memory fixed-window rate limiter.
//
// State lives in the function instance's memory. On serverless / Fluid Compute
// this is PER-INSTANCE, not a global cap — it meaningfully raises the cost of
// scripted abuse from a single client, but a determined attacker spread across
// instances can still get through. For a hard global limit, back this with
// Upstash Redis behind the same interface. This mirrors lib/store's in-memory
// fallback: real protection with zero infra in dev, upgradeable for prod.
// ─────────────────────────────────────────────────────────────────────────────

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets (0 when allowed). */
  retryAfter: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded across many IPs.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k);
  }

  const b = buckets.get(key);
  if (!b || now >= b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { ok: true, remaining: limit - b.count, retryAfter: 0 };
}

// Best-effort client IP from common proxy headers (Vercel sets x-forwarded-for).
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
