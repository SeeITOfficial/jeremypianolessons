import { Heart, Music, Sparkles, Users } from "lucide-react";
import type { StudioProfile } from "@/lib/types";

interface AboutSectionProps {
  profile: StudioProfile;
}

const PILLAR_ICONS = [Heart, Music, Sparkles, Users];
const PILLAR_STYLES = [
  "bg-rose-50 text-rose-600 border-rose-200/80",
  "bg-indigo-50 text-indigo-600 border-indigo-200/80",
  "bg-amber-50 text-amber-600 border-amber-200/80",
  "bg-emerald-50 text-emerald-600 border-emerald-200/80",
];

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-16 sm:py-24 bg-[#F5F7FB] text-slate-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Welcome + Pillars */}
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
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
                const style = PILLAR_STYLES[idx % PILLAR_STYLES.length];
                return (
                  <div
                    key={pillar.title}
                    className="rounded-2xl bg-white border border-slate-200/80 p-4 flex items-start gap-3.5 shadow-xs hover:border-indigo-300 transition-colors"
                  >
                    <span
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${style}`}
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

          {/* Right: Photo + Quote */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl overflow-hidden border border-slate-200 bg-white aspect-[4/3] shadow-lg">
              <img
                src={
                  profile.aboutImageUrl ||
                  "https://images.unsplash.com/photo-1552422535-c45813c61732?w=900&q=85"
                }
                alt={`${profile.teacherName} teaching piano in ${profile.location}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="rounded-2xl bg-[#11131C] border border-slate-800 text-white p-5 sm:p-6 shadow-md">
              <p className="font-display font-semibold text-lg sm:text-xl leading-snug text-zinc-100">
                “{profile.aboutQuote}”
              </p>
              <div className="mt-2.5 text-xs text-indigo-300 font-medium">
                — {profile.teacherName} · {profile.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
