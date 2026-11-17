import { Heart, Music, Sparkles, Users } from "lucide-react";
import type { StudioProfile } from "@/lib/types";

interface AboutSectionProps {
  profile: StudioProfile;
}

const PILLAR_ICONS = [Heart, Music, Sparkles, Users];
const PILLAR_COLORS = [
  "bg-rose-50 text-rose-600",
  "bg-indigo-50 text-indigo-600",
  "bg-amber-50 text-amber-600",
  "bg-emerald-50 text-emerald-600",
];

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Concise welcome + visual pillar chips */}
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              Meet Your Teacher
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-slate-900 leading-tight">
              {profile.aboutHeadline}
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {profile.aboutParagraph1}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {profile.pillars.map((pillar, idx) => {
                const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];
                const color = PILLAR_COLORS[idx % PILLAR_COLORS.length];
                return (
                  <div
                    key={pillar.title}
                    className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 flex items-start gap-3.5 hover:border-indigo-200 transition-colors"
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5 leading-snug">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Photo + Warm Quote */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 aspect-[4/3] shadow-lg">
              <img
                src={
                  profile.aboutImageUrl ||
                  "https://images.unsplash.com/photo-1552422535-c45813c61732?w=900&q=85"
                }
                alt={`${profile.teacherName} teaching piano in ${profile.location}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white p-5 sm:p-6 shadow-md">
              <p className="font-display font-semibold text-lg sm:text-xl leading-snug">
                “{profile.aboutQuote}”
              </p>
              <div className="mt-2 text-xs text-indigo-100 font-medium">
                — {profile.teacherName} · {profile.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
