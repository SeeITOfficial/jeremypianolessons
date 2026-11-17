import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  getAuthStatus,
  isAdminAuthenticated,
  isValidSixDigitPin,
  SESSION_COOKIE_NAME,
  verifyPin,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const [authenticated, status] = await Promise.all([
    isAdminAuthenticated(),
    getAuthStatus(),
  ]);

  return NextResponse.json({
    authenticated,
    ...status,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { pin?: string };
    const pin = typeof body.pin === "string" ? body.pin.trim() : "";

    if (!isValidSixDigitPin(pin)) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit PIN." },
        { status: 400 }
      );
    }

    const result = await verifyPin(pin);
    if (!result.configured) {
      return NextResponse.json(
        { error: "Studio PIN has not been configured on the server yet." },
        { status: 503 }
      );
    }

    if (!result.valid) {
      return NextResponse.json(
        { error: "Incorrect 6-digit PIN." },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const status = await getAuthStatus();
    const res = NextResponse.json({
      authenticated: true,
      ...status,
    });

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ authenticated: false });
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}
