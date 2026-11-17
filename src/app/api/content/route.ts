import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  getPersistenceMode,
  getSiteContent,
  saveSiteContent,
} from "@/lib/content-store";
import type { SiteContent } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({
      content,
      persistenceMode: getPersistenceMode(),
    });
  } catch (err) {
    console.error("Error loading site content:", err);
    return NextResponse.json(
      { error: "Unable to load studio content." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized. Please sign in to Studio Admin." },
      { status: 401 }
    );
  }

  try {
    const body = (await req.json()) as { content?: SiteContent };
    if (!body?.content || !body.content.profile || !Array.isArray(body.content.classes)) {
      return NextResponse.json(
        { error: "Invalid studio content payload." },
        { status: 400 }
      );
    }

    const result = await saveSiteContent(body.content);
    if (result.ok) {
      revalidatePath("/");
      revalidatePath("/admin");
    }

    return NextResponse.json(result, { status: result.ok ? 200 : 409 });
  } catch (err) {
    console.error("Error saving site content:", err);
    return NextResponse.json(
      { error: "Failed to save studio content." },
      { status: 500 }
    );
  }
}
