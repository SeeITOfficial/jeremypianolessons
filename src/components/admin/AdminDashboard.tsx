"use client";

import { useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import {
  CheckCircle2,
  ExternalLink,
  Film,
  GraduationCap,
  KeyRound,
  LogOut,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import type {
  AgeGroup,
  ClassItem,
  SiteContent,
  SkillLevel,
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

type AdminTab = "classes" | "videos" | "studio";

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function createEmptyClassDraft(): ClassItem {
  return {
    id: makeId("class"),
    title: "",
    ageGroup: "All Ages",
    level: "Beginner",
    duration: "60 min",
    format: "In-Person · Entebbe",
    priceNote: "1-on-1 Coaching",
    summary: "",
    highlights: ["Foundational technique", "Songs tailored to your goals"],
    featured: false,
    published: true,
  };
}

function createEmptyVideoDraft(): VideoItem {
  return {
    id: makeId("vid"),
    title: "",
    youtubeUrl: "",
    category: "Tutorial",
    duration: "5 min",
    description: "",
    published: true,
  };
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

  // Add Class / Add Video modal state
  const [classDraft, setClassDraft] = useState<ClassItem | null>(null);
  const [videoDraft, setVideoDraft] = useState<VideoItem | null>(null);
  const [modalError, setModalError] = useState("");
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadPct, setHeroUploadPct] = useState(0);

  // Change PIN state
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinSaving, setPinSaving] = useState(false);
  const [pinMessage, setPinMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const updateContent = (updater: (prev: SiteContent) => SiteContent) => {
    setContent((prev) => updater(prev));
    setDirty(true);
    setStatusBanner(null);
  };

  const persistContent = async (
    nextContent: SiteContent,
    successText?: string
  ): Promise<boolean> => {
    setSaving(true);
    setStatusBanner(null);

    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: nextContent }),
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
          text: successText || data.message || "Changes saved and published.",
        });
        return true;
      } else {
        setContent(nextContent);
        setDirty(true);
        setStatusBanner({
          type: res.status === 409 ? "warning" : "error",
          text:
            data.message ||
            data.error ||
            "Could not save remotely. Use Export JSON to download your changes.",
        });
        return false;
      }
    } catch {
      setStatusBanner({
        type: "error",
        text: "Network error while saving.",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => persistContent(content);

  const handleHeroVideoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setStatusBanner({
        type: "error",
        text: "Please select an MP4, WebM, or MOV video file.",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setStatusBanner({
        type: "error",
        text: "Please keep the hero loop video under 50 MB for fast loading.",
      });
      return;
    }

    setHeroUploading(true);
    setHeroUploadPct(0);
    setStatusBanner(null);

    try {
      let nextHeroUrl = "";

      if (persistenceMode === "cloud") {
        const ext = file.name.toLowerCase().endsWith(".webm")
          ? "webm"
          : file.name.toLowerCase().endsWith(".mov")
            ? "mov"
            : "mp4";
        const blobPath = `studio/hero-video.${ext}`;

        await upload(blobPath, file, {
          access: "private",
          handleUploadUrl: "/api/hero-video/upload",
          multipart: file.size > 4 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => setHeroUploadPct(Math.round(percentage)),
        });

        nextHeroUrl = `/api/hero-video?path=${encodeURIComponent(
          blobPath
        )}&v=${Date.now()}`;
      } else {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/hero-video/upload", {
          method: "PUT",
          body: formData,
        });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          throw new Error(data.error || "Upload failed");
        }
        nextHeroUrl = data.url;
        setHeroUploadPct(100);
      }

      const nextContent: SiteContent = {
        ...content,
        profile: {
          ...content.profile,
          heroVideoUrl: nextHeroUrl,
        },
      };
      setContent(nextContent);
      await persistContent(
        nextContent,
        "Hero video uploaded and published live!"
      );
    } catch (err) {
      setStatusBanner({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Could not upload hero video. Try a smaller MP4 or paste a YouTube link.",
      });
    } finally {
      setHeroUploading(false);
    }
  };

  const handleResetHeroVideo = async () => {
    const nextContent: SiteContent = {
      ...content,
      profile: {
        ...content.profile,
        heroVideoUrl: "",
      },
    };
    setContent(nextContent);
    await persistContent(
      nextContent,
      "Hero video restored to default piano loop."
    );
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classDraft) return;
    setModalError("");

    if (!classDraft.title.trim()) {
      setModalError("Please enter a class title.");
      return;
    }

    const cleaned: ClassItem = {
      ...classDraft,
      title: classDraft.title.trim(),
      summary:
        classDraft.summary.trim() ||
        "Personalised 1-on-1 piano coaching tailored to your pace.",
      highlights: classDraft.highlights
        .map((h) => h.trim())
        .filter(Boolean),
    };

    const nextContent: SiteContent = {
      ...content,
      classes: [cleaned, ...content.classes],
    };

    setContent(nextContent);
    setClassDraft(null);
    await persistContent(nextContent, `Added "${cleaned.title}" and published live.`);
  };

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoDraft) return;
    setModalError("");

    if (!videoDraft.title.trim()) {
      setModalError("Please enter a video title.");
      return;
    }

    if (videoDraft.youtubeUrl.trim() && !extractYouTubeId(videoDraft.youtubeUrl)) {
      setModalError("That doesn't look like a valid YouTube link.");
      return;
    }

    const cleaned: VideoItem = {
      ...videoDraft,
      title: videoDraft.title.trim(),
      youtubeUrl: videoDraft.youtubeUrl.trim(),
      description: videoDraft.description.trim(),
    };

    const nextContent: SiteContent = {
      ...content,
      videos: [cleaned, ...content.videos],
    };

    setContent(nextContent);
    setVideoDraft(null);
    await persistContent(nextContent, `Added "${cleaned.title}" and published live.`);
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinMessage(null);

    if (!/^\d{6}$/.test(currentPin) || !/^\d{6}$/.test(newPin)) {
      setPinMessage({
        type: "error",
        text: "Both Current PIN and New PIN must be 6 digits.",
      });
      return;
    }

    if (newPin !== confirmPin) {
      setPinMessage({
        type: "error",
        text: "New PIN and confirmation do not match.",
      });
      return;
    }

    setPinSaving(true);
    try {
      const res = await fetch("/api/auth/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPin, newPin }),
      });

      const data = (await res.json()) as { ok?: boolean; message?: string };
      if (res.ok && data.ok) {
        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
        setPinMessage({
          type: "success",
          text: data.message || "Your 6-digit PIN has been updated.",
        });
      } else {
        setPinMessage({
          type: "error",
          text: data.message || "Could not update PIN.",
        });
      }
    } catch {
      setPinMessage({
        type: "error",
        text: "Network error while updating PIN.",
      });
    } finally {
      setPinSaving(false);
    }
  };

  const modeBadge =
    persistenceMode === "cloud"
      ? { label: "Live Cloud Sync", style: "bg-emerald-950/70 text-emerald-300 border-emerald-500/30" }
      : persistenceMode === "local"
        ? { label: "Local File Mode", style: "bg-amber-950/70 text-amber-300 border-amber-500/30" }
        : { label: "Export Mode", style: "bg-slate-800 text-slate-300 border-slate-600" };

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: "classes", label: `Classes (${content.classes.length})`, icon: <GraduationCap className="w-4 h-4" /> },
    { id: "videos", label: `Videos (${content.videos.length})`, icon: <Video className="w-4 h-4" /> },
    { id: "studio", label: "Studio & Contact", icon: <Settings className="w-4 h-4" /> },
  ];

  const draftYtId = videoDraft ? extractYouTubeId(videoDraft.youtubeUrl) : null;
  const draftThumb = videoDraft ? getYouTubeThumbnail(videoDraft.youtubeUrl) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* Sticky Top Admin Bar */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display font-bold text-2xl sm:text-3xl">
              {content.profile.brandName}{" "}
              <span className="text-indigo-400">Admin</span>
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
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-700 hover:border-indigo-400 text-xs font-medium text-white transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                dirty
                  ? "bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg"
                  : "bg-white/15 hover:bg-white/25 text-white"
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : dirty ? "Save & Publish *" : "Saved"}</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-700 hover:bg-white/10 text-xs text-slate-300 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex gap-1 overflow-x-auto pb-0 border-t border-slate-800">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? "border-indigo-400 text-indigo-300"
                    : "border-transparent text-slate-400 hover:text-white"
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
                <h2 className="font-display font-bold text-3xl text-slate-900">
                  Classes & Programs
                </h2>
                <p className="text-sm text-slate-500">
                  Manage classes displayed on the website and booking form.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalError("");
                  setClassDraft(createEmptyClassDraft());
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class</span>
              </button>
            </div>

            <div className="space-y-5">
              {content.classes.map((cls, index) => (
                <div
                  key={cls.id}
                  className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <span className="font-mono-meta text-xs uppercase tracking-[0.14em] text-indigo-600 font-semibold">
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
                        <span>Popular Badge</span>
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
                      <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Children">Children</option>
                        <option value="Teens">Teens</option>
                        <option value="Adults">Adults</option>
                        <option value="All Ages">All Ages</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
                        Format
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
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
          <section className="space-y-8">
            {/* Hero Showcase Video Manager */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Film className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="font-display font-bold text-2xl text-slate-900">
                      Homepage Hero Video
                    </h2>
                    <p className="text-sm text-slate-500">
                      Swap the main looping video at the top of your website anytime — upload a clip or paste a YouTube / MP4 link.
                    </p>
                  </div>
                </div>

                {content.profile.heroVideoUrl?.trim() && (
                  <button
                    type="button"
                    onClick={() => void handleResetHeroVideo()}
                    disabled={saving || heroUploading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Default</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-5">
                  <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                    {content.profile.heroVideoUrl?.trim() &&
                    extractYouTubeId(content.profile.heroVideoUrl) ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(
                          content.profile.heroVideoUrl
                        )}?autoplay=0&mute=1&controls=1&rel=0`}
                        title="Homepage hero video preview"
                        className="w-full h-full"
                      />
                    ) : (
                      <video
                        key={content.profile.heroVideoUrl || "default-hero"}
                        src={
                          content.profile.heroVideoUrl?.trim() ||
                          "/videos/piano-loop.mp4"
                        }
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        controls
                      />
                    )}
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold uppercase tracking-[0.1em] cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {heroUploading
                          ? `Uploading ${heroUploadPct}%...`
                          : "Upload Video (.mp4 / .webm)"}
                      </span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        disabled={heroUploading}
                        onChange={(e) => void handleHeroVideoUpload(e)}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-slate-500">
                      Best under 50 MB (short 5–20s muted clips load fastest).
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
                      Or Paste YouTube / Direct Video URL (leave blank for default)
                    </label>
                    <input
                      type="url"
                      value={content.profile.heroVideoUrl || ""}
                      onChange={(e) =>
                        updateContent((prev) => ({
                          ...prev,
                          profile: {
                            ...prev.profile,
                            heroVideoUrl: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-3xl text-slate-900">
                  YouTube Videos
                </h2>
                <p className="text-sm text-slate-500">
                  Paste any YouTube link — thumbnails and embedded playback work automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setModalError("");
                  setVideoDraft(createEmptyVideoDraft());
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer shadow-sm"
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
                    className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                  >
                    <div className="lg:col-span-4 space-y-2">
                      <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={vid.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-4 text-xs text-slate-400">
                            Paste a YouTube link to preview thumbnail
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] font-mono-meta text-slate-500">
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
                          <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                          >
                            <option value="Tutorial">Tutorial</option>
                            <option value="Practice Tip">Practice Tip</option>
                            <option value="Performance">Performance</option>
                            <option value="Student Showcase">Student Showcase</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
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

        {/* TAB 3: STUDIO PROFILE & PIN */}
        {activeTab === "studio" && (
          <section className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-3xl text-slate-900">
                Studio & Contact
              </h2>
              <p className="text-sm text-slate-500">
                Update contact numbers, social links, and PIN security.
              </p>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Security: Change 6-Digit PIN */}
            <form
              onSubmit={handleChangePin}
              className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-xl bg-slate-900 text-indigo-300 flex items-center justify-center shrink-0">
                  <KeyRound className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-2xl text-slate-900">
                    Studio Security · Change 6-Digit PIN
                  </h3>
                  <p className="text-sm text-slate-500">
                    Set your own private 6-digit PIN anytime. It is encrypted privately in the cloud and never stored in source code.
                  </p>
                </div>
              </div>

              {pinMessage && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm border ${
                    pinMessage.type === "success"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : "bg-red-50 border-red-200 text-red-900"
                  }`}
                >
                  {pinMessage.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
                    Current 6-Digit PIN
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={currentPin}
                    onChange={(e) =>
                      setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono-meta tracking-[0.25em]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
                    New 6-Digit PIN
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) =>
                      setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono-meta tracking-[0.25em]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono-meta uppercase text-slate-500 mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) =>
                      setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono-meta tracking-[0.25em]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pinSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-[#4F46E5] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{pinSaving ? "Updating PIN..." : "Update 6-Digit PIN"}</span>
              </button>
            </form>
          </section>
        )}
      </main>

      {/* POPUP MODAL: ADD CLASS */}
      {classDraft && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add New Class"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setClassDraft(null)}
        >
          <form
            onSubmit={handleCreateClass}
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-5"
          >
            <button
              type="button"
              aria-label="Close popup"
              onClick={() => setClassDraft(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
                New Class
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                Add a Piano Class
              </h3>
            </div>

            {modalError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {modalError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={classDraft.title}
                  onChange={(e) =>
                    setClassDraft({ ...classDraft, title: e.target.value })
                  }
                  placeholder="e.g. Saturday Kids Keyboard Club"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age Group
                </label>
                <select
                  value={classDraft.ageGroup}
                  onChange={(e) =>
                    setClassDraft({
                      ...classDraft,
                      ageGroup: e.target.value as AgeGroup,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Children">Children</option>
                  <option value="Teens">Teens</option>
                  <option value="Adults">Adults</option>
                  <option value="All Ages">All Ages</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Level
                </label>
                <select
                  value={classDraft.level}
                  onChange={(e) =>
                    setClassDraft({
                      ...classDraft,
                      level: e.target.value as SkillLevel,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={classDraft.duration}
                  onChange={(e) =>
                    setClassDraft({ ...classDraft, duration: e.target.value })
                  }
                  placeholder="45 min / 60 min"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Format
                </label>
                <input
                  type="text"
                  value={classDraft.format}
                  onChange={(e) =>
                    setClassDraft({ ...classDraft, format: e.target.value })
                  }
                  placeholder="In-Person · Entebbe"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={classDraft.summary}
                  onChange={(e) =>
                    setClassDraft({ ...classDraft, summary: e.target.value })
                  }
                  placeholder="What will students learn and enjoy in this class?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Highlights (one per line)
                </label>
                <textarea
                  rows={3}
                  value={classDraft.highlights.join("\n")}
                  onChange={(e) =>
                    setClassDraft({
                      ...classDraft,
                      highlights: e.target.value.split("\n"),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={classDraft.published}
                  onChange={(e) =>
                    setClassDraft({ ...classDraft, published: e.target.checked })
                  }
                />
                <span>Publish immediately on website</span>
              </label>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setClassDraft(null)}
                  className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold uppercase tracking-[0.1em] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save & Publish Class"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* POPUP MODAL: ADD VIDEO */}
      {videoDraft && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Add New Video"
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setVideoDraft(null)}
        >
          <form
            onSubmit={handleCreateVideo}
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative space-y-5"
          >
            <button
              type="button"
              aria-label="Close popup"
              onClick={() => setVideoDraft(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold mb-2">
                New Video
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                Add a YouTube Video
              </h3>
            </div>

            {modalError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {modalError}
              </div>
            )}

            {/* Live thumbnail preview right inside the popup */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
              {draftThumb ? (
                <img
                  src={draftThumb}
                  alt={videoDraft.title || "Video preview"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-xs text-slate-400 px-4 text-center">
                  Paste a YouTube link below to preview the thumbnail automatically
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  YouTube Link
                </label>
                <input
                  type="url"
                  autoFocus
                  value={videoDraft.youtubeUrl}
                  onChange={(e) =>
                    setVideoDraft({ ...videoDraft, youtubeUrl: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
                {videoDraft.youtubeUrl.trim() && (
                  <p className="text-[11px] font-mono-meta text-slate-500 mt-1">
                    {draftYtId
                      ? `Detected YouTube ID: ${draftYtId}`
                      : "Could not detect valid YouTube ID yet"}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={videoDraft.title}
                  onChange={(e) =>
                    setVideoDraft({ ...videoDraft, title: e.target.value })
                  }
                  placeholder="e.g. Easy Worship Chords in C Major"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={videoDraft.category}
                  onChange={(e) =>
                    setVideoDraft({
                      ...videoDraft,
                      category: e.target.value as VideoCategory,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Tutorial">Tutorial</option>
                  <option value="Practice Tip">Practice Tip</option>
                  <option value="Performance">Performance</option>
                  <option value="Student Showcase">Student Showcase</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration Label
                </label>
                <input
                  type="text"
                  value={videoDraft.duration}
                  onChange={(e) =>
                    setVideoDraft({ ...videoDraft, duration: e.target.value })
                  }
                  placeholder="5 min"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={videoDraft.description}
                  onChange={(e) =>
                    setVideoDraft({ ...videoDraft, description: e.target.value })
                  }
                  placeholder="What will viewers learn in this clip?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={videoDraft.published}
                  onChange={(e) =>
                    setVideoDraft({ ...videoDraft, published: e.target.checked })
                  }
                />
                <span>Publish immediately on website</span>
              </label>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setVideoDraft(null)}
                  className="px-4 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold uppercase tracking-[0.1em] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving..." : "Save & Publish Video"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
