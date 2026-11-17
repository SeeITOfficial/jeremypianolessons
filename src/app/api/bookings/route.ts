import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addBooking,
  deleteBooking,
  getAlertConfigurationStatus,
  getBookings,
  sendBookingAlerts,
  updateBookingStatus,
} from "@/lib/bookings-store";
import { getSiteContent } from "@/lib/content-store";
import type { BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [bookings, alerts] = await Promise.all([
    getBookings(),
    Promise.resolve(getAlertConfigurationStatus()),
  ]);

  return NextResponse.json({ bookings, alerts });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      ageGroup?: string;
      classTrack?: string;
      preferredTime?: string;
      notes?: string;
    };

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Please enter your name and phone/WhatsApp number." },
        { status: 400 }
      );
    }

    const booking = await addBooking({
      name: name.slice(0, 120),
      phone: phone.slice(0, 60),
      email:
        typeof body.email === "string" ? body.email.trim().slice(0, 120) : "",
      ageGroup:
        typeof body.ageGroup === "string"
          ? body.ageGroup.trim().slice(0, 60)
          : "",
      classTrack:
        typeof body.classTrack === "string"
          ? body.classTrack.trim().slice(0, 120)
          : "",
      preferredTime:
        typeof body.preferredTime === "string"
          ? body.preferredTime.trim().slice(0, 160)
          : "",
      notes:
        typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) : "",
    });

    const content = await getSiteContent();
    const alertResult = await sendBookingAlerts(booking, content.profile);

    return NextResponse.json(
      {
        ok: true,
        booking,
        alerts: alertResult,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Booking submission failed:", err);
    return NextResponse.json(
      { error: "Unable to submit your booking right now. Please try again." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      id?: string;
      status?: BookingStatus;
    };

    const validStatuses: BookingStatus[] = [
      "new",
      "contacted",
      "scheduled",
      "archived",
    ];
    if (!body.id || !body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Invalid booking status update." },
        { status: 400 }
      );
    }

    const updated = await updateBookingStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    return NextResponse.json({ bookings: updated });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing booking id." }, { status: 400 });
    }

    const bookings = await deleteBooking(id);
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json({ error: "Failed to delete booking." }, { status: 500 });
  }
}
