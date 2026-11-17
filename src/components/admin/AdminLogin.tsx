"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Lock, Music } from "lucide-react";

interface AdminLoginProps {
  usingDefaultPassword: boolean;
  onSuccess: () => void;
}

export default function AdminLogin({
  usingDefaultPassword,
  onSuccess,
}: AdminLoginProps) {
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Incorrect passcode.");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14110F] text-[#FAF6F0] flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono-meta uppercase tracking-[0.14em] text-[#FAF6F0]/60 hover:text-[#E5A989] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>

        <div className="rounded-3xl bg-[#1E1916] border border-white/10 p-7 sm:p-9 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-[#C87A53] text-white flex items-center justify-center">
              <Music className="w-5 h-5" />
            </span>
            <div>
              <h1 className="font-serif-display text-3xl text-[#FAF6F0]">
                Studio Admin
              </h1>
              <p className="text-xs text-[#FAF6F0]/60">
                Manage classes, YouTube videos, guides & contact info
              </p>
            </div>
          </div>

          {usingDefaultPassword && (
            <div className="rounded-xl bg-[#C87A53]/15 border border-[#C87A53]/35 px-4 py-3 text-xs text-[#E5A989] leading-relaxed">
              Default passcode active (<code className="font-mono-meta">jeremy-piano-2026</code>). Set{" "}
              <code className="font-mono-meta">ADMIN_PASSWORD</code> in your
              Vercel environment variables before sharing live.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-950/60 border border-red-500/40 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="admin-passcode"
                className="block text-[11px] font-mono-meta uppercase tracking-[0.14em] text-[#FAF6F0]/70 mb-2"
              >
                Studio Passcode
              </label>
              <div className="relative">
                <input
                  id="admin-passcode"
                  type={showPasscode ? "text" : "password"}
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter your studio passcode"
                  className="w-full px-4 py-3.5 pr-11 rounded-xl bg-[#14110F] border border-white/15 focus:border-[#C87A53] focus:outline-none text-[#FAF6F0]"
                />
                <button
                  type="button"
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                  onClick={() => setShowPasscode((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FAF6F0]/50 hover:text-[#FAF6F0] cursor-pointer"
                >
                  {showPasscode ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#C87A53] hover:bg-[#B56542] disabled:opacity-60 text-white text-xs font-semibold uppercase tracking-[0.14em] transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? "Signing in..." : "Open Studio Admin"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
