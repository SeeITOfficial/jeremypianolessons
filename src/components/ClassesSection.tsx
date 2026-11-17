"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import type { AgeGroup, ClassItem } from "@/lib/types";

interface ClassesSectionProps {
  classes: ClassItem[];
  onSelectClassForBooking: (classItem: ClassItem) => void;
}

const AGE_FILTERS: Array<"All" | AgeGroup> = [
  "All",
  "Children",
  "Teens",
  "Adults",
  "All Ages",
];

export default function ClassesSection({
  classes,
  onSelectClassForBooking,
}: ClassesSectionProps) {
  const publishedClasses = useMemo(
    () => classes.filter((c) => c.published),
    [classes]
  );

  const [activeFilter, setActiveFilter] = useState<"All" | AgeGroup>("All");
  const [selectedModalClass, setSelectedModalClass] =
    useState<ClassItem | null>(null);

  const filteredClasses = useMemo(() => {
    if (activeFilter === "All") return publishedClasses;
    return publishedClasses.filter((c) => c.ageGroup === activeFilter);
  }, [publishedClasses, activeFilter]);

  return (
    <section id="classes" className="py-20 sm:py-28 bg-[#F2EAE0]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header + Interactive Track Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-mono-meta uppercase tracking-[0.2em] text-[#A65C38] mb-3">
              Classes & Programs
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-[#14110F] leading-[1.08]">
              Find the right class for{" "}
              <em className="italic text-[#A65C38]">your stage</em>
            </h2>
            <p className="text-base text-[#6E5A4F] mt-3">
              Filter by age group or click any track to inspect the full
              syllabus and book directly.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter classes by age group"
            className="flex flex-wrap gap-2"
          >
            {AGE_FILTERS.map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all cursor-pointer ${
                    active
                      ? "bg-[#14110F] text-[#FAF6F0] shadow-sm"
                      : "bg-[#FAF6F0] text-[#57473E] border border-[#C87A53]/25 hover:border-[#C87A53]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="bg-[#FAF6F0] rounded-2xl border border-[#C87A53]/20 p-10 text-center text-[#6E5A4F]">
            No published classes match this filter yet. Try selecting{" "}
            <button
              type="button"
              onClick={() => setActiveFilter("All")}
              className="underline text-[#A65C38] font-medium cursor-pointer"
            >
              All
            </button>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredClasses.map((cls) => (
              <article
                key={cls.id}
                className={`group relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 border ${
                  cls.featured
                    ? "bg-[#14110F] text-[#FAF6F0] border-[#C87A53]/50 shadow-xl"
                    : "bg-[#FAF6F0] text-[#14110F] border-[#C87A53]/20 hover:border-[#C87A53]/60 hover:shadow-lg"
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-mono-meta uppercase tracking-[0.12em] ${
                          cls.featured
                            ? "bg-[#C87A53]/20 text-[#E5A989]"
                            : "bg-[#F2EAE0] text-[#A65C38]"
                        }`}
                      >
                        {cls.ageGroup}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-mono-meta uppercase tracking-[0.12em] ${
                          cls.featured
                            ? "bg-white/10 text-white/80"
                            : "bg-[#14110F]/5 text-[#57473E]"
                        }`}
                      >
                        {cls.level}
                      </span>
                    </div>
                    {cls.featured && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono-meta uppercase tracking-[0.12em] text-[#E5A989]">
                        <Sparkles className="w-3.5 h-3.5" />
                        Popular Track
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif-display text-2xl sm:text-3xl leading-tight mb-3">
                    {cls.title}
                  </h3>

                  <p
                    className={`text-sm sm:text-base leading-relaxed mb-6 ${
                      cls.featured ? "text-[#FAF6F0]/75" : "text-[#6E5A4F]"
                    }`}
                  >
                    {cls.summary}
                  </p>

                  <div
                    className={`flex flex-wrap gap-4 text-xs font-mono-meta pb-5 mb-5 border-b ${
                      cls.featured
                        ? "text-[#FAF6F0]/70 border-white/10"
                        : "text-[#6E5A4F] border-[#C87A53]/15"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C87A53]" />
                      {cls.duration}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C87A53]" />
                      {cls.format}
                    </span>
                    {cls.priceNote && <span>· {cls.priceNote}</span>}
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {cls.highlights.map((point, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2.5 text-sm ${
                          cls.featured ? "text-[#FAF6F0]/85" : "text-[#43352D]"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C87A53] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectClassForBooking(cls)}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                      cls.featured
                        ? "bg-[#C87A53] hover:bg-[#B56542] text-white"
                        : "bg-[#14110F] hover:bg-[#2A221D] text-[#FAF6F0]"
                    }`}
                  >
                    <span>Book This Class</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedModalClass(cls)}
                    className={`inline-flex items-center justify-center px-4 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.12em] border transition-colors cursor-pointer ${
                      cls.featured
                        ? "border-white/20 text-[#FAF6F0] hover:border-[#C87A53]"
                        : "border-[#C87A53]/35 text-[#14110F] hover:bg-[#F2EAE0]"
                    }`}
                  >
                    Syllabus Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Syllabus Detail Modal */}
      {selectedModalClass && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedModalClass.title}
          className="fixed inset-0 z-50 bg-[#14110F]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedModalClass(null)}
        >
          <div
            className="bg-[#FAF6F0] text-[#14110F] rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-[#C87A53]/25 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setSelectedModalClass(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-[#F2EAE0] text-[#14110F] hover:bg-[#C87A53] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[#F2EAE0] text-[#A65C38] text-[11px] font-mono-meta uppercase tracking-[0.12em]">
                {selectedModalClass.ageGroup}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#14110F]/5 text-[#57473E] text-[11px] font-mono-meta uppercase tracking-[0.12em]">
                {selectedModalClass.level}
              </span>
            </div>

            <h3 className="font-serif-display text-3xl text-[#14110F] pr-8 mb-3">
              {selectedModalClass.title}
            </h3>
            <p className="text-sm sm:text-base text-[#57473E] leading-relaxed mb-5">
              {selectedModalClass.summary}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-mono-meta text-[#6E5A4F] bg-[#F2EAE0] rounded-xl px-4 py-3 mb-6">
              <span>{selectedModalClass.duration}</span>
              <span>·</span>
              <span>{selectedModalClass.format}</span>
              {selectedModalClass.priceNote && (
                <>
                  <span>·</span>
                  <span>{selectedModalClass.priceNote}</span>
                </>
              )}
            </div>

            <h4 className="text-xs font-mono-meta uppercase tracking-[0.16em] text-[#A65C38] mb-3">
              What You Will Cover
            </h4>
            <ul className="space-y-3 mb-7">
              {selectedModalClass.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[#1B1613]">
                  <CheckCircle2 className="w-4 h-4 text-[#C87A53] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => {
                const target = selectedModalClass;
                setSelectedModalClass(null);
                onSelectClassForBooking(target);
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#14110F] hover:bg-[#C87A53] text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer"
            >
              <span>Request Trial for This Class</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
