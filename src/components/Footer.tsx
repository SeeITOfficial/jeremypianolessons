import Link from "next/link";
import { Lock, Mail, MapPin, MessageCircle, Phone, Youtube } from "lucide-react";
import type { StudioProfile } from "@/lib/types";

interface FooterProps {
  profile: StudioProfile;
}

export default function Footer({ profile }: FooterProps) {
  const year = new Date().getFullYear();
  const waDigits = profile.whatsappPrimary.replace(/[^\d]/g, "");

  return (
    <footer className="bg-[#14110F] text-[#FAF6F0] pt-16 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5 space-y-4">
            <div className="font-serif-display text-3xl">
              {profile.brandName}
            </div>
            <p className="text-sm text-[#FAF6F0]/65 max-w-sm leading-relaxed">
              Private 1-on-1 piano coaching in {profile.location}. Building
              technique, musical confidence, and lifelong joy at the keyboard.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {waDigits && (
                <a
                  href={`https://wa.me/${waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/15 hover:border-[#25D366] text-xs text-[#FAF6F0]/80 hover:text-[#25D366] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
              {profile.youtubeChannelUrl && (
                <a
                  href={profile.youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/15 hover:border-[#C87A53] text-xs text-[#FAF6F0]/80 hover:text-[#E5A989] transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>YouTube</span>
                </a>
              )}
              {profile.instagramUrl && (
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3.5 py-2 rounded-full border border-white/15 hover:border-[#C87A53] text-xs text-[#FAF6F0]/80 hover:text-[#E5A989] transition-colors"
                >
                  Instagram
                </a>
              )}
              {profile.facebookUrl && (
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3.5 py-2 rounded-full border border-white/15 hover:border-[#C87A53] text-xs text-[#FAF6F0]/80 hover:text-[#E5A989] transition-colors"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono-meta uppercase tracking-[0.16em] text-[#E5A989]">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF6F0]/70">
              <li>
                <a href="#classes" className="hover:text-[#E5A989]">
                  Classes & Tracks
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-[#E5A989]">
                  Curriculum & Sound Check
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#E5A989]">
                  About {profile.teacherName}
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-[#E5A989]">
                  Video Lessons
                </a>
              </li>
              <li>
                <a href="#guides" className="hover:text-[#E5A989]">
                  Practice Guides
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-[#E5A989]">
                  Book a Trial Lesson
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono-meta uppercase tracking-[0.16em] text-[#E5A989]">
              Studio Contact
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FAF6F0]/70">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C87A53] shrink-0" />
                <span>{profile.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C87A53] shrink-0" />
                <span>{profile.phoneDisplayPrimary}</span>
              </li>
              {profile.phoneDisplaySecondary && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C87A53] shrink-0" />
                  <span>{profile.phoneDisplaySecondary}</span>
                </li>
              )}
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C87A53] shrink-0" />
                <span className="truncate">{profile.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF6F0]/45">
          <p>
            © {year} {profile.brandName} · {profile.location}. All rights
            reserved.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-[#FAF6F0]/55 hover:text-[#E5A989] transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Studio Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
