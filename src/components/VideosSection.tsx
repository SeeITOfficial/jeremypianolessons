"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Play, Video, X } from "lucide-react";
import type { StudioProfile, VideoCategory, VideoItem } from "@/lib/types";
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/youtube";

interface VideosSectionProps {
  videos: VideoItem[];
  profile: StudioProfile;
}

const CATEGORIES: Array<"All" | VideoCategory> = [
  "All",
  "Tutorial",
  "Practice Tip",
  "Performance",
  "Student Showcase",
];

const FALLBACK_COVERS = [
  "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=900&q=85",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=900&q=85",
  "https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=900&q=85",
];

export default function VideosSection({ videos, profile }: VideosSectionProps) {
  const publishedVideos = useMemo(
    () => videos.filter((v) => v.published),
    [videos]
  );

  const [category, setCategory] = useState<"All" | VideoCategory>("All");
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const filtered = useMemo(() => {
    if (category === "All") return publishedVideos;
    return publishedVideos.filter((v) => v.category === category);
  }, [publishedVideos, category]);

  if (publishedVideos.length === 0) return null;

  const activeEmbed = activeVideo
    ? getYouTubeEmbedUrl(activeVideo.youtubeUrl)
    : null;

  return (
    <section id="videos" className="py-20 sm:py-28 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-mono-meta uppercase tracking-[0.2em] text-[#A65C38] mb-3">
              Watch & Learn
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl text-[#14110F] leading-[1.08]">
              Video masterclasses &{" "}
              <em className="italic text-[#A65C38]">performances</em>
            </h2>
            <p className="text-base text-[#6E5A4F] mt-3">
              Short piano breakdowns, practice drills, and studio moments from{" "}
              {profile.teacherName}.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#14110F] text-[#FAF6F0]"
                      : "bg-[#F2EAE0] text-[#57473E] hover:bg-[#E7DAC9]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((video, idx) => {
            const ytThumb = getYouTubeThumbnail(video.youtubeUrl);
            const hasPlayableVideo = Boolean(ytThumb);
            const cover =
              ytThumb || FALLBACK_COVERS[idx % FALLBACK_COVERS.length];

            return (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveVideo(video)}
                className="group text-left rounded-2xl overflow-hidden bg-[#14110F] text-[#FAF6F0] border border-[#C87A53]/20 hover:border-[#C87A53] transition-all shadow-md hover:shadow-xl cursor-pointer flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-[#1E1916]">
                  <img
                    src={cover}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14110F]/85 via-[#14110F]/20 to-transparent" />

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#14110F]/75 backdrop-blur-sm border border-white/15 text-[10px] font-mono-meta uppercase tracking-[0.12em] text-[#E5A989]">
                    {video.category}
                  </span>

                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#14110F]/75 backdrop-blur-sm text-[10px] font-mono-meta text-white/80">
                    {hasPlayableVideo ? video.duration : "Coming Soon"}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-[#C87A53] group-hover:bg-[#B56542] group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-all">
                      {hasPlayableVideo ? (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      ) : (
                        <Video className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-display text-xl sm:text-2xl leading-snug text-[#FAF6F0] mb-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-[#FAF6F0]/65 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs font-mono-meta uppercase tracking-[0.12em] text-[#E5A989]">
                    {hasPlayableVideo ? "Watch Video →" : "Preview Details →"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {profile.youtubeChannelUrl && (
          <div className="mt-10 rounded-2xl bg-[#F2EAE0] border border-[#C87A53]/25 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif-display text-2xl text-[#14110F]">
                Want more free practice tutorials?
              </h3>
              <p className="text-sm text-[#6E5A4F] mt-1">
                Follow {profile.teacherName} on YouTube for weekly breakdowns,
                warm-ups, and student performances.
              </p>
            </div>
            <a
              href={profile.youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#14110F] hover:bg-[#C87A53] text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors shrink-0"
            >
              <span>Visit YouTube Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Cinema Video Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          className="fixed inset-0 z-50 bg-[#14110F]/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-[#1E1916] text-[#FAF6F0] rounded-2xl sm:rounded-3xl max-w-3xl w-full overflow-hidden border border-white/15 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close video modal"
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#14110F]/80 text-white hover:bg-[#C87A53] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {activeEmbed ? (
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={activeEmbed}
                  title={activeVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="p-8 sm:p-12 text-center bg-[#14110F] border-b border-white/10">
                <div className="w-14 h-14 rounded-full bg-[#C87A53]/20 text-[#E5A989] flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6" />
                </div>
                <p className="text-xs font-mono-meta uppercase tracking-[0.16em] text-[#E5A989] mb-2">
                  Lesson Video Coming Soon
                </p>
                <p className="text-sm text-[#FAF6F0]/75 max-w-md mx-auto mb-5">
                  This lesson is queued for upload. Subscribe on YouTube or
                  message {profile.teacherName} on WhatsApp to cover this topic
                  1-on-1 in your trial lesson.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {profile.youtubeChannelUrl && (
                    <a
                      href={profile.youtubeChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C87A53] text-white text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      <span>YouTube Channel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <a
                    href="#booking"
                    onClick={() => setActiveVideo(null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.12em]"
                  >
                    Book 1-on-1 Lesson
                  </a>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 text-xs font-mono-meta text-[#E5A989] uppercase tracking-[0.12em] mb-2">
                <span>{activeVideo.category}</span>
                <span>·</span>
                <span>{activeVideo.duration}</span>
              </div>
              <h3 className="font-serif-display text-2xl sm:text-3xl mb-2">
                {activeVideo.title}
              </h3>
              <p className="text-sm sm:text-base text-[#FAF6F0]/75 leading-relaxed">
                {activeVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
