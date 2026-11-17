"use client";

import { useCallback, useEffect, useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import type { PersistenceMode } from "@/lib/content-store";
import type { SiteContent } from "@/lib/types";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLocalFallback, setIsLocalFallback] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [persistenceMode, setPersistenceMode] =
    useState<PersistenceMode>("local");

  const loadState = useCallback(async () => {
    setLoading(true);
    try {
      const authRes = await fetch("/api/auth", { cache: "no-store" });
      const authData = (await authRes.json()) as {
        authenticated: boolean;
        isLocalFallback: boolean;
      };
      setAuthenticated(authData.authenticated);
      setIsLocalFallback(Boolean(authData.isLocalFallback));

      if (authData.authenticated) {
        const contentRes = await fetch("/api/content", { cache: "no-store" });
        const contentData = (await contentRes.json()) as {
          content: SiteContent;
          persistenceMode: PersistenceMode;
        };
        setContent(contentData.content);
        setPersistenceMode(contentData.persistenceMode);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadState();
  }, [loadState]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
    setContent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#14110F] text-[#FAF6F0] flex items-center justify-center text-sm font-mono-meta">
        Loading Studio Admin...
      </div>
    );
  }

  if (!authenticated || !content) {
    return (
      <AdminLogin
        isLocalFallback={isLocalFallback}
        onSuccess={() => void loadState()}
      />
    );
  }

  return (
    <AdminDashboard
      initialContent={content}
      persistenceMode={persistenceMode}
      onLogout={() => void handleLogout()}
    />
  );
}
