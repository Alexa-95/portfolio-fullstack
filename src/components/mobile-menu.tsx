"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navContact } from "@/lib/styles";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Close on Escape and lock page scroll while the menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="hidden p-1.5 leading-[0] text-wine max-phone:block"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={23} /> : <Menu size={23} />}
      </button>
      <nav
        id="mobile-nav"
        className="absolute inset-x-0 top-full flex flex-col gap-[22px] rounded-[18px] border border-line bg-ivory px-[22px] py-[26px] text-xl font-semibold shadow-[0_18px_40px_rgba(41,34,41,0.08)] phone:hidden"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        <Link href="/#work" className="hover:text-rose" onClick={close}>
          Work
        </Link>
        <Link href="/#about" className="hover:text-rose" onClick={close}>
          About
        </Link>
        <Link href="/#toolkit" className="hover:text-rose" onClick={close}>
          Toolkit
        </Link>
        <Link
          href="/#contact"
          className={`${navContact} self-start`}
          onClick={close}
        >
          Let&apos;s talk <ArrowUpRight size={15} />
        </Link>
      </nav>
    </>
  );
}
