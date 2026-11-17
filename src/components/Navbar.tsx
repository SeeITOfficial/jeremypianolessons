"use client";

import { useEffect, useState } from "react";
import { Menu, Music, X } from "lucide-react";
import type { StudioProfile } from "@/lib/types";

interface NavbarProps {
  profile: StudioProfile;
}

const NAV_ITEMS = [
  { label: "Classes", href: "#classes" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "About", href: "#about" },
  { label: "Videos", href: "#videos" },
  { label: "Guides", href: "#guides" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar({ profile }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nameParts = profile.brandName.trim().split(/\s+/);
  const firstWord = nameParts[0] || "Jeremy";
  const restWords = nameParts.slice(1).join(" ") || "Piano";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF6F0]/92 backdrop-blur-md border-b border-[#C87A53]/20 shadow-sm"
          : "bg-[#14110F]/65 backdrop-blur-md border-b border-white/10"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-6">
        <a
          href="#home"
          className="flex items-center gap-2.5 group shrink-0"
          onClick={() => setOpen(false)}
        >
          <span
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              scrolled
                ? "bg-[#14110F] text-[#FAF6F0]"
                : "bg-[#C87A53] text-white"
            }`}
          >
            <Music className="w-4 h-4" />
          </span>
          <span
            className={`font-serif-display text-2xl tracking-tight transition-colors ${
              scrolled ? "text-[#14110F]" : "text-[#FAF6F0]"
            }`}
          >
            {firstWord}{" "}
            <em className="italic text-[#C87A53]">{restWords}</em>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`text-xs font-medium uppercase tracking-[0.14em] transition-colors hover:text-[#C87A53] ${
                  scrolled ? "text-[#57473E]" : "text-[#FAF6F0]/80"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#booking"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#C87A53] hover:bg-[#A65C38] text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors shadow-sm"
          >
            Book Trial Lesson
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            scrolled
              ? "text-[#14110F] hover:bg-[#14110F]/5"
              : "text-[#FAF6F0] hover:bg-white/10"
          }`}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-[#FAF6F0] border-b border-[#C87A53]/20 px-6 py-6 shadow-xl">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#1B1613] border-b border-[#C87A53]/15 hover:text-[#C87A53]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center px-5 py-3.5 rounded-full bg-[#14110F] text-[#FAF6F0] text-xs font-semibold uppercase tracking-[0.14em]"
            >
              Book Trial Lesson
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
