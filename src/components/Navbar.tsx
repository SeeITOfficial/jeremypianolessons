"use client";

import { useEffect, useState } from "react";
import { Menu, Music, Sparkles, X } from "lucide-react";
import type { StudioProfile } from "@/lib/types";

interface NavbarProps {
  profile: StudioProfile;
}

const NAV_ITEMS = [
  { label: "Classes", href: "#classes" },
  { label: "Sound Lab", href: "#curriculum" },
  { label: "About", href: "#about" },
  { label: "Videos", href: "#videos" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar({ profile }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
          : "bg-white/75 backdrop-blur-md border-b border-slate-200/40"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-6">
        <a
          href="#home"
          className="flex items-center gap-2.5 group shrink-0"
          onClick={() => setOpen(false)}
        >
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#6366F1] text-white flex items-center justify-center shadow-sm shadow-indigo-500/25">
            <Music className="w-4 h-4" />
          </span>
          <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-slate-900">
            {firstWord}{" "}
            <span className="text-[#4F46E5]">{restWords}</span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-[#4F46E5] transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#booking"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold transition-all shadow-sm shadow-indigo-500/25"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Book Trial</span>
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-xl">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-slate-800 border-b border-slate-100 hover:text-[#4F46E5]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#4F46E5] text-white text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book a Trial Lesson</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
