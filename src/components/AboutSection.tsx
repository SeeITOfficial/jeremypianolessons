import { Quote } from "lucide-react";
import type { StudioProfile } from "@/lib/types";

interface AboutSectionProps {
  profile: StudioProfile;
}

export default function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Story & 4 Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block text-xs font-mono-meta uppercase tracking-[0.2em] text-[#A65C38]">
              Meet Your Teacher
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-[#14110F] leading-[1.08]">
              {profile.aboutHeadline}
            </h2>
            <p className="text-base sm:text-lg text-[#57473E] leading-relaxed">
              {profile.aboutParagraph1}
            </p>
            <p className="text-base sm:text-lg text-[#57473E] leading-relaxed">
              {profile.aboutParagraph2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {profile.pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-[#F2EAE0] border border-[#C87A53]/20 rounded-2xl p-5 hover:border-[#C87A53]/50 transition-colors"
                >
                  <h3 className="font-serif-display text-xl text-[#14110F] mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#6E5A4F] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Studio Image & Quote (always visible on mobile + desktop) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C87A53]/20 bg-[#14110F] aspect-[4/3] shadow-xl">
              <img
                src={
                  profile.aboutImageUrl ||
                  "https://images.unsplash.com/photo-1552422535-c45813c61732?w=900&q=85"
                }
                alt={`${profile.teacherName} teaching piano in ${profile.location}`}
                className="w-full h-full object-cover opacity-90"
              />
            </div>

            <div className="rounded-2xl bg-[#14110F] text-[#FAF6F0] p-6 sm:p-8 relative overflow-hidden">
              <Quote className="w-8 h-8 text-[#C87A53]/40 mb-3" />
              <p className="font-serif-display italic text-xl sm:text-2xl leading-snug text-[#FAF6F0]">
                “{profile.aboutQuote}”
              </p>
              <div className="mt-4 text-xs font-mono-meta uppercase tracking-[0.16em] text-[#E5A989]">
                — {profile.teacherName} · {profile.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
