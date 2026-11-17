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

function getTrackTheme(ageGroup: AgeGroup) {
  switch (ageGroup) {
    case "Children":
      return {
        badge: "bg-rose-100 text-rose-700",
        accentBorder: "hover:border-rose-300",
        icon: "🧒",
        button: "bg-rose-600 hover:bg-rose-700 text-white",
      };
    case "Teens":
      return {
        badge: "bg-indigo-100 text-indigo-700",
        accentBorder: "hover:border-indigo-300",
        icon: "🎧",
        button: "bg-[#4F46E5] hover:bg-[#4338CA] text-white",
      };
    case "Adults":
      return {
        badge: "bg-emerald-100 text-emerald-700",
        accentBorder: "hover:border-emerald-300",
        icon: "🎹",
        button: "bg-emerald-600 hover:bg-emerald-700 text-white",
      };
    default:
      return {
        badge: "bg-amber-100 text-amber-800",
        accentBorder: "hover:border-amber-300",
        icon: "✨",
        button: "bg-amber-500 hover:bg-amber-600 text-slate-950",
      };
  }
}

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
    <section id="classes" className="py-16 sm:py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
              Classes for Everyone
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-slate-900">
              Pick your starting track
            </h2>
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#4F46E5] text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-600">
            No classes under this filter yet.{" "}
            <button
              type="button"
              onClick={() => setActiveFilter("All")}
              className="underline text-[#4F46E5] font-semibold cursor-pointer"
            >
              Show all classes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredClasses.map((cls) => {
              const theme = getTrackTheme(cls.ageGroup);
              return (
                <article
                  key={cls.id}
                  className={`rounded-3xl bg-white p-6 sm:p-7 border border-slate-200 ${theme.accentBorder} shadow-xs hover:shadow-lg transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${theme.badge}`}
                        >
                          <span>{theme.icon}</span>
                          <span>{cls.ageGroup}</span>
                        </span>
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                          {cls.level}
                        </span>
                      </div>
                      {cls.featured && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <Sparkles className="w-3.5 h-3.5" />
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
                      {cls.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {cls.summary}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 pb-4 mb-4 border-b border-slate-100">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {cls.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        {cls.format}
                      </span>
                      {cls.priceNote && <span>· {cls.priceNote}</span>}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {cls.highlights.slice(0, 3).map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onSelectClassForBooking(cls)}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${theme.button}`}
                    >
                      <span>Book This Class</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedModalClass(cls)}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Syllabus
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Syllabus Modal */}
      {selectedModalClass && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedModalClass.title}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedModalClass(null)}
        >
          <div
            className="bg-white text-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setSelectedModalClass(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                {selectedModalClass.ageGroup}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                {selectedModalClass.level}
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 pr-8 mb-2">
              {selectedModalClass.title}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {selectedModalClass.summary}
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-slate-600 bg-slate-50 rounded-xl px-4 py-3 mb-5">
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

            <ul className="space-y-2.5 mb-7">
              {selectedModalClass.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
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
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>Book Trial for This Class</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
