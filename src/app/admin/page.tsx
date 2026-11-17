"use client";

import { useCallback, useEffect, useState } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import type { PersistenceMode } from "@/lib/content-store";
import type { BookingItem, SiteContent } from "@/lib/types";

interface AlertStatus {
  emailConfigured: boolean;
  whatsappConfigured: boolean;
  webhookConfigured: boolean;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isLocalFallback, setIsLocalFallback] = useState(false);
  const [content, setContent] = useState<SiteContent | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [alerts, setAlerts] = useState<AlertStatus>({
    emailConfigured: false,
    whatsappConfigured: false,
    webhookConfigured: false,
  });
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
        const [contentRes, bookingsRes] = await Promise.all([
          fetch("/api/content", { cache: "no-store" }),
          fetch("/api/bookings", { cache: "no-store" }),
        ]);

        const contentData = (await contentRes.json()) as {
          content: SiteContent;
          persistenceMode: PersistenceMode;
        };
        setContent(contentData.content);
        setPersistenceMode(contentData.persistenceMode);

        if (bookingsRes.ok) {
          const bookingsData = (await bookingsRes.json()) as {
            bookings: BookingItem[];
            alerts?: AlertStatus;
          };
          setBookings(bookingsData.bookings || []);
          if (bookingsData.alerts) setAlerts(bookingsData.alerts);
        }
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
    setBookings([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex items-center justify-center text-sm font-mono-meta">
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
      initialBookings={bookings}
      initialAlerts={alerts}
      persistenceMode={persistenceMode}
      onLogout={() => void handleLogout()}
    />
  );
}
