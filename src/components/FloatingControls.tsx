"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Pause, Play } from "lucide-react";

interface FloatingControlsProps {
  whatsappDigits: string;
  teacherName: string;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

export default function FloatingControls({
  whatsappDigits,
  teacherName,
  isMusicPlaying,
  onToggleMusic,
}: FloatingControlsProps) {
  const [showMusicPill, setShowMusicPill] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowMusicPill(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waHref = `https://wa.me/${whatsappDigits.replace(
    /[^\d]/g,
    ""
  )}?text=${encodeURIComponent(
    `Hi ${teacherName}, I found you on your website and I'd love to learn piano!`
  )}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex items-center gap-2.5">
      {(showMusicPill || isMusicPlaying) && (
        <button
          type="button"
          onClick={onToggleMusic}
          aria-label={isMusicPlaying ? "Pause studio music" : "Play studio music"}
          title={isMusicPlaying ? "Pause Studio Music" : "Play Studio Music"}
          className="w-11 h-11 rounded-full bg-slate-900/90 hover:bg-[#4F46E5] text-white border border-white/15 shadow-lg backdrop-blur-md flex items-center justify-center cursor-pointer transition-all"
        >
          {isMusicPlaying ? (
            <Pause className="w-4 h-4 text-amber-400" />
          ) : (
            <Play className="w-4 h-4 text-amber-400 ml-0.5" />
          )}
        </button>
      )}

      {whatsappDigits && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xl shadow-[#25D366]/30 flex items-center justify-center transition-transform hover:scale-105"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
        </a>
      )}
    </div>
  );
}
