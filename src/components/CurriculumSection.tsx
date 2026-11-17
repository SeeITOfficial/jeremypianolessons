"use client";

import { useCallback, useRef, useState } from "react";
import { Award, Ear, FileMusic, Hand, Music, Music2, Sparkles, Volume2 } from "lucide-react";

const LEARNING_HIGHLIGHTS = [
  {
    Icon: Hand,
    color: "text-indigo-400 bg-indigo-500/15 border-indigo-500/25",
    title: "Comfortable Hands",
    body: "Natural posture and relaxed finger control from day one.",
  },
  {
    Icon: Ear,
    color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
    title: "Play by Ear",
    body: "Recognize melodies and gospel progressions naturally.",
  },
  {
    Icon: FileMusic,
    color: "text-amber-400 bg-amber-500/15 border-amber-500/25",
    title: "Sheet Reading",
    body: "Read notes step-by-step without guesswork.",
  },
  {
    Icon: Award,
    color: "text-rose-400 bg-rose-500/15 border-rose-500/25",
    title: "Performance Ready",
    body: "Build steady confidence for home, school, or church.",
  },
];

interface KeyDef {
  note: string;
  freq: number;
  isBlack: boolean;
  label: string;
}

const KEYS: KeyDef[] = [
  { note: "C4", freq: 261.63, isBlack: false, label: "C" },
  { note: "C#4", freq: 277.18, isBlack: true, label: "C#" },
  { note: "D4", freq: 293.66, isBlack: false, label: "D" },
  { note: "D#4", freq: 311.13, isBlack: true, label: "D#" },
  { note: "E4", freq: 329.63, isBlack: false, label: "E" },
  { note: "F4", freq: 349.23, isBlack: false, label: "F" },
  { note: "F#4", freq: 369.99, isBlack: true, label: "F#" },
  { note: "G4", freq: 392.0, isBlack: false, label: "G" },
  { note: "G#4", freq: 415.3, isBlack: true, label: "G#" },
  { note: "A4", freq: 440.0, isBlack: false, label: "A" },
  { note: "A#4", freq: 466.16, isBlack: true, label: "A#" },
  { note: "B4", freq: 493.88, isBlack: false, label: "B" },
  { note: "C5", freq: 523.25, isBlack: false, label: "C5" },
];

const QUICK_PATTERNS = [
  { label: "Warm Riff", notes: ["C4", "E4", "G4", "C5", "G4", "C5"], gapMs: 160 },
  { label: "Worship Chord", notes: ["C4", "E4", "G4", "B4"], gapMs: 55 },
  { label: "F Maj7", notes: ["F4", "A4", "C5", "E4"], gapMs: 55 },
  { label: "Am7", notes: ["A4", "C5", "E4", "G4"], gapMs: 55 },
];

export default function CurriculumSection() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [activeNotes, setActiveNotes] = useState<string[]>([]);

  const playTone = useCallback((noteName: string, freq: number) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }

      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, now);
      master.gain.exponentialRampToValueAtTime(0.24, now + 0.015);
      master.gain.exponentialRampToValueAtTime(0.0008, now + 1.2);
      master.connect(ctx.destination);

      const osc1 = ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(freq, now);

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2, now);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.25, now);

      osc1.connect(master);
      osc2.connect(gain2);
      gain2.connect(master);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.25);
      osc2.stop(now + 1.25);

      setActiveNotes((prev) =>
        prev.includes(noteName) ? prev : [...prev, noteName]
      );
      setTimeout(() => {
        setActiveNotes((prev) => prev.filter((n) => n !== noteName));
      }, 300);
    } catch {
      // Ignore if audio context blocked
    }
  }, []);

  const playPattern = (notes: string[], gapMs: number) => {
    notes.forEach((n, idx) => {
      const found = KEYS.find((k) => k.note === n);
      if (found) {
        setTimeout(() => playTone(found.note, found.freq), idx * gapMs);
      }
    });
  };

  const whiteKeys = KEYS.filter((k) => !k.isBlack);

  return (
    <section
      id="curriculum"
      className="py-16 sm:py-24 bg-[#111116] text-white border-t border-white/5 relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-indigo-500/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Concise Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Sound Lab</span>
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl leading-tight">
              Try your first{" "}
              <span className="text-indigo-400">notes right here</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Tap any key or trigger a chord progression below to test the
              studio soundboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {LEARNING_HIGHLIGHTS.map((item) => {
                const Icon = item.Icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-[#18181F] border border-white/10 p-4"
                  >
                    <span
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center mb-3 ${item.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <h3 className="font-display font-bold text-base text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Playable Soundboard */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#18181F] border border-white/15 p-5 sm:p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Tap a preset or play the keyboard</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-medium text-zinc-300">
                  <Music2 className="w-3 h-3 text-indigo-400" />
                  Classical · Gospel · Pop
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {QUICK_PATTERNS.map((pat) => (
                  <button
                    key={pat.label}
                    type="button"
                    onClick={() => playPattern(pat.notes, pat.gapMs)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-500/20 hover:bg-indigo-500 border border-indigo-400/30 text-xs font-semibold text-indigo-200 hover:text-white transition-all cursor-pointer"
                  >
                    <Music className="w-3 h-3" />
                    <span>{pat.label}</span>
                  </button>
                ))}
              </div>

              <div className="relative select-none bg-[#09090B] p-3 rounded-2xl border border-white/10">
                <div className="relative grid grid-cols-8 gap-1.5 h-44 sm:h-52">
                  {whiteKeys.map((key) => {
                    const isActive = activeNotes.includes(key.note);
                    return (
                      <button
                        key={key.note}
                        type="button"
                        onPointerDown={() => playTone(key.note, key.freq)}
                        className={`relative rounded-b-xl rounded-t-sm flex items-end justify-center pb-3 text-xs font-mono-meta font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-amber-300 text-zinc-950 translate-y-0.5 shadow-inner"
                            : "bg-zinc-100 hover:bg-white text-zinc-500"
                        }`}
                      >
                        {key.label}
                      </button>
                    );
                  })}

                  {[
                    { note: "C#4", freq: 277.18, leftPct: "9.2%" },
                    { note: "D#4", freq: 311.13, leftPct: "21.8%" },
                    { note: "F#4", freq: 369.99, leftPct: "46.8%" },
                    { note: "G#4", freq: 415.3, leftPct: "59.4%" },
                    { note: "A#4", freq: 466.16, leftPct: "72%" },
                  ].map((bk) => {
                    const isActive = activeNotes.includes(bk.note);
                    return (
                      <button
                        key={bk.note}
                        type="button"
                        aria-label={`Play ${bk.note}`}
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          playTone(bk.note, bk.freq);
                        }}
                        style={{ left: bk.leftPct }}
                        className={`absolute top-0 w-[8.5%] h-[58%] rounded-b-lg border border-zinc-700 shadow-lg z-10 transition-all cursor-pointer ${
                          isActive
                            ? "bg-indigo-500 translate-y-0.5"
                            : "bg-zinc-900 hover:bg-zinc-800"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
