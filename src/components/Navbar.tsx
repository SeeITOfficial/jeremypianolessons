"use client";

import { useEffect, useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
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
          ? "bg-[#09090B]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30"
          : "bg-[#09090B]/60 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-6">
        <a
          href="#home"
          className="flex items-center gap-3 group shrink-0"
          onClick={() => setOpen(false)}
        >
          <img
            src="/logo.png"
            alt={`${profile.brandName} emblem`}
            className="w-10 h-10 rounded-full object-contain drop-shadow-md transition-transform group-hover:scale-105"
          />
          <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white">
            {firstWord}{" "}
            <span className="text-indigo-400">{restWords}</span>
          </span>
        </a>

        <ul className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#booking"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-500/25"
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
          className="lg:hidden p-2 rounded-xl text-zinc-200 hover:bg-white/10 transition-colors"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-[#111116] border-b border-white/10 px-6 py-5 shadow-2xl">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-zinc-200 border-b border-white/10 hover:text-indigo-400"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-indigo-500 text-white text-sm font-semibold"
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
