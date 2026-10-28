import { disposableEmailBlocklistSet } from "disposable-email-domains-js";

type Contact = { name: string; email: string; message: string };

const LINK = /https?:\/\/|www\./gi;
const MARKUP = /\[\/?(?:url|link)|<a\s|href\s*=/i;
// Cyrillic, Greek, Arabic, Hebrew, Thai, CJK, Hangul — not used by EN/PL senders.
const NON_LATIN = /[Ͱ-ϿЀ-ӿ֐-ۿ฀-๿぀-ヿ㐀-鿿가-힯]/gu;
const LETTER = /\p{L}/gu;

// ~9k known throwaway-inbox domains, maintained upstream.
const DISPOSABLE_DOMAINS = disposableEmailBlocklistSet();

const KEYWORDS = [
  /\bseo\b/i,
  /\bback ?links?\b/i,
  /\bguest posts?\b/i,
  /\b(?:first|top) page of google\b/i,
  /\b(?:google )?rankings?\b/i,
  /\b(?:website|web|organic) traffic\b/i,
  /\blead generation\b/i,
  /\b(?:casino|gambling|betting)\b/i,
  /\b(?:crypto|bitcoin|forex|nft)\b/i,
  /\b(?:viagra|cialis)\b/i,
  /\b(?:porn|xxx|escort|dating)\b/i,
  /\bloans?\b/i,
  /\binvestment opportunity\b/i,
  /\bmake money\b|\bearn \$/i,
  /\b(?:click here|buy now|limited offer)\b/i,
  /\bunsubscribe\b/i,
  /\b(?:telegram|whatsapp)\b/i,
];

/** Returns why a message looks like spam, or null if it looks fine. */
export function spamReason({ name, email, message }: Contact): string | null {
  if (/https?:\/\/|www\./i.test(name) || name.includes("@") || /\d{3}/.test(name))
    return "name";

  if (MARKUP.test(message)) return "markup";

  const links = message.match(LINK)?.length ?? 0;
  if (links > 1) return "links";

  const letters = (name + message).match(LETTER)?.length ?? 0;
  const foreign = (name + message).match(NON_LATIN)?.length ?? 0;
  if (letters > 0 && foreign / letters > 0.3) return "script";

  if (isDisposable(emailDomain(email))) return "disposable-email";

  // Keywords alone can be legit ("I need good SEO"), so require several.
  const hits = KEYWORDS.filter((keyword) => keyword.test(message)).length;
  if (hits >= 3 || (hits >= 2 && links > 0)) return "keywords";

  return null;
}

export function emailDomain(email: string): string {
  return email.split("@").pop()?.trim().toLowerCase() ?? "";
}

// Also catches subdomains such as abc.mailinator.com.
function isDisposable(domain: string): boolean {
  const parts = domain.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    if (DISPOSABLE_DOMAINS.has(parts.slice(i).join("."))) return true;
  }
  return false;
}

/**
 * Asks DNS whether the domain can receive mail at all. Made-up domains
 * fail here. Returns true when DNS is unreachable, so outages never
 * block real people.
 */
export async function acceptsMail(domain: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      {
        headers: { Accept: "application/dns-json" },
        signal: AbortSignal.timeout(3000),
        cache: "no-store",
      },
    );
    if (!response.ok) return true;

    const result = (await response.json()) as {
      Status: number;
      Answer?: { type: number; data: string }[];
    };

    // 3 = NXDOMAIN: the domain does not exist.
    if (result.Status === 3) return false;
    if (result.Status !== 0) return true;

    // "0 ." is a null MX: the domain explicitly refuses mail.
    const mx = (result.Answer ?? []).filter((record) => record.type === 15);
    return mx.some((record) => !/^0\s+\.$/.test(record.data.trim()));
  } catch {
    return true;
  }
}
