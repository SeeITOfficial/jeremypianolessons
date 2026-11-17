"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ClassItem, SiteContent } from "@/lib/types";
import Navbar from "./Navbar";
import Hero from "./Hero";
import AboutSection from "./AboutSection";
import ClassesSection from "./ClassesSection";
import CurriculumSection from "./CurriculumSection";
import VideosSection from "./VideosSection";
import ArticlesSection from "./ArticlesSection";
import TestimonialsSection from "./TestimonialsSection";
import FaqSection from "./FaqSection";
import BookingSection from "./BookingSection";
import Footer from "./Footer";
import FloatingControls from "./FloatingControls";

interface PublicSiteProps {
  content: SiteContent;
}

export default function PublicSite({ content }: PublicSiteProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [preselectedClassTitle, setPreselectedClassTitle] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsMusicPlaying(true);
    const handlePause = () => setIsMusicPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
    };
  }, []);

  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch {
      setIsMusicPlaying(false);
    }
  }, []);

  const handleSelectClassForBooking = useCallback((classItem: ClassItem) => {
    setPreselectedClassTitle(classItem.title);
    const target = document.getElementById("booking");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar profile={content.profile} />

      <main className="flex-1">
        <Hero
          profile={content.profile}
          isMusicPlaying={isMusicPlaying}
          onToggleMusic={toggleMusic}
        />

        <AboutSection profile={content.profile} />

        <ClassesSection
          classes={content.classes}
          onSelectClassForBooking={handleSelectClassForBooking}
        />

        <CurriculumSection />

        <VideosSection videos={content.videos} profile={content.profile} />

        <ArticlesSection articles={content.articles} />

        <TestimonialsSection testimonials={content.testimonials} />

        <FaqSection faqs={content.faqs} />

        <BookingSection
          profile={content.profile}
          classes={content.classes}
          preselectedClassTitle={preselectedClassTitle}
        />
      </main>

      <Footer profile={content.profile} />

      <FloatingControls
        whatsappDigits={content.profile.whatsappPrimary}
        teacherName={content.profile.teacherName}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
      />

      <audio ref={audioRef} loop preload="none">
        <source src="/audio/jazz.mp3" type="audio/mpeg" />
        <source src="/audio/jazz.ogg" type="audio/ogg" />
      </audio>
    </div>
  );
}
