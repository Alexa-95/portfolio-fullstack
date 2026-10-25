import Link from "next/link";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { profile } from "@/lib/content";
import { container, mono, navContact } from "@/lib/styles";
import { MobileMenu } from "./mobile-menu";

export function SectionLabel({
  index,
  children,
  inverted = false,
}: {
  index: string;
  children: React.ReactNode;
  // Light-on-wine variant used in the contact section.
  inverted?: boolean;
}) {
  return (
    <div
      className={`${mono} flex items-center gap-[13px] text-2xs font-medium ${inverted ? "text-petal-bright" : "text-mauve"}`}
    >
      <span className={inverted ? "" : "text-rose"}>{index}</span>
      <span>{children}</span>
      <span className="ml-[3px] text-lg">✳</span>
    </div>
  );
}

// Numbered row used for the approach list and project highlights.
export function ListRow({
  n,
  title,
  text,
  icon,
}: {
  n: string;
  title: string;
  text: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-[26px] border-b border-line py-7">
      <span className="pt-[7px] font-mono text-sm text-rose">{n}</span>
      <div className="flex-1">
        <h3 className="font-display text-row text-plum-light">{title}</h3>
        <p className="mt-[7px] text-sm leading-[1.7] text-muted">{text}</p>
      </div>
      {icon && <span className="mt-2 text-wine">{icon}</span>}
    </div>
  );
}

function Wordmark({ className, label }: { className: string; label?: string }) {
  return (
    <Link
      className={`text-5xl font-bold tracking-[-0.075em] ${className}`}
      href="/#top"
      aria-label={label}
    >
      datenshi<span className="font-normal">.dev</span>
      <i className="ml-[7px] align-top text-2xl not-italic text-rose">✳</i>
    </Link>
  );
}

// Links use "/#section" so they work from project pages too.
export function SiteHeader() {
  return (
    <header
      className={`${container} relative z-5 flex h-[98px] items-center justify-between max-phone:h-[75px]`}
    >
      <Wordmark className="text-wine" label="Back to top" />
      <nav
        className="flex items-center gap-[39px] text-md font-semibold max-phone:hidden"
        aria-label="Main navigation"
      >
        <Link href="/#work" className="hover:text-rose">
          Work
        </Link>
        <Link href="/#about" className="hover:text-rose">
          About
        </Link>
        <Link href="/#toolkit" className="hover:text-rose">
          Toolkit
        </Link>
        <Link href="/#contact" className={navContact}>
          Let&apos;s talk <ArrowUpRight size={15} />
        </Link>
      </nav>
      <MobileMenu />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-wine-deep py-[30px] text-petal">
      <div
        className={`${container} flex items-center justify-between gap-5 max-phone:flex-wrap`}
      >
        <Wordmark className="text-cream" />
        <span className="font-mono text-3xs tracking-[0.08em] max-phone:order-3 max-phone:mt-[15px] max-phone:w-full max-phone:text-center">
          © {new Date().getFullYear()} — CRAFTED WITH CARE
        </span>
        <div className="flex items-center gap-[25px]">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-white"
          >
            <Github size={19} />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-white"
          >
            <Linkedin size={19} />
          </a>
          <a
            href="#top"
            aria-label="Back to top"
            className="text-7xl hover:text-white"
          >
            ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
