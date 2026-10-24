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
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "EMAIL_FROM",
  "EMAIL_TO",
] as const;

type ConfigKey = (typeof REQUIRED_KEYS)[number];

// Cloudflare Email Service binding (send_email).
interface EmailBinding {
  send(message: {
    from: string | { email: string; name?: string };
    to: string;
    subject: string;
    text: string;
    replyTo?: string | { email: string; name?: string };
  }): Promise<{ messageId: string }>;
}

type Contact = {
  name: string;
  email: string;
  message: string;
};

function json(
  body: object,
  status: number,
  headers: Record<string, string> = {},
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

function getConfig() {
  const bindings = env as unknown as Record<ConfigKey, string | undefined> & {
    EMAIL?: EmailBinding;
  };

  const missing: string[] = REQUIRED_KEYS.filter(
    (key) => !bindings[key]?.trim(),
  );

  if (!bindings.EMAIL) {
    missing.push("EMAIL");
  }

  if (missing.length > 0) {
    console.error("Missing contact configuration:", missing.join(", "));
    return null;
  }

  return {
    siteUrl: bindings.SITE_URL!,
    turnstileSecret: bindings.TURNSTILE_SECRET_KEY!,
    turnstileHostname: bindings.TURNSTILE_EXPECTED_HOSTNAME!,
    redisUrl: bindings.UPSTASH_REDIS_REST_URL!,
    redisToken: bindings.UPSTASH_REDIS_REST_TOKEN!,
    email: bindings.EMAIL!,
    emailFrom: bindings.EMAIL_FROM!,
    emailTo: bindings.EMAIL_TO!,
  };
}

type Config = NonNullable<ReturnType<typeof getConfig>>;

async function sendEmail(config: Config, contact: Contact): Promise<void> {
  // User data stays in the body; Reply-To lets a Gmail reply go to the sender.
  const text = [
    "Nowa wiadomość z portfolio",
    "",
    `Imię: ${contact.name}`,
    `E-mail: ${contact.email}`,
    "",
    "Wiadomość:",
    contact.message,
  ].join("\n");

  try {
    await config.email.send({
      from: { email: config.emailFrom, name: "Portfolio" },
      to: config.emailTo,
      subject: "Nowa wiadomość z portfolio",
      text,
      replyTo: { email: contact.email, name: contact.name },
    });
  } catch (error) {
    const err = error as Error & { code?: string };

    console.error("Email delivery failed:", {
      name: err?.name ?? "Unknown",
      code: err?.code ?? "Unknown",
      message: err?.message ?? "Unknown",
    });

    throw new Error("Email delivery failed");
  }
}

export async function POST(request: NextRequest) {
  const config = getConfig();

  if (!config) {
    return json({ error: "Contact form is not configured yet." }, 503);
  }

  // Only requests from the portfolio origin.
  let allowedOrigin: string;

  try {
    allowedOrigin = new URL(config.siteUrl).origin;
  } catch {
    return json({ error: "Invalid site configuration." }, 503);
  }

  if (request.headers.get("origin") !== allowedOrigin) {
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

  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (!Number.isFinite(contentLength) || contentLength > MAX_BYTES) {
    return json({ error: "Request too large." }, 413);
  }

  try {
    // 1. Rate limiting.
    const redis = new Redis({
      url: config.redisUrl,
      token: config.redisToken,
    });

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "15 m"),
      prefix: "portfolio:contact",
    });

    const attempt = await ratelimit.limit(ip);

    if (!attempt.success) {
      return json(
        {
          error: "Too many messages. Please try again later.",
        },
        429,
        {
          "Retry-After": String(
            Math.max(1, Math.ceil((attempt.reset - Date.now()) / 1000)),
          ),
        },
      );
    }

    // 2. Read and validate the body.
    const raw = await request.text();

    if (new TextEncoder().encode(raw).byteLength > MAX_BYTES) {
      return json({ error: "Request too large." }, 413);
    }

    let input: unknown;

    try {
      input = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid JSON." }, 400);
    }

    const validation = contactSchema.safeParse(input);

    if (!validation.success) {
      console.error(
        "Contact validation failed:",
        validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          code: issue.code,
          message: issue.message,
        })),
      );

      return json({ error: "Please check your form fields." }, 400);
    }

    const { name, email, message, company, token } = validation.data;

    // Honeypot filled: pretend success so bots learn nothing.
    if (company.length > 0) {
      console.warn("Contact honeypot triggered");

      return json(
        {
          success: true,
          message: "Your message has been sent. Thank you!",
        },
        200,
      );
    }

    // 3. Verify Turnstile.
    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: config.turnstileSecret,
          response: token,
          remoteip: ip,
        }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      },
    );

    if (!turnstileResponse.ok) {
      throw new Error("Turnstile service unavailable");
    }

    const verification = (await turnstileResponse.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };

    if (
      !verification.success ||
      verification.hostname !== config.turnstileHostname ||
      verification.action !== "contact"
    ) {
      return json(
        {
          error: "Security check failed. Please try again.",
        },
        403,
      );
    }

    // 4. Send via the Cloudflare Email Service binding.
    await sendEmail(config, {
      name,
      email,
      message,
    });

    return json(
      {
        success: true,
        message: "Your message has been sent. Thank you!",
      },
      200,
    );
  } catch (error) {
    console.error("Contact request failed:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown",
    });

    return json(
      {
        error: "Unable to send right now. Please try again later.",
      },
      503,
    );
  }
}
