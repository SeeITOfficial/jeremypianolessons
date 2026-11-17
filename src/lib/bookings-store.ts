import fs from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";
import type { BookingItem, BookingStatus, StudioProfile } from "./types";

const LOCAL_BOOKINGS_PATH = path.join(process.cwd(), ".bookings.local.json");
const BLOB_BOOKINGS_PATH = "studio/bookings.json";

function hasBlobStorage(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      (process.env.VERCEL_OIDC_TOKEN?.trim() && process.env.BLOB_STORE_ID?.trim())
  );
}

export async function getBookings(): Promise<BookingItem[]> {
  if (hasBlobStorage()) {
    try {
      const result = await get(BLOB_BOOKINGS_PATH, {
        access: "private",
        useCache: false,
      });
      if (result && result.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        const parsed = JSON.parse(text) as BookingItem[];
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (err) {
      console.error("Failed to load bookings from studio store:", err);
      return [];
    }
  }

  try {
    const raw = await fs.readFile(LOCAL_BOOKINGS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as BookingItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveBookings(bookings: BookingItem[]): Promise<void> {
  const formatted = JSON.stringify(bookings, null, 2) + "\n";

  if (hasBlobStorage()) {
    await put(BLOB_BOOKINGS_PATH, formatted, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  if (!process.env.VERCEL) {
    await fs.writeFile(LOCAL_BOOKINGS_PATH, formatted, "utf-8");
  }
}

export async function addBooking(
  input: Omit<BookingItem, "id" | "status" | "createdAt">
): Promise<BookingItem> {
  const existing = await getBookings();
  const created: BookingItem = {
    ...input,
    id: `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  await saveBookings([created, ...existing]);
  return created;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus
): Promise<BookingItem[] | null> {
  const existing = await getBookings();
  const idx = existing.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const updated = existing.map((b) => (b.id === id ? { ...b, status } : b));
  await saveBookings(updated);
  return updated;
}

export async function deleteBooking(id: string): Promise<BookingItem[]> {
  const existing = await getBookings();
  const updated = existing.filter((b) => b.id !== id);
  await saveBookings(updated);
  return updated;
}

export function getAlertConfigurationStatus() {
  return {
    emailConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
    whatsappConfigured: Boolean(process.env.CALLMEBOT_API_KEY?.trim()),
    webhookConfigured: Boolean(process.env.BOOKING_WEBHOOK_URL?.trim()),
  };
}

export async function sendBookingAlerts(
  booking: BookingItem,
  profile: StudioProfile
): Promise<{
  emailSent: boolean;
  whatsappSent: boolean;
}> {
  let emailSent = false;
  let whatsappSent = false;

  const summaryLines = [
    `New Piano Lesson Booking!`,
    `Name: ${booking.name}`,
    `Phone / WhatsApp: ${booking.phone}`,
    booking.email ? `Email: ${booking.email}` : null,
    booking.ageGroup ? `Age Group: ${booking.ageGroup}` : null,
    booking.classTrack ? `Class: ${booking.classTrack}` : null,
    booking.preferredTime ? `Preferred Time: ${booking.preferredTime}` : null,
    booking.notes ? `Notes: ${booking.notes}` : null,
    `Manage in Admin: https://jeremypianolessons.vercel.app/admin`,
  ].filter(Boolean) as string[];

  const tasks: Array<Promise<void>> = [];

  // 1. Automatic Email Alert via Resend
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const adminEmail = profile.email?.trim();
  if (resendKey && adminEmail) {
    const fromAddr =
      process.env.ALERT_FROM_EMAIL?.trim() ||
      "Jeremy Piano Studio <onboarding@resend.dev>";

    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddr,
          to: [adminEmail],
          subject: `New Piano Lesson Request from ${booking.name}`,
          text: summaryLines.join("\n"),
        }),
        signal: AbortSignal.timeout(5000),
      })
        .then((res) => {
          if (res.ok) emailSent = true;
        })
        .catch((err) => {
          console.error("Email alert failed:", err);
        })
    );
  }

  // 2. Automatic WhatsApp Alert via CallMeBot
  const callmebotKey = process.env.CALLMEBOT_API_KEY?.trim();
  const adminWa = (
    process.env.ALERT_WHATSAPP_NUMBER?.trim() || profile.whatsappPrimary
  ).replace(/[^\d]/g, "");

  if (callmebotKey && adminWa) {
    const waText = summaryLines.join("\n");
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
      adminWa
    )}&text=${encodeURIComponent(waText)}&apikey=${encodeURIComponent(
      callmebotKey
    )}`;

    tasks.push(
      fetch(url, { signal: AbortSignal.timeout(5000) })
        .then((res) => {
          if (res.ok) whatsappSent = true;
        })
        .catch((err) => {
          console.error("WhatsApp alert failed:", err);
        })
    );
  }

  // 3. Optional Custom Webhook
  const webhookUrl = process.env.BOOKING_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    tasks.push(
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking, studio: profile.brandName }),
        signal: AbortSignal.timeout(5000),
      })
        .then(() => undefined)
        .catch((err) => {
          console.error("Webhook alert failed:", err);
        })
    );
  }

  await Promise.allSettled(tasks);
  return { emailSent, whatsappSent };
}
