import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { contactSchema } from "@/lib/contact";
import { env } from "cloudflare:workers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const maxBytes = 12_000;

function json(
  body: object,
  status: number,
  extra: Record<string, string> = {},
) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...extra },
  });
}

function getConfig() {
  const keys = [
    "SITE_URL",
    "TURNSTILE_SECRET_KEY",
    "TURNSTILE_EXPECTED_HOSTNAME",
    "CONTACT_WORKER_URL",
    "CONTACT_WORKER_SECRET",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
  ] as const;

  type ConfigKey = (typeof keys)[number];

  const bindings = env as unknown as Record<ConfigKey, string | undefined>;

  console.log("Cloudflare environment diagnostics:", {
    keys: Object.keys(env).filter((key) =>
      [
        "SITE_URL",
        "TURNSTILE_SECRET_KEY",
        "TURNSTILE_EXPECTED_HOSTNAME",
        "CONTACT_WORKER_URL",
        "CONTACT_WORKER_SECRET",
        "UPSTASH_REDIS_REST_URL",
        "UPSTASH_REDIS_REST_TOKEN",
      ].includes(key),
    ),
    hasSiteUrl: typeof env.SITE_URL === "string",
  });

  const missingKeys = keys.filter((key) => !bindings[key]);

  if (missingKeys.length > 0) {
    console.error("Missing contact configuration:", missingKeys.join(", "));

    return null;
  }

  return {
    siteUrl: bindings.SITE_URL!,
    secret: bindings.TURNSTILE_SECRET_KEY!,
    hostname: bindings.TURNSTILE_EXPECTED_HOSTNAME!,
    workerUrl: bindings.CONTACT_WORKER_URL!,
    workerSecret: bindings.CONTACT_WORKER_SECRET!,
    url: bindings.UPSTASH_REDIS_REST_URL!,
    redisToken: bindings.UPSTASH_REDIS_REST_TOKEN!,
  };
}

export async function POST(request: NextRequest) {
  const config = getConfig();
  if (!config)
    return json({ error: "Contact form is not configured yet." }, 503);
  let workerUrl: URL;
  try {
    workerUrl = new URL(config.workerUrl);
  } catch {
    return json({ error: "Contact service is unavailable." }, 503);
  }
  if (
    workerUrl.protocol !== "https:" &&
    !(
      process.env.NODE_ENV !== "production" &&
      workerUrl.origin === "http://localhost:8787"
    )
  )
    return json({ error: "Contact service is unavailable." }, 503);
  let allowedOrigin: string;
  try {
    allowedOrigin = new URL(config.siteUrl).origin;
  } catch {
    return json({ error: "Contact service is unavailable." }, 503);
  }
  if (request.headers.get("origin") !== allowedOrigin)
    return json({ error: "Request origin is not allowed." }, 403);
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json"))
    return json({ error: "Expected JSON." }, 415);
  const size = Number(request.headers.get("content-length"));
  if (Number.isFinite(size) && size > maxBytes)
    return json({ error: "Request too large." }, 413);
  const ip = request.headers.get("cf-connecting-ip");

  if (!ip || ip.length > 128) {
    return json({ error: "Request cannot be verified." }, 403);
  }
  // On Vercel, x-real-ip and x-forwarded-for are assigned by the trusted platform proxy.
  // If you self-host, configure your proxy to overwrite these headers (never append client values).
  if (!ip || ip.length > 128)
    return json({ error: "Request cannot be verified." }, 403);
  try {
    const redis = new Redis({ url: config.url, token: config.redisToken });
    const limit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "15 m"),
      prefix: "portfolio:contact",
    });
    const attempt = await limit.limit(ip);
    if (!attempt.success)
      return json(
        { error: "Too many messages. Please try again later." },
        429,
        {
          "Retry-After": String(
            Math.max(1, Math.ceil((attempt.reset - Date.now()) / 1000)),
          ),
        },
      );
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > maxBytes) {
      return json({ error: "Request too large." }, 413);
    }
    let input: unknown;
    try {
      input = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid JSON." }, 400);
    }
    const result = contactSchema.safeParse(input);
    if (!result.success)
      return json({ error: "Please check your form fields." }, 400);
    const { name, email, message, token } = result.data;
    const turnstile = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: config.secret, response: token }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      },
    );
    if (!turnstile.ok) throw new Error("Challenge provider unavailable");
    const verification: unknown = await turnstile.json();
    const response = verification as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };
    if (
      !response.success ||
      response.hostname !== config.hostname ||
      response.action !== "contact"
    )
      return json({ error: "Security check failed. Please try again." }, 403);
    const workerResponse = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.workerSecret}`,
      },
      body: JSON.stringify({ name, email, message }),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });
    if (!workerResponse.ok) throw new Error("Email worker returned an error");
    return json(
      { success: true, message: "Your message has been sent. Thank you!" },
      200,
    );
  } catch (error) {
    console.error(
      "Contact request failed:",
      error instanceof Error ? error.name : "Unknown",
    );
    return json(
      { error: "Unable to send right now. Please try again later." },
      503,
    );
  }
}
