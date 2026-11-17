"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/lib/types";

interface FaqSectionProps {
  faqs: FaqItem[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-20 sm:py-24 bg-[#F2EAE0]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono-meta uppercase tracking-[0.2em] text-[#A65C38] mb-3">
            Common Questions
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-[#14110F]">
            Before your <em className="italic text-[#A65C38]">first lesson</em>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#FAF6F0] border border-[#C87A53]/20 overflow-hidden"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif-display text-xl sm:text-2xl text-[#14110F]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#A65C38] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm sm:text-base text-[#57473E] leading-relaxed border-t border-[#C87A53]/10 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
