"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallAdminButton() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // Register service worker for PWA installability on /admin
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;

    if (standalone) {
      setIsInstalled(true);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowGuideModal(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>App Installed</span>
      </span>
    );
  }

  const handleClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      return;
    }

    setShowGuideModal(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-[0.1em] transition-colors cursor-pointer shadow-sm"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>

      {showGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Install Studio Admin App"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 text-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/15 shadow-2xl relative space-y-4"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/icon-192.png"
                alt="Studio Admin"
                className="w-11 h-11 rounded-full"
              />
              <div>
                <h3 className="font-display font-bold text-xl">
                  Install Studio Admin
                </h3>
                <p className="text-xs text-slate-400">
                  Add to your phone or desktop home screen
                </p>
              </div>
            </div>

            {isIos ? (
              <ol className="space-y-2.5 text-sm text-slate-300 list-decimal list-inside">
                <li>
                  Tap the{" "}
                  <span className="inline-flex items-center gap-1 font-semibold text-white">
                    <Share className="w-3.5 h-3.5 text-indigo-400" /> Share
                  </span>{" "}
                  button in Safari.
                </li>
                <li>
                  Scroll down and tap{" "}
                  <strong className="text-white">Add to Home Screen</strong>.
                </li>
                <li>
                  Tap <strong className="text-white">Add</strong> — Studio Admin
                  opens like a native app.
                </li>
              </ol>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed">
                Open your browser menu (<strong>⋮</strong> or install icon in
                the address bar) and choose{" "}
                <strong className="text-white">
                  Install Jeremy Studio Admin
                </strong>{" "}
                or <strong className="text-white">Add to Home Screen</strong>.
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold uppercase tracking-[0.12em] cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
}
