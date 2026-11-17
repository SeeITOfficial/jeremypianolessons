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
    <footer className="bg-[#09090B] text-white pt-14 pb-20 sm:pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-3">
            <div className="font-display font-bold text-2xl">
              {profile.brandName}
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Welcoming 1-on-1 piano lessons for children, teens, and adults in{" "}
              {profile.location}.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {waDigits && (
                <a
                  href={`https://wa.me/${waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#18181F] border border-white/10 hover:border-emerald-500/50 text-xs font-medium text-zinc-200 hover:text-emerald-300 transition-colors"
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#18181F] border border-white/10 hover:border-indigo-500/50 text-xs font-medium text-zinc-200 hover:text-indigo-300 transition-colors"
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
                  className="inline-flex items-center px-3.5 py-2 rounded-full bg-[#18181F] border border-white/10 hover:border-indigo-500/50 text-xs font-medium text-zinc-200 hover:text-indigo-300 transition-colors"
                >
                  Instagram
                </a>
              )}
              {profile.facebookUrl && (
                <a
                  href={profile.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3.5 py-2 rounded-full bg-[#18181F] border border-white/10 hover:border-indigo-500/50 text-xs font-medium text-zinc-200 hover:text-indigo-300 transition-colors"
                >
                  Facebook
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <a href="#classes" className="hover:text-white">
                  Classes
                </a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-white">
                  Live Sound Lab
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white">
                  About {profile.teacherName}
                </a>
              </li>
              <li>
                <a href="#videos" className="hover:text-white">
                  Videos
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-white">
                  Book Trial
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{profile.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{profile.phoneDisplayPrimary}</span>
              </li>
              {profile.phoneDisplaySecondary && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{profile.phoneDisplaySecondary}</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{profile.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-zinc-500">
          <p>
            © {year} {profile.brandName} · {profile.location}
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-indigo-300 transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Studio Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
