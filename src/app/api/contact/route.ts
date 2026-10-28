import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { contactSchema } from "@/lib/contact";
import { acceptsMail, emailDomain, spamReason } from "@/lib/spam";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 12_000;

// Humans need longer than this to fill the form.
const MIN_FILL_MS = 3_000;

const SENT = {
  success: true,
  message: "Your message has been sent. Thank you!",
};

const REQUIRED_KEYS = [
  "SITE_URL",
  "TURNSTILE_SECRET_KEY",
  "TURNSTILE_EXPECTED_HOSTNAME",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "GMAIL_ADDRESS",
  "GMAIL_TO",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REFRESH_TOKEN",
] as const;

type ConfigKey = (typeof REQUIRED_KEYS)[number];

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
  const bindings = env as unknown as Record<ConfigKey, string | undefined>;

  const missing = REQUIRED_KEYS.filter((key) => !bindings[key]?.trim());

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
    gmailAddress: bindings.GMAIL_ADDRESS!,
    gmailTo: bindings.GMAIL_TO!,
    googleClientId: bindings.GOOGLE_CLIENT_ID!,
    googleClientSecret: bindings.GOOGLE_CLIENT_SECRET!,
    googleRefreshToken: bindings.GOOGLE_REFRESH_TOKEN!,
  };
}

type Config = NonNullable<ReturnType<typeof getConfig>>;

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function toBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

async function sendEmail(config: Config, contact: Contact): Promise<void> {
  // 1. Get a short-lived Google access token.
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      refresh_token: config.googleRefreshToken,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });

  if (!tokenResponse.ok) {
    console.error("Gmail OAuth failed:", {
      status: tokenResponse.status,
    });
    throw new Error("Gmail OAuth failed");
  }

  const token = (await tokenResponse.json()) as {
    access_token?: string;
  };

  if (!token.access_token) {
    throw new Error("Gmail access token missing");
  }

  // 2. Build a UTF-8 MIME email.
  // User data stays in the body, not email headers.
  const text = [
    "Nowa wiadomość z portfolio",
    "",
    `Imię: ${contact.name}`,
    `E-mail: ${contact.email}`,
    "",
    "Wiadomość:",
    contact.message,
  ].join("\n");

  const mime = [
    `From: <${config.gmailAddress}>`,
    `To: <${config.gmailTo}>`,
    "Subject: Nowa wiadomosc z portfolio",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    toBase64(text),
  ].join("\r\n");

  // 3. Send through the Gmail API.
  const sendResponse = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: toBase64Url(mime),
      }),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    },
  );

  if (!sendResponse.ok) {
    console.error("Gmail send failed:", {
      status: sendResponse.status,
    });
    throw new Error("Gmail delivery failed");
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

    const { name, email, message, company, token, elapsed } = validation.data;

    // Bot signals: pretend success so bots learn nothing.
    if (company.length > 0) {
      console.warn("Contact honeypot triggered");
      return json(SENT, 200);
    }

    if (elapsed < MIN_FILL_MS) {
      console.warn("Contact submitted too fast:", { elapsed });
      return json(SENT, 200);
    }

    const spam = spamReason({ name, email, message });

    if (spam) {
      console.warn("Contact spam filter triggered:", { reason: spam });
      return json(SENT, 200);
    }

    if (!(await acceptsMail(emailDomain(email)))) {
      console.warn("Contact email domain has no mail server");
      return json(
        { error: "This email address can't receive mail. Please check it." },
        400,
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

    // 4. Per-sender limit, so rotating IPs can't flood from one address.
    const senderLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2, "1 d"),
      prefix: "portfolio:contact:email",
    });

    const sender = await senderLimit.limit(email.toLowerCase());

    if (!sender.success) {
      console.warn("Contact sender limit reached");
      return json(SENT, 200);
    }

    // 5. Send from this same Cloudflare Worker.
    await sendEmail(config, {
      name,
      email,
      message,
    });

    return json(SENT, 200);
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
