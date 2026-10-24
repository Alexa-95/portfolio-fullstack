import Link from "next/link";
import { ArrowUpRight, Github, Linkedin, Menu } from "lucide-react";
import { profile } from "@/lib/content";

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span>{index}</span>
      <span>{children}</span>
      <span className="label-spark">✳</span>
    </div>
  );
}

// Links use "/#section" so they work from project pages too.
export function SiteHeader() {
  return (
    <header className="site-header container">
      <Link className="wordmark" href="/#top" aria-label="Back to top">
        datenshi<span>.dev</span>
        <i>✳</i>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href="/#work">Work</Link>
        <Link href="/#about">About</Link>
        <Link href="/#toolkit">Toolkit</Link>
        <Link href="/#contact" className="nav-contact">
          Let&apos;s talk <ArrowUpRight size={15} />
        </Link>
      </nav>
      <Link href="/#contact" className="mobile-menu" aria-label="Go to contact">
        <Menu size={23} />
      </Link>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <Link className="wordmark" href="/#top">
          datenshi<span>.dev</span>
          <i>✳</i>
        </Link>
        <span>© {new Date().getFullYear()} — CRAFTED WITH CARE</span>
        <div>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <Github size={19} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={19} />
          </a>
          <a href="#top" aria-label="Back to top">
            ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
