import { NextRequest, NextResponse } from "next/server";
import { changePin, isAdminAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in first." },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as {
      currentPin?: string;
      newPin?: string;
    };

    const currentPin =
      typeof body.currentPin === "string" ? body.currentPin.trim() : "";
    const newPin = typeof body.newPin === "string" ? body.newPin.trim() : "";

    const result = await changePin(currentPin, newPin);
    return NextResponse.json(result, { status: result.ok ? 200 : 400 });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 }
    );
  }
}
