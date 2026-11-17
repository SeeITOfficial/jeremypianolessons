"use client";

import { ArrowRight, MapPin, Play, Sparkles, Volume2, VolumeX } from "lucide-react";
import type { StudioProfile } from "@/lib/types";

interface HeroProps {
  profile: StudioProfile;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

const AUDIENCE_CHIPS = [
  { label: "Kids (5–11)", dot: "bg-rose-500" },
  { label: "Teens (12–17)", dot: "bg-indigo-500" },
  { label: "Adults (18+)", dot: "bg-emerald-500" },
  { label: "Zero Experience Welcome", dot: "bg-amber-500" },
];

export default function Hero({
  profile,
  isMusicPlaying,
  onToggleMusic,
}: HeroProps) {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-[#F4F7FF] via-white to-[#FFF8EC] pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-hidden"
    >
      {/* Bright soft background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-200/45 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-amber-200/45 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>{profile.heroTag}</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-[4.25rem] leading-[1.02] tracking-tight text-slate-900">
              {profile.heroTitleLine1}{" "}
              <span className="block mt-1">
                {profile.heroTitleLine2}{" "}
                <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#F59E0B] bg-clip-text text-transparent">
                  {profile.heroTitleAccent}
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {profile.heroSubtitle}
            </p>

            {/* Friendly audience pills */}
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-medium text-slate-700"
                >
                  <span className={`w-2 h-2 rounded-full ${chip.dot}`} />
                  {chip.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href="#booking"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
              >
                <span>Book a Trial Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#curriculum"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-sm font-semibold transition-all shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Try the Live Piano</span>
              </a>
            </div>
          </div>

          {/* Right Video Stage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-white bg-slate-900 shadow-2xl shadow-indigo-950/15 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4]">
              <video
                className="w-full h-full object-cover"
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
                className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/15"
              />

              {/* Top-left floating sparkle pill */}
              <div className="absolute top-4 left-4 animate-float-slow inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Beginner Friendly</span>
              </div>

              {/* Top-right studio audio toggle */}
              <button
                type="button"
                onClick={onToggleMusic}
                className="absolute top-4 right-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/75 hover:bg-slate-900 backdrop-blur-md border border-white/20 text-xs font-medium text-white transition-all cursor-pointer"
              >
                {isMusicPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Music On</span>
                    <span className="flex items-end gap-0.5 h-3">
                      <span className="w-0.5 h-full bg-amber-400 rounded-full eq-bar-1 origin-bottom" />
                      <span className="w-0.5 h-full bg-amber-400 rounded-full eq-bar-2 origin-bottom" />
                      <span className="w-0.5 h-full bg-amber-400 rounded-full eq-bar-3 origin-bottom" />
                    </span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white/75" />
                    <span>Play Studio Music</span>
                  </>
                )}
              </button>

              {/* Bottom badge + Watch button */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex flex-wrap items-end justify-between gap-3">
                <div className="bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2.5 rounded-2xl shadow-lg">
                  <div className="text-[10px] font-mono-meta uppercase tracking-[0.14em] text-indigo-600 font-semibold">
                    1-on-1 Coach · {profile.location}
                  </div>
                  <div className="font-display font-bold text-xl sm:text-2xl leading-tight">
                    {profile.teacherName}
                  </div>
                </div>

                <a
                  href="#videos"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-xs font-semibold text-white transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Clips</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
