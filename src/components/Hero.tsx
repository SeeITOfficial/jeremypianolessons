"use client";

import { ArrowRight, MapPin, Play, Sparkles, Volume2, VolumeX } from "lucide-react";
import type { StudioProfile } from "@/lib/types";
import { extractYouTubeId } from "@/lib/youtube";

interface HeroProps {
  profile: StudioProfile;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

const AUDIENCE_CHIPS = [
  { label: "Kids (5–11)", dot: "bg-rose-400" },
  { label: "Teens (12–17)", dot: "bg-indigo-400" },
  { label: "Adults (18+)", dot: "bg-emerald-400" },
  { label: "Beginners Welcome", dot: "bg-amber-400" },
];

export default function Hero({
  profile,
  isMusicPlaying,
  onToggleMusic,
}: HeroProps) {
  const customVideoUrl = profile.heroVideoUrl?.trim() || "";
  const customYouTubeId = customVideoUrl
    ? extractYouTubeId(customVideoUrl)
    : null;

  return (
    <section
      id="home"
      className="relative bg-[#09090B] text-white pt-28 sm:pt-32 pb-16 sm:pb-24 overflow-hidden"
    >
      {/* Subtle studio lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -left-20 w-[34rem] h-[34rem] rounded-full bg-indigo-500/25 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none top-1/4 right-0 absolute w-[30rem] h-[30rem] rounded-full bg-sky-400/12 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none bottom-0 right-1/4 absolute w-[26rem] h-[26rem] rounded-full bg-amber-400/12 blur-[120px]"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-indigo-300 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>{profile.heroTag}</span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-[4.35rem] leading-[1.02] tracking-tight text-white">
              {profile.heroTitleLine1}{" "}
              <span className="block mt-1">
                {profile.heroTitleLine2}{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300 bg-clip-text text-transparent">
                  {profile.heroTitleAccent}
                </span>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 leading-relaxed max-w-xl">
              {profile.heroSubtitle}
            </p>

            {/* Audience pills */}
            <div className="flex flex-wrap gap-2">
              {AUDIENCE_CHIPS.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-zinc-200"
                >
                  <span className={`w-2 h-2 rounded-full ${chip.dot}`} />
                  {chip.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href="#booking"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/25"
              >
                <span>Book a Trial Lesson</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#curriculum"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white/[0.06] hover:bg-white/[0.11] border border-white/15 text-zinc-100 text-sm font-semibold transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Try Interactive Piano</span>
              </a>
            </div>
          </div>

          {/* Right Video Stage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-zinc-900 shadow-2xl shadow-black/60 aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4]">
              {customYouTubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${customYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${customYouTubeId}&controls=0&playsinline=1&modestbranding=1&rel=0`}
                  title="Hero studio showcase video"
                  className="w-full h-full pointer-events-none scale-[1.22]"
                  allow="autoplay; encrypted-media"
                />
              ) : customVideoUrl ? (
                <video
                  key={customVideoUrl}
                  src={customVideoUrl}
                  className="w-full h-full object-cover opacity-90"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <video
                  className="w-full h-full object-cover opacity-90"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/videos/piano-loop.mp4" type="video/mp4" />
                  <source src="/videos/piano-loop.webm" type="video/webm" />
                </video>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#09090B]/90 via-transparent to-[#09090B]/30"
              />

              {/* Top-left subtle pill */}
              <div className="absolute top-4 left-4 animate-float-slow inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#09090B]/80 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-on-1 Coaching</span>
              </div>

              {/* Top-right audio toggle */}
              <button
                type="button"
                onClick={onToggleMusic}
                className="absolute top-4 right-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#09090B]/80 hover:bg-[#09090B] backdrop-blur-md border border-white/15 text-xs font-medium text-white transition-all cursor-pointer"
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
                    <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Studio Audio</span>
                  </>
                )}
              </button>

              {/* Bottom badge + Watch */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex flex-wrap items-end justify-between gap-3">
                <div className="bg-[#111116]/90 backdrop-blur-md border border-white/15 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt={`${profile.brandName} logo`}
                    className="w-10 h-10 rounded-full object-contain shrink-0"
                  />
                  <div>
                    <div className="text-[10px] font-mono-meta uppercase tracking-[0.14em] text-indigo-300 font-semibold">
                      Instructor · {profile.location}
                    </div>
                    <div className="font-display font-bold text-xl sm:text-2xl leading-tight">
                      {profile.teacherName}
                    </div>
                  </div>
                </div>

                <a
                  href="#videos"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-xs font-semibold text-white transition-colors"
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
