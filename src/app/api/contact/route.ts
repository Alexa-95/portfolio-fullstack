import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { contactSchema } from "@/lib/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 12_000;

const REQUIRED_KEYS = [
  "SITE_URL",
  "TURNSTILE_SECRET_KEY",
  "TURNSTILE_EXPECTED_HOSTNAME",
  "CONTACT_WORKER_URL",
  "CONTACT_WORKER_SECRET",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
] as const;

type ConfigKey = (typeof REQUIRED_KEYS)[number];

type WorkerEnv = Record<ConfigKey, string | undefined>;

function json(
  body: object,
  status: number,
  extra: Record<string, string> = {},
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}

function getConfig() {
  const bindings = env as unknown as WorkerEnv;

  const missingKeys = REQUIRED_KEYS.filter((key) => !bindings[key]?.trim());

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
    redisUrl: bindings.UPSTASH_REDIS_REST_URL!,
    redisToken: bindings.UPSTASH_REDIS_REST_TOKEN!,
  };
}

async function readJson(request: NextRequest) {
  const contentLength = request.headers.get("content-length");

  if (contentLength !== null && Number(contentLength) > MAX_BYTES) {
    return { error: "Request too large.", status: 413 } as const;
  }

  const raw = await request.text();

  if (new TextEncoder().encode(raw).byteLength > MAX_BYTES) {
    return { error: "Request too large.", status: 413 } as const;
  }

  try {
    return { data: JSON.parse(raw) as unknown } as const;
  } catch {
    return { error: "Invalid JSON.", status: 400 } as const;
  }
}

export async function POST(request: NextRequest) {
  const config = getConfig();

  if (!config) {
    return json({ error: "Contact form is not configured yet." }, 503);
  }

  let workerUrl: URL;
  let allowedOrigin: string;

  try {
    workerUrl = new URL(config.workerUrl);
    allowedOrigin = new URL(config.siteUrl).origin;
  } catch {
    return json({ error: "Contact service is unavailable." }, 503);
  }

  const isLocalWorker =
    process.env.NODE_ENV !== "production" &&
    workerUrl.origin === "http://localhost:8787";

  if (workerUrl.protocol !== "https:" && !isLocalWorker) {
    return json({ error: "Contact service is unavailable." }, 503);
  }

  const origin = request.headers.get("origin");

  if (origin !== allowedOrigin) {
    return json({ error: "Request origin is not allowed." }, 403);
  }

  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().startsWith("application/json")) {
    return json({ error: "Expected JSON." }, 415);
  }

  const ip = request.headers.get("cf-connecting-ip");

  if (!ip || ip.length > 128) {
    return json({ error: "Request cannot be verified." }, 403);
  }

  try {
    const redis = new Redis({
      url: config.redisUrl,
      token: config.redisToken,
    });

    const rateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "15 m"),
      prefix: "portfolio:contact",
    });

    const attempt = await rateLimit.limit(ip);

    if (!attempt.success) {
      const retryAfter = Math.max(
        1,
        Math.ceil((attempt.reset - Date.now()) / 1000),
      );

      return json(
        {
          error: "Too many messages. Please try again later.",
        },
        429,
        {
          "Retry-After": String(retryAfter),
        },
      );
    }

    const parsed = await readJson(request);

    if ("error" in parsed) {
      return json({ error: parsed.error }, parsed.status);
    }

    const result = contactSchema.safeParse(parsed.data);

    if (!result.success) {
      return json({ error: "Please check your form fields." }, 400);
    }

    const { name, email, message, token } = result.data;

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: config.secret,
          response: token,
          remoteip: ip,
        }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      },
    );

    if (!turnstileResponse.ok) {
      throw new Error("Turnstile provider unavailable");
    }

    const verification = (await turnstileResponse.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
      "error-codes"?: string[];
    };

    if (
      !verification.success ||
      verification.hostname !== config.hostname ||
      verification.action !== "contact"
    ) {
      console.warn("Turnstile verification failed", {
        codes: verification["error-codes"] ?? [],
      });

      return json(
        {
          error: "Security check failed. Please try again.",
        },
        403,
      );
    }

    const workerResponse = await fetch(workerUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.workerSecret}`,
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
    });

    if (!workerResponse.ok) {
      console.error("Email worker request failed", {
        status: workerResponse.status,
      });

      throw new Error("Email worker returned an error");
    }

    return json(
      {
        success: true,
        message: "Your message has been sent. Thank you!",
      },
      200,
    );
  } catch (error) {
    console.error(
      "Contact request failed:",
      error instanceof Error ? error.name : "Unknown",
    );

    return json(
      {
        error: "Unable to send right now. Please try again later.",
      },
      503,
    );
  }
}
