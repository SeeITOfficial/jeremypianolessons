import fs from "fs/promises";
import path from "path";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        const authenticated = await isAdminAuthenticated();
        if (!authenticated) {
          throw new Error("Unauthorized");
        }

        if (!/^studio\/hero-video\.(mp4|webm|mov)$/.test(pathname)) {
          throw new Error("Invalid video pathname");
        }

        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime"],
          maximumSizeInBytes: 50 * 1024 * 1024,
          allowOverwrite: true,
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {
        // Client updates site-content.json via /api/content right after upload resolves.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload setup failed";
    const status = message === "Unauthorized" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PUT(req: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: "Use client blob upload on deployed environments." },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No video file provided." }, { status: 400 });
    }

    const ext = file.name.toLowerCase().endsWith(".webm")
      ? "webm"
      : file.name.toLowerCase().endsWith(".mov")
        ? "mov"
        : "mp4";

    const targetDir = path.join(process.cwd(), "public", "videos");
    await fs.mkdir(targetDir, { recursive: true });
    const filename = `custom-hero.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(targetDir, filename), buffer);

    return NextResponse.json({
      url: `/videos/${filename}?v=${Date.now()}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save local video file." },
      { status: 500 }
    );
  }
}
