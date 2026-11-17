"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Headphones,
  MapPin,
  MessageCircle,
  Music2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { AgeGroup, ClassItem, StudioProfile } from "@/lib/types";

interface ClassesSectionProps {
  classes: ClassItem[];
  profile: StudioProfile;
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
        badge: "bg-rose-500/15 text-rose-300 border-rose-500/25",
        accentBorder: "hover:border-rose-500/50",
        Icon: Users,
      };
    case "Teens":
      return {
        badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/25",
        accentBorder: "hover:border-indigo-500/50",
        Icon: Headphones,
      };
    case "Adults":
      return {
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
        accentBorder: "hover:border-emerald-500/50",
        Icon: Music2,
      };
    default:
      return {
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
        accentBorder: "hover:border-amber-500/50",
        Icon: Award,
      };
  }
}

export default function ClassesSection({
  classes,
  profile,
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

  const waDigits = profile.whatsappPrimary.replace(/[^\d]/g, "");
  const buildClassWhatsAppUrl = (cls: ClassItem) => {
    const msg = `Hi ${profile.teacherName}, I found you on your website and I'd love to book the "${cls.title}" class (${cls.ageGroup} · ${cls.level} · ${cls.duration})!`;
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="classes" className="py-16 sm:py-24 bg-[#141622] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/[0.08] border border-white/15 text-indigo-300 text-xs font-semibold mb-3">
              Classes for Everyone
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white">
              Choose your learning track
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
                      ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/25"
                      : "bg-[#1D2030] text-zinc-300 border border-white/10 hover:text-white hover:border-white/25"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="bg-[#1D2030] rounded-2xl border border-white/10 p-8 text-center text-zinc-300">
            No classes under this filter yet.{" "}
            <button
              type="button"
              onClick={() => setActiveFilter("All")}
              className="underline text-indigo-400 font-semibold cursor-pointer"
            >
              Show all classes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredClasses.map((cls) => {
              const theme = getTrackTheme(cls.ageGroup);
              const TrackIcon = theme.Icon;
              return (
                <article
                  key={cls.id}
                  className={`rounded-3xl bg-[#1B1E2B] p-6 sm:p-7 border border-white/12 ${theme.accentBorder} shadow-lg transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${theme.badge}`}
                        >
                          <TrackIcon className="w-3.5 h-3.5" />
                          <span>{cls.ageGroup}</span>
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/[0.06] text-zinc-300 text-xs font-medium">
                          {cls.level}
                        </span>
                      </div>
                      {cls.featured && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300">
                          <Sparkles className="w-3.5 h-3.5" />
                          Popular
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-2xl text-white mb-2">
                      {cls.title}
                    </h3>

                    <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                      {cls.summary}
                    </p>

                    <div className="flex flex-wrap gap-3 text-xs text-zinc-400 pb-4 mb-4 border-b border-white/10">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        {cls.duration}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                        {cls.format}
                      </span>
                      {cls.priceNote && <span>· {cls.priceNote}</span>}
                    </div>

                    <ul className="space-y-2 mb-6">
                      {cls.highlights.slice(0, 3).map((point, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-zinc-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <a
                      href={buildClassWhatsAppUrl(cls)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Book This Class</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedModalClass(cls)}
                      className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-xs font-semibold border border-white/15 text-zinc-300 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedModalClass(null)}
        >
          <div
            className="bg-[#111116] text-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-white/15 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close modal"
              onClick={() => setSelectedModalClass(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-zinc-200 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                {selectedModalClass.ageGroup}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-zinc-300 text-xs font-medium">
                {selectedModalClass.level}
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white pr-8 mb-2">
              {selectedModalClass.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-5">
              {selectedModalClass.summary}
            </p>

            <div className="flex flex-wrap gap-3 text-xs text-zinc-300 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 mb-5">
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
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={buildClassWhatsAppUrl(selectedModalClass)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setSelectedModalClass(null)}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Book This Class on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
