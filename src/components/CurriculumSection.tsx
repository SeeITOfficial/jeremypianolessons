"use client";

import { useCallback, useRef, useState } from "react";
import { Music2, Volume2 } from "lucide-react";

const GAINS = [
  {
    num: "01",
    title: "Technique & Healthy Posture",
    body: "Relaxed wrists, curved fingers, and clean coordination from day one.",
  },
  {
    num: "02",
    title: "Sheet Reading & Music Theory",
    body: "Read treble and bass clefs naturally and understand the harmony behind every piece.",
  },
  {
    num: "03",
    title: "Ear Training & Gospel Chords",
    body: "Recognize progressions by ear, voice rich chords, and accompany singers smoothly.",
  },
  {
    num: "04",
    title: "Creativity & Improvisation",
    body: "Move beyond memorizing notes to phrasing, dynamics, and making songs your own.",
  },
  {
    num: "05",
    title: "Stage & Recital Confidence",
    body: "Calm, steady performance habits built through supportive studio feedback.",
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

const CHORDS = [
  { name: "C Maj7", notes: ["C4", "E4", "G4", "B4"] },
  { name: "Am7", notes: ["A4", "C5", "E4", "G4"] },
  { name: "F Maj7", notes: ["F4", "A4", "C5", "E4"] },
  { name: "G6", notes: ["G4", "B4", "D4", "E4"] },
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
      master.gain.exponentialRampToValueAtTime(0.0008, now + 1.35);
      master.connect(ctx.destination);

      // Warm piano-like harmonic blend (fundamental + soft 2nd & 3rd overtones)
      const osc1 = ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(freq, now);

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2, now);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.28, now);

      osc1.connect(master);
      osc2.connect(gain2);
      gain2.connect(master);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.4);
      osc2.stop(now + 1.4);

      setActiveNotes((prev) =>
        prev.includes(noteName) ? prev : [...prev, noteName]
      );
      setTimeout(() => {
        setActiveNotes((prev) => prev.filter((n) => n !== noteName));
      }, 320);
    } catch {
      // Ignore audio context errors if browser blocks audio
    }
  }, []);

  const playChord = (notes: string[]) => {
    notes.forEach((n, idx) => {
      const found = KEYS.find((k) => k.note === n);
      if (found) {
        setTimeout(() => playTone(found.note, found.freq), idx * 45);
      }
    });
  };

  const whiteKeys = KEYS.filter((k) => !k.isBlack);

  return (
    <section
      id="curriculum"
      className="py-20 sm:py-28 bg-[#14110F] text-[#FAF6F0]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: 5 Core Outcomes */}
          <div className="lg:col-span-6">
            <span className="inline-block text-xs font-mono-meta uppercase tracking-[0.2em] text-[#E5A989] mb-3">
              What You’ll Master
            </span>
            <h2 className="font-serif-display text-4xl sm:text-5xl leading-[1.08] mb-10">
              Skills that last{" "}
              <em className="italic text-[#C87A53]">a lifetime</em>
            </h2>

            <div className="divide-y divide-white/10 border-t border-b border-white/10">
              {GAINS.map((item) => (
                <div key={item.num} className="py-5 flex gap-5 items-start">
                  <span className="font-serif-display text-2xl sm:text-3xl text-[#C87A53] leading-none w-9 shrink-0 pt-0.5">
                    {item.num}
                  </span>
                  <div>
                    <h3 className="font-serif-display text-xl text-[#FAF6F0] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#FAF6F0]/65 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Interactive Mini Piano + Styles Offered */}
          <div className="lg:col-span-6 space-y-6">
            {/* Playable Soundboard Card */}
            <div className="rounded-2xl sm:rounded-3xl bg-[#1E1916] border border-white/10 p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono-meta uppercase tracking-[0.16em] text-[#E5A989]">
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Interactive Sound Check</span>
                  </div>
                  <h3 className="font-serif-display text-2xl sm:text-3xl mt-1">
                    Tap the keys or try a chord
                  </h3>
                </div>
              </div>

              {/* Chord Presets */}
              <div className="flex flex-wrap gap-2 mb-6">
                {CHORDS.map((chord) => (
                  <button
                    key={chord.name}
                    type="button"
                    onClick={() => playChord(chord.notes)}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#C87A53] border border-white/15 hover:border-[#C87A53] text-xs font-mono-meta text-[#FAF6F0] transition-colors cursor-pointer"
                  >
                    ♪ {chord.name}
                  </button>
                ))}
              </div>

              {/* Playable 1-Octave Piano */}
              <div className="relative select-none bg-[#14110F] p-3 rounded-2xl border border-white/10">
                <div className="relative grid grid-cols-8 gap-1.5 h-40 sm:h-48">
                  {whiteKeys.map((key) => {
                    const isActive = activeNotes.includes(key.note);
                    return (
                      <button
                        key={key.note}
                        type="button"
                        onPointerDown={() => playTone(key.note, key.freq)}
                        className={`relative rounded-b-lg rounded-t-sm flex items-end justify-center pb-2.5 text-[11px] font-mono-meta transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#E5A989] text-[#14110F] translate-y-0.5"
                            : "bg-[#FAF6F0] hover:bg-[#F2EAE0] text-[#6E5A4F]"
                        }`}
                      >
                        {key.label}
                      </button>
                    );
                  })}

                  {/* Black keys positioned accurately above C-D, D-E, F-G, G-A, A-B */}
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
                        className={`absolute top-0 w-[8.5%] h-[60%] rounded-b-md border border-white/10 shadow-md z-10 transition-all cursor-pointer ${
                          isActive
                            ? "bg-[#C87A53] translate-y-0.5"
                            : "bg-[#1B1613] hover:bg-[#2F2722]"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-[#FAF6F0]/50 mt-4">
                Built with live Web Audio synthesis — try tapping the progression{" "}
                <span className="text-[#E5A989]">C Maj7 → Am7 → F Maj7 → G6</span>.
              </p>
            </div>

            {/* Primary Instrument & Styles Card */}
            <div className="rounded-2xl bg-[#C87A53]/12 border border-[#C87A53]/35 p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#C87A53] text-white flex items-center justify-center shrink-0">
                  <Music2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-serif-display text-2xl text-[#FAF6F0]">
                    Piano & Keyboard
                  </div>
                  <div className="text-xs sm:text-sm text-[#FAF6F0]/70 mt-0.5">
                    Classical · Contemporary · Gospel · Pop · Ear Training
                  </div>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#C87A53] text-white text-[10px] font-mono-meta uppercase tracking-[0.14em]">
                Primary Focus
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
