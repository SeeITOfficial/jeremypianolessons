"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import type { ClassItem, StudioProfile } from "@/lib/types";

interface BookingSectionProps {
  profile: StudioProfile;
  classes: ClassItem[];
  preselectedClassTitle: string;
}

export default function BookingSection({
  profile,
  classes,
  preselectedClassTitle,
}: BookingSectionProps) {
  const publishedClasses = classes.filter((c) => c.published);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [selectedClass, setSelectedClass] = useState(
    preselectedClassTitle || publishedClasses[0]?.title || "Piano Lessons"
  );
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [formattedSummary, setFormattedSummary] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (preselectedClassTitle) {
      setSelectedClass(preselectedClassTitle);
      setSubmittedUrl(null);
    }
  }, [preselectedClassTitle]);

  const buildWhatsAppPayload = () => {
    const lines = [
      `Hi ${profile.teacherName}! I'd like to book a piano lesson.`,
      `Name: ${name.trim()}`,
      `Phone / WhatsApp: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      ageGroup ? `Student Age Group: ${ageGroup}` : null,
      selectedClass ? `Class Track: ${selectedClass}` : null,
      preferredTime.trim()
        ? `Preferred Days/Times: ${preferredTime.trim()}`
        : null,
      notes.trim() ? `Goals / Notes: ${notes.trim()}` : null,
    ].filter(Boolean);

    return lines.join("\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone/WhatsApp number.");
      return;
    }

    const messageText = buildWhatsAppPayload();
    const waDigits = profile.whatsappPrimary.replace(/[^\d]/g, "");
    const url = `https://wa.me/${waDigits}?text=${encodeURIComponent(
      messageText
    )}`;

    setFormattedSummary(messageText);
    setSubmittedUrl(url);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    if (!formattedSummary) return;
    try {
      await navigator.clipboard.writeText(formattedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const primaryWaDigits = profile.whatsappPrimary.replace(/[^\d]/g, "");
  const secondaryWaDigits = profile.whatsappSecondary.replace(/[^\d]/g, "");

  return (
    <section id="booking" className="py-16 sm:py-24 bg-[#09090B] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Direct Contact */}
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-block px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-emerald-300 text-xs font-semibold">
              Start Learning
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-white leading-tight">
              Book your first trial lesson
            </h2>
            <p className="text-base text-zinc-400 leading-relaxed">
              Send your details below or message {profile.teacherName} directly
              on WhatsApp — we’ll find a comfortable time slot for you.
            </p>

            <div className="rounded-2xl bg-[#111116] border border-white/10 p-4 space-y-2 text-sm text-zinc-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>In-person studio in {profile.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{profile.teachingHours}</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {primaryWaDigits && (
                <a
                  href={`https://wa.me/${primaryWaDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/10 bg-[#111116] hover:border-emerald-500/50 transition-all group"
                >
                  <span className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs font-medium text-zinc-400">
                      WhatsApp · Fastest Response
                    </div>
                    <div className="font-display font-bold text-lg text-white group-hover:text-emerald-300">
                      {profile.phoneDisplayPrimary}
                    </div>
                  </div>
                </a>
              )}

              {secondaryWaDigits && (
                <a
                  href={`tel:+${secondaryWaDigits}`}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/10 bg-[#111116] hover:border-indigo-500/50 transition-all group"
                >
                  <span className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs font-medium text-zinc-400">
                      Call or WhatsApp
                    </div>
                    <div className="font-display font-bold text-lg text-white group-hover:text-indigo-300">
                      {profile.phoneDisplaySecondary}
                    </div>
                  </div>
                </a>
              )}

              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/10 bg-[#111116] hover:border-indigo-500/50 transition-all group"
                >
                  <span className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-zinc-400">
                      Email
                    </div>
                    <div className="font-display font-bold text-base sm:text-lg text-white truncate group-hover:text-indigo-300">
                      {profile.email}
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[#111116] border border-white/10 p-6 sm:p-9 shadow-2xl">
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Request a Lesson
              </h3>
              <p className="text-sm text-zinc-400 mt-1 mb-6">
                Clicking send opens WhatsApp with your details ready for{" "}
                {profile.teacherName}.
              </p>

              {submittedUrl ? (
                <div className="rounded-2xl bg-[#18181F] border border-white/10 p-6 space-y-5">
                  <div className="flex items-start gap-3">
                    <span className="w-9 h-9 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-xl text-white">
                        Your request is ready
                      </h4>
                      <p className="text-sm text-zinc-400 mt-0.5">
                        If WhatsApp didn’t open automatically, tap below or copy
                        your message.
                      </p>
                    </div>
                  </div>

                  <pre className="text-xs font-mono-meta bg-[#09090B] rounded-xl p-4 whitespace-pre-wrap text-zinc-300 border border-white/10">
                    {formattedSummary}
                  </pre>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={submittedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold transition-colors"
                    >
                      <span>Open WhatsApp Chat</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-zinc-950 text-xs font-semibold cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? "Copied!" : "Copy Details"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmittedUrl(null)}
                      className="inline-flex items-center px-4 py-3 rounded-full border border-white/20 text-zinc-300 text-xs font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-950/60 border border-red-500/40 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-xs font-semibold text-zinc-300 mb-1.5"
                    >
                      Your Name *
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Nakato"
                      className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="booking-phone"
                        className="block text-xs font-semibold text-zinc-300 mb-1.5"
                      >
                        Phone / WhatsApp *
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+256 7XX XXX XXX"
                        className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder:text-zinc-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="booking-email"
                        className="block text-xs font-semibold text-zinc-300 mb-1.5"
                      >
                        Email (Optional)
                      </label>
                      <input
                        id="booking-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder:text-zinc-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="booking-age"
                        className="block text-xs font-semibold text-zinc-300 mb-1.5"
                      >
                        Who is learning?
                      </label>
                      <select
                        id="booking-age"
                        value={ageGroup}
                        onChange={(e) => setAgeGroup(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-white/10 focus:border-indigo-500 focus:outline-none text-white"
                      >
                        <option value="">Select age group...</option>
                        <option value="Child (under 12)">
                          Child (under 12)
                        </option>
                        <option value="Teen (12–17)">Teen (12–17)</option>
                        <option value="Adult (18+)">Adult (18+)</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="booking-class"
                        className="block text-xs font-semibold text-zinc-300 mb-1.5"
                      >
                        Class / Track
                      </label>
                      <select
                        id="booking-class"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-white/10 focus:border-indigo-500 focus:outline-none text-white"
                      >
                        {publishedClasses.map((cls) => (
                          <option key={cls.id} value={cls.title}>
                            {cls.title} ({cls.ageGroup})
                          </option>
                        ))}
                        <option value="Not sure yet — recommend for me">
                          Not sure yet — recommend for me
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="booking-time"
                      className="block text-xs font-semibold text-zinc-300 mb-1.5"
                    >
                      Preferred Days / Times
                    </label>
                    <input
                      id="booking-time"
                      type="text"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      placeholder="e.g. After school, weekday evenings, Saturday morning"
                      className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-notes"
                      className="block text-xs font-semibold text-zinc-300 mb-1.5"
                    >
                      Goals or Questions
                    </label>
                    <textarea
                      id="booking-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Total beginner? Interested in gospel, pop, or classical?"
                      className="w-full px-4 py-3 rounded-xl bg-[#18181F] border border-white/10 focus:border-indigo-500 focus:outline-none text-white placeholder:text-zinc-500 resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-colors cursor-pointer shadow-lg shadow-indigo-500/20"
                  >
                    <span>Send Request via WhatsApp</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
