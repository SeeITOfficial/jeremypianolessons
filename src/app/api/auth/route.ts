import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  isAdminAuthenticated,
  isUsingDefaultPassword,
  SESSION_COOKIE_NAME,
  verifyPasscode,
} from "@/lib/auth";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  return NextResponse.json({
    authenticated,
    usingDefaultPassword: isUsingDefaultPassword(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { passcode?: string };
    const passcode = typeof body.passcode === "string" ? body.passcode : "";

    if (!verifyPasscode(passcode)) {
      return NextResponse.json(
        { error: "Incorrect studio passcode." },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const res = NextResponse.json({
      authenticated: true,
      usingDefaultPassword: isUsingDefaultPassword(),
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
