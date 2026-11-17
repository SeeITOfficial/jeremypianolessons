"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  LogOut,
  MessageSquareQuote,
  Plus,
  Save,
  Settings,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import type {
  AgeGroup,
  ArticleItem,
  ClassItem,
  FaqItem,
  SiteContent,
  SkillLevel,
  TestimonialItem,
  VideoCategory,
  VideoItem,
} from "@/lib/types";
import type { PersistenceMode } from "@/lib/content-store";
import { extractYouTubeId, getYouTubeThumbnail } from "@/lib/youtube";

interface AdminDashboardProps {
  initialContent: SiteContent;
  persistenceMode: PersistenceMode;
  onLogout: () => void;
}

type AdminTab = "classes" | "videos" | "articles" | "reviews" | "studio";

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export default function AdminDashboard({
  initialContent,
  persistenceMode,
  onLogout,
}: AdminDashboardProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [activeTab, setActiveTab] = useState<AdminTab>("classes");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: "success" | "warning" | "error";
    text: string;
  } | null>(null);

  const updateContent = (updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => updater(prev));
    setDirty(true);
    setStatusBanner(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusBanner(null);

    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
        content?: SiteContent;
      };

      if (res.ok && data.ok) {
        if (data.content) setContent(data.content);
        setDirty(false);
        setStatusBanner({
          type: "success",
          text: data.message || "Changes saved and published.",
        });
      } else {
        setStatusBanner({
          type: res.status === 409 ? "warning" : "error",
          text:
            data.message ||
            data.error ||
            "Could not save remotely. Use Export JSON to download your changes.",
        });
      }
    } catch {
      setStatusBanner({
        type: "error",
        text: "Network error while saving.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2) + "\n"], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "site-content.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as SiteContent;
      if (!parsed.profile || !Array.isArray(parsed.classes)) {
        setStatusBanner({
          type: "error",
          text: "Invalid site-content.json file.",
        });
        return;
      }
      setContent(parsed);
      setDirty(true);
      setStatusBanner({
        type: "warning",
        text: "JSON imported into editor. Click Save & Publish to apply.",
      });
    } catch {
      setStatusBanner({
        type: "error",
        text: "Could not parse JSON file.",
      });
    } finally {
      e.target.value = "";
    }
  };

  const modeBadge =
    persistenceMode === "github"
      ? { label: "GitHub Live Sync", style: "bg-emerald-950/70 text-emerald-300 border-emerald-500/30" }
      : persistenceMode === "local"
        ? { label: "Local File Mode", style: "bg-amber-950/70 text-amber-300 border-amber-500/30" }
        : { label: "Export Mode (Add GITHUB_TOKEN for 1-click cloud save)", style: "bg-stone-800 text-stone-300 border-stone-600" };

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: "classes", label: `Classes (${content.classes.length})`, icon: <GraduationCap className="w-4 h-4" /> },
    { id: "videos", label: `Videos (${content.videos.length})`, icon: <Video className="w-4 h-4" /> },
    { id: "articles", label: `Guides (${content.articles.length})`, icon: <BookOpen className="w-4 h-4" /> },
    { id: "reviews", label: "Reviews & FAQ", icon: <MessageSquareQuote className="w-4 h-4" /> },
    { id: "studio", label: "Studio & Contact", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#14110F]">
      {/* Sticky Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-[#14110F] text-[#FAF6F0] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif-display text-2xl sm:text-3xl">
              {content.profile.brandName}{" "}
              <em className="italic text-[#C87A53]">Admin</em>
            </h1>
            <span
              className={`px-3 py-1 rounded-full border text-[11px] font-mono-meta ${modeBadge.style}`}
            >
              {modeBadge.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 hover:border-[#C87A53] text-xs font-medium text-[#FAF6F0] transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                dirty
                  ? "bg-[#C87A53] hover:bg-[#B56542] text-white shadow-lg"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : dirty ? "Save & Publish *" : "Saved"}</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/15 hover:bg-white/10 text-xs text-[#FAF6F0]/75 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex gap-1 overflow-x-auto pb-0 border-t border-white/10">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? "border-[#C87A53] text-[#E5A989]"
                    : "border-transparent text-[#FAF6F0]/60 hover:text-[#FAF6F0]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {statusBanner && (
          <div
            className={`rounded-2xl px-5 py-4 flex items-start gap-3 text-sm border ${
              statusBanner.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : statusBanner.type === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{statusBanner.text}</p>
          </div>
        )}

        {/* TAB 1: CLASSES */}
        {activeTab === "classes" && (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-display text-3xl">Classes & Programs</h2>
                <p className="text-sm text-[#6E5A4F]">
                  Add, edit, or hide classes shown on the public website and booking dropdown.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newClass: ClassItem = {
                    id: makeId("class"),
                    title: "New Piano Class",
                    ageGroup: "All Ages",
                    level: "Beginner",
                    duration: "60 min / session",
                    format: "In-Person · Entebbe",
                    priceNote: "1-on-1 Coaching",
                    summary: "Describe what students will learn in this class.",
                    highlights: ["Foundational technique", "Songs tailored to your goals"],
                    featured: false,
                    published: true,
                  };
                  updateContent((prev) => ({
                    ...prev,
                    classes: [...prev.classes, newClass],
                  }));
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14110F] hover:bg-[#C87A53] text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class</span>
              </button>
            </div>

            <div className="space-y-5">
              {content.classes.map((cls, index) => (
                <div
                  key={cls.id}
                  className="rounded-2xl bg-white border border-[#C87A53]/25 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F2EAE0]">
                    <span className="font-mono-meta text-xs uppercase tracking-[0.14em] text-[#A65C38]">
                      Class #{index + 1}
                    </span>
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(cls.featured)}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              classes: prev.classes.map((item) =>
                                item.id === cls.id
                                  ? { ...item, featured: e.target.checked }
                                  : item
                              ),
                            }))
                          }
                        />
                        <span>Featured Dark Card</span>
                      </label>

                      <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cls.published}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              classes: prev.classes.map((item) =>
                                item.id === cls.id
                                  ? { ...item, published: e.target.checked }
                                  : item
                              ),
                            }))
                          }
                        />
                        <span>Published</span>
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          updateContent((prev) => ({
                            ...prev,
                            classes: prev.classes.filter((item) => item.id !== cls.id),
                          }))
                        }
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Class Title
                      </label>
                      <input
                        type="text"
                        value={cls.title}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            classes: prev.classes.map((item) =>
                              item.id === cls.id ? { ...item, title: e.target.value } : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Age Group
                      </label>
                      <select
                        value={cls.ageGroup}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            classes: prev.classes.map((item) =>
                              item.id === cls.id
                                ? { ...item, ageGroup: e.target.value as AgeGroup }
                                : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      >
                        <option value="Children">Children</option>
                        <option value="Teens">Teens</option>
                        <option value="Adults">Adults</option>
                        <option value="All Ages">All Ages</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Level
                      </label>
                      <select
                        value={cls.level}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            classes: prev.classes.map((item) =>
                              item.id === cls.id
                                ? { ...item, level: e.target.value as SkillLevel }
                                : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={cls.duration}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            classes: prev.classes.map((item) =>
                              item.id === cls.id ? { ...item, duration: e.target.value } : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Format & Pricing Note
                      </label>
                      <input
                        type="text"
                        value={cls.format}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            classes: prev.classes.map((item) =>
                              item.id === cls.id ? { ...item, format: e.target.value } : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Summary
                      </label>
                      <textarea
                        rows={4}
                        value={cls.summary}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            classes: prev.classes.map((item) =>
                              item.id === cls.id ? { ...item, summary: e.target.value } : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Syllabus Highlights (one bullet per line)
                      </label>
                      <textarea
                        rows={4}
                        value={cls.highlights.join("\n")}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            classes: prev.classes.map((item) =>
                              item.id === cls.id
                                ? {
                                    ...item,
                                    highlights: e.target.value.split("\n"),
                                  }
                                : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: YOUTUBE VIDEOS */}
        {activeTab === "videos" && (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-display text-3xl">YouTube Videos</h2>
                <p className="text-sm text-[#6E5A4F]">
                  Paste any YouTube link (watch, share, or Shorts) — thumbnails and embedded playback work automatically without storage buckets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextVid: VideoItem = {
                    id: makeId("vid"),
                    title: "New Piano Lesson Video",
                    youtubeUrl: "",
                    category: "Tutorial",
                    duration: "5 min",
                    description: "Short description of what students learn in this video.",
                    published: true,
                  };
                  updateContent((prev) => ({
                    ...prev,
                    videos: [...prev.videos, nextVid],
                  }));
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14110F] hover:bg-[#C87A53] text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Video</span>
              </button>
            </div>

            <div className="space-y-5">
              {content.videos.map((vid, idx) => {
                const ytId = extractYouTubeId(vid.youtubeUrl);
                const thumb = getYouTubeThumbnail(vid.youtubeUrl);

                return (
                  <div
                    key={vid.id}
                    className="rounded-2xl bg-white border border-[#C87A53]/25 p-5 sm:p-6 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                  >
                    <div className="lg:col-span-4 space-y-2">
                      <div className="aspect-video rounded-xl overflow-hidden bg-[#14110F] border border-[#C87A53]/20 flex items-center justify-center">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4 text-xs text-[#FAF6F0]/60">
                            Paste a YouTube link to preview thumbnail
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] font-mono-meta text-[#6E5A4F]">
                        {vid.youtubeUrl.trim()
                          ? ytId
                            ? `Detected YouTube ID: ${ytId}`
                            : "Could not detect valid YouTube ID"
                          : `Video #${idx + 1} · No link yet (shows Coming Soon)`}
                      </div>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={vid.published}
                            onChange={(e) =>
                              updateContent((prev) => ({
                                ...prev,
                                videos: prev.videos.map((item) =>
                                  item.id === vid.id
                                    ? { ...item, published: e.target.checked }
                                    : item
                                ),
                              }))
                            }
                          />
                          <span>Published on Site</span>
                        </label>

                        <button
                          type="button"
                          onClick={() =>
                            updateContent((prev) => ({
                              ...prev,
                              videos: prev.videos.filter((item) => item.id !== vid.id),
                            }))
                          }
                          className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                            YouTube URL
                          </label>
                          <input
                            type="url"
                            value={vid.youtubeUrl}
                            onChange={(e) =>
                              updateContent((prev) => ({
                                ...prev,
                                videos: prev.videos.map((item) =>
                                  item.id === vid.id
                                    ? { ...item, youtubeUrl: e.target.value }
                                    : item
                                ),
                              }))
                            }
                            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                            Video Title
                          </label>
                          <input
                            type="text"
                            value={vid.title}
                            onChange={(e) =>
                              updateContent((prev) => ({
                                ...prev,
                                videos: prev.videos.map((item) =>
                                  item.id === vid.id
                                    ? { ...item, title: e.target.value }
                                    : item
                                ),
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                            Category
                          </label>
                          <select
                            value={vid.category}
                            onChange={(e) =>
                              updateContent((prev) => ({
                                ...prev,
                                videos: prev.videos.map((item) =>
                                  item.id === vid.id
                                    ? {
                                        ...item,
                                        category: e.target.value as VideoCategory,
                                      }
                                    : item
                                ),
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                          >
                            <option value="Tutorial">Tutorial</option>
                            <option value="Practice Tip">Practice Tip</option>
                            <option value="Performance">Performance</option>
                            <option value="Student Showcase">Student Showcase</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                            Duration Label
                          </label>
                          <input
                            type="text"
                            value={vid.duration}
                            onChange={(e) =>
                              updateContent((prev) => ({
                                ...prev,
                                videos: prev.videos.map((item) =>
                                  item.id === vid.id
                                    ? { ...item, duration: e.target.value }
                                    : item
                                ),
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={vid.description}
                            onChange={(e) =>
                              updateContent((prev) => ({
                                ...prev,
                                videos: prev.videos.map((item) =>
                                  item.id === vid.id
                                    ? { ...item, description: e.target.value }
                                    : item
                                ),
                              }))
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* TAB 3: ARTICLES & GUIDES */}
        {activeTab === "articles" && (
          <section className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-display text-3xl">Practice Guides & Articles</h2>
                <p className="text-sm text-[#6E5A4F]">
                  Write helpful articles for students and parents. Each guide opens in a clean reader modal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextArticle: ArticleItem = {
                    id: makeId("guide"),
                    title: "New Piano Practice Guide",
                    category: "Practice Tips",
                    readTime: "3 min read",
                    excerpt: "Short summary shown on the guide card.",
                    coverImage:
                      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=85",
                    content: [
                      "First paragraph of your guide.",
                      "Second paragraph with practical advice.",
                    ],
                    published: true,
                  };
                  updateContent((prev) => ({
                    ...prev,
                    articles: [...prev.articles, nextArticle],
                  }));
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14110F] hover:bg-[#C87A53] text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Guide</span>
              </button>
            </div>

            <div className="space-y-5">
              {content.articles.map((art) => (
                <div
                  key={art.id}
                  className="rounded-2xl bg-white border border-[#C87A53]/25 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F2EAE0]">
                    <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={art.published}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            articles: prev.articles.map((item) =>
                              item.id === art.id
                                ? { ...item, published: e.target.checked }
                                : item
                            ),
                          }))
                        }
                      />
                      <span>Published</span>
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((prev) => ({
                          ...prev,
                          articles: prev.articles.filter((item) => item.id !== art.id),
                        }))
                      }
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={art.title}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            articles: prev.articles.map((item) =>
                              item.id === art.id ? { ...item, title: e.target.value } : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={art.category}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            articles: prev.articles.map((item) =>
                              item.id === art.id ? { ...item, category: e.target.value } : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={art.readTime}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            articles: prev.articles.map((item) =>
                              item.id === art.id ? { ...item, readTime: e.target.value } : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                        Cover Image URL
                      </label>
                      <input
                        type="url"
                        value={art.coverImage}
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            articles: prev.articles.map((item) =>
                              item.id === art.id ? { ...item, coverImage: e.target.value } : item
                            ),
                          }))
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                      Short Excerpt
                    </label>
                    <input
                      type="text"
                      value={art.excerpt}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          articles: prev.articles.map((item) =>
                            item.id === art.id ? { ...item, excerpt: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                      Full Article Body (separate paragraphs with a blank line)
                    </label>
                    <textarea
                      rows={5}
                      value={art.content.join("\n\n")}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          articles: prev.articles.map((item) =>
                            item.id === art.id
                              ? {
                                  ...item,
                                  content: e.target.value.split(/\n\s*\n/),
                                }
                              : item
                          ),
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: REVIEWS & FAQ */}
        {activeTab === "reviews" && (
          <div className="space-y-10">
            {/* Testimonials */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-display text-3xl">Student Testimonials</h2>
                  <p className="text-sm text-[#6E5A4F]">
                    Real student and parent stories displayed on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextTesti: TestimonialItem = {
                      id: makeId("review"),
                      name: "Student Name",
                      role: "Student · Entebbe",
                      quote: "Share what the student loved about lessons.",
                      rating: 5,
                      published: true,
                    };
                    updateContent((prev) => ({
                      ...prev,
                      testimonials: [...prev.testimonials, nextTesti],
                    }));
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14110F] hover:bg-[#C87A53] text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl bg-white border border-[#C87A53]/25 p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={t.published}
                          onChange={(e) =>
                            updateContent((prev) => ({
                              ...prev,
                              testimonials: prev.testimonials.map((item) =>
                                item.id === t.id
                                  ? { ...item, published: e.target.checked }
                                  : item
                              ),
                            }))
                          }
                        />
                        <span>Published</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.filter((item) => item.id !== t.id),
                          }))
                        }
                        className="text-xs text-red-600 hover:text-red-800 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={t.name}
                        placeholder="Name"
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.map((item) =>
                              item.id === t.id ? { ...item, name: e.target.value } : item
                            ),
                          }))
                        }
                        className="px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25 text-sm"
                      />
                      <input
                        type="text"
                        value={t.role}
                        placeholder="Role (e.g. Parent)"
                        onChange={(e) =>
                          updateContent((prev) => ({
                            ...prev,
                            testimonials: prev.testimonials.map((item) =>
                              item.id === t.id ? { ...item, role: e.target.value } : item
                            ),
                          }))
                        }
                        className="px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25 text-sm"
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          testimonials: prev.testimonials.map((item) =>
                            item.id === t.id ? { ...item, quote: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25 text-sm"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif-display text-3xl flex items-center gap-2">
                    <HelpCircle className="w-6 h-6 text-[#A65C38]" />
                    <span>Frequently Asked Questions</span>
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextFaq: FaqItem = {
                      id: makeId("faq"),
                      question: "New question?",
                      answer: "Write a clear, helpful answer.",
                    };
                    updateContent((prev) => ({
                      ...prev,
                      faqs: [...prev.faqs, nextFaq],
                    }));
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14110F] hover:bg-[#C87A53] text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {content.faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-white border border-[#C87A53]/25 p-5 space-y-3"
                  >
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((prev) => ({
                            ...prev,
                            faqs: prev.faqs.filter((item) => item.id !== faq.id),
                          }))
                        }
                        className="text-xs text-red-600 hover:text-red-800 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          faqs: prev.faqs.map((item) =>
                            item.id === faq.id ? { ...item, question: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25 font-medium"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          faqs: prev.faqs.map((item) =>
                            item.id === faq.id ? { ...item, answer: e.target.value } : item
                          ),
                        }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25 text-sm"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* TAB 5: STUDIO PROFILE & BACKUP */}
        {activeTab === "studio" && (
          <section className="space-y-6">
            <div>
              <h2 className="font-serif-display text-3xl">Studio Profile & Contact</h2>
              <p className="text-sm text-[#6E5A4F]">
                Update contact numbers, social links, bio text, and download or restore JSON backups.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#C87A53]/25 p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={content.profile.brandName}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, brandName: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    Teacher Name
                  </label>
                  <input
                    type="text"
                    value={content.profile.teacherName}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, teacherName: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    Primary WhatsApp Digits (e.g. 256705576698)
                  </label>
                  <input
                    type="text"
                    value={content.profile.whatsappPrimary}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, whatsappPrimary: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    Primary Phone Display
                  </label>
                  <input
                    type="text"
                    value={content.profile.phoneDisplayPrimary}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, phoneDisplayPrimary: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    Secondary Phone Digits
                  </label>
                  <input
                    type="text"
                    value={content.profile.whatsappSecondary}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, whatsappSecondary: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    Secondary Phone Display
                  </label>
                  <input
                    type="text"
                    value={content.profile.phoneDisplaySecondary}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: {
                          ...prev.profile,
                          phoneDisplaySecondary: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={content.profile.email}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    Teaching Hours
                  </label>
                  <input
                    type="text"
                    value={content.profile.teachingHours}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, teachingHours: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={content.profile.youtubeChannelUrl}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, youtubeChannelUrl: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                    Instagram URL (optional)
                  </label>
                  <input
                    type="url"
                    value={content.profile.instagramUrl}
                    onChange={(e) =>
                      updateContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, instagramUrl: e.target.value },
                      }))
                    }
                    placeholder="https://instagram.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={content.profile.heroSubtitle}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, heroSubtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono-meta uppercase text-[#6E5A4F] mb-1">
                  About Quote
                </label>
                <input
                  type="text"
                  value={content.profile.aboutQuote}
                  onChange={(e) =>
                    updateContent((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, aboutQuote: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#C87A53]/25"
                />
              </div>
            </div>

            {/* Backup & Restore */}
            <div className="rounded-2xl bg-[#F2EAE0] border border-[#C87A53]/25 p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif-display text-2xl">Backup & Portability</h3>
                <p className="text-sm text-[#6E5A4F]">
                  Export or restore <code className="font-mono-meta">site-content.json</code> anytime — zero vendor lock-in.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#14110F] text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#C87A53] text-[#14110F] text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import JSON</span>
                  <input
                    type="file"
                    accept="application/json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
