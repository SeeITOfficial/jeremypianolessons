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
    <section id="videos" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-3">
              Watch & Learn
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-slate-900">
              Quick lesson clips
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#4F46E5] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
                className="group text-left rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all shadow-xs hover:shadow-lg cursor-pointer flex flex-col"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={cover}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 text-slate-900 text-[11px] font-semibold">
                    {video.category}
                  </span>

                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-[11px] font-medium text-white">
                    {hasPlayableVideo ? video.duration : "Coming Soon"}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-13 h-13 rounded-full bg-[#4F46E5] group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:scale-110 text-white flex items-center justify-center shadow-lg transition-all">
                      {hasPlayableVideo ? (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      ) : (
                        <Video className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900 mb-1.5">
                      {video.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {profile.youtubeChannelUrl && (
          <div className="mt-8 rounded-2xl bg-indigo-50 border border-indigo-100 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-700">
              Want weekly beginner tips & student clips?
            </span>
            <a
              href={profile.youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold transition-colors"
            >
              <span>Visit YouTube Channel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeVideo.title}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full overflow-hidden border border-white/15 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close video modal"
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-white hover:bg-[#4F46E5] transition-colors cursor-pointer"
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
              <div className="p-8 sm:p-12 text-center bg-slate-950 border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mx-auto mb-4">
                  <Video className="w-6 h-6" />
                </div>
                <p className="text-xs font-mono-meta uppercase tracking-[0.14em] text-amber-400 mb-2">
                  Video Coming Soon
                </p>
                <p className="text-sm text-slate-300 max-w-md mx-auto mb-5">
                  This clip is queued for upload. Subscribe on YouTube or ask{" "}
                  {profile.teacherName} to walk you through it in your trial
                  lesson!
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {profile.youtubeChannelUrl && (
                    <a
                      href={profile.youtubeChannelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] text-white text-xs font-semibold"
                    >
                      <span>YouTube Channel</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <a
                    href="#booking"
                    onClick={() => setActiveVideo(null)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold"
                  >
                    Book 1-on-1 Trial
                  </a>
                </div>
              </div>
            )}

            <div className="p-6 sm:p-7">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1.5">
                <span>{activeVideo.category}</span>
                <span>·</span>
                <span>{activeVideo.duration}</span>
              </div>
              <h3 className="font-display font-bold text-2xl mb-1.5">
                {activeVideo.title}
              </h3>
              <p className="text-sm text-slate-300">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
