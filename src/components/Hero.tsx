"use client";

import { ArrowRight, MapPin, Play, Sparkles, Volume2, VolumeX } from "lucide-react";
import type { StudioProfile } from "@/lib/types";

interface HeroProps {
  profile: StudioProfile;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

const MARQUEE_TAGS = [
  "1-on-1 Piano Coaching",
  "Children, Teens & Adults",
  "Entebbe, Uganda",
  "Classical · Contemporary · Gospel",
  "Sheet Reading & Playing by Ear",
  "Flexible Weekday & Saturday Slots",
];

export default function Hero({
  profile,
  isMusicPlaying,
  onToggleMusic,
}: HeroProps) {
  return (
    <section
      id="home"
      className="relative bg-[#14110F] text-[#FAF6F0] pt-28 sm:pt-32 overflow-hidden"
    >
      {/* Subtle warm radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#C87A53]/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 right-0 w-80 h-80 rounded-full bg-[#C87A53]/10 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-14 sm:pb-20 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C87A53]/40 bg-[#C87A53]/10 text-[#E5A989] text-xs font-mono-meta uppercase tracking-[0.16em]">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.heroTag}</span>
            </div>

            <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] leading-[0.95] tracking-tight text-[#FAF6F0]">
              {profile.heroTitleLine1}
              <br />
              {profile.heroTitleLine2}
              <br />
              <em className="italic text-[#C87A53]">
                {profile.heroTitleAccent}
              </em>
            </h1>

            <p className="text-base sm:text-lg text-[#FAF6F0]/75 leading-relaxed max-w-xl">
              {profile.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 pt-1">
              <a
                href="#booking"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#C87A53] hover:bg-[#B56542] text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] transition-all shadow-lg shadow-[#C87A53]/20"
              >
                <span>Book a Trial Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#classes"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/20 hover:border-[#C87A53] hover:bg-white/5 text-[#FAF6F0] text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] transition-all"
              >
                <span>Explore Classes</span>
              </a>
            </div>

            {/* Studio Proof Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <div className="font-serif-display text-2xl sm:text-3xl text-[#FAF6F0]">
                  1:1
                </div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-[#FAF6F0]/55 mt-0.5">
                  Private Coaching
                </div>
              </div>
              <div>
                <div className="font-serif-display text-2xl sm:text-3xl text-[#FAF6F0]">
                  All Ages
                </div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-[#FAF6F0]/55 mt-0.5">
                  Kids, Teens & Adults
                </div>
              </div>
              <div>
                <div className="font-serif-display text-2xl sm:text-3xl text-[#FAF6F0]">
                  Flex
                </div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-[#FAF6F0]/55 mt-0.5">
                  Studio Scheduling
                </div>
              </div>
            </div>
          </div>

          {/* Right Media Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 bg-[#1E1916] shadow-2xl aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/5]">
              <video
                className="w-full h-full object-cover opacity-85"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src="/videos/piano-loop.mp4" type="video/mp4" />
                <source src="/videos/piano-loop.webm" type="video/webm" />
              </video>

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#14110F] via-[#14110F]/20 to-transparent"
              />

              {/* Top-right studio audio toggle inside card */}
              <button
                type="button"
                onClick={onToggleMusic}
                className="absolute top-4 right-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#14110F]/80 hover:bg-[#14110F] backdrop-blur-md border border-white/15 text-xs font-medium text-[#FAF6F0] transition-all cursor-pointer"
              >
                {isMusicPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#C87A53]" />
                    <span>Studio Jazz On</span>
                    <span className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 h-full bg-[#C87A53] rounded-full eq-bar-1 origin-bottom" />
                      <span className="w-0.5 h-full bg-[#C87A53] rounded-full eq-bar-2 origin-bottom" />
                      <span className="w-0.5 h-full bg-[#C87A53] rounded-full eq-bar-3 origin-bottom" />
                    </span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white/70" />
                    <span>Play Studio Audio</span>
                  </>
                )}
              </button>

              {/* Bottom teacher badge safely inset inside card */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-end justify-between gap-4">
                <div className="bg-[#FAF6F0]/95 text-[#14110F] px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono-meta uppercase tracking-[0.14em] text-[#A65C38]">
                    <Sparkles className="w-3 h-3" />
                    <span>Your Instructor</span>
                  </div>
                  <div className="font-serif-display text-2xl sm:text-3xl leading-none mt-1">
                    {profile.teacherName}
                  </div>
                </div>

                <a
                  href="#videos"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-xs font-medium text-white transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Lessons</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Ribbon */}
      <div className="border-t border-white/10 bg-[#1E1916] py-3.5 overflow-hidden">
        <div className="animate-marquee">
          {[...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-6 px-6 text-xs font-mono-meta uppercase tracking-[0.18em] text-[#E5A989]/90 whitespace-nowrap"
            >
              <span>♪</span>
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
