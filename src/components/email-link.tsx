"use client";
import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";

const subscribe = () => () => {};

// The address is joined only in the browser, so it never appears in the
// server HTML that spam harvesters scrape.
export function EmailLink({
  user,
  domain,
  className,
}: {
  user: string;
  domain: string;
  className?: string;
}) {
  const inBrowser = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const email = inBrowser ? `${user}@${domain}` : "";
  return (
    <a className={className} href={email ? `mailto:${email}` : undefined}>
      {email || `${user} [at] ${domain}`} <ArrowUpRight size={18} />
    </a>
  );
}
