import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const requestedPath =
    req.nextUrl.searchParams.get("path") || "studio/hero-video.mp4";

  if (!/^studio\/hero-video\.(mp4|webm|mov)$/.test(requestedPath)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const rangeHeader = req.headers.get("range");
    const result = await get(requestedPath, {
      access: "private",
      useCache: false,
      headers: rangeHeader ? { range: rangeHeader } : undefined,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    const headers = new Headers();
    const contentType =
      result.blob.contentType ||
      (requestedPath.endsWith(".webm") ? "video/webm" : "video/mp4");
    headers.set("Content-Type", contentType);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=300");

    const contentRange = result.headers.get("content-range");
    const contentLength = result.headers.get("content-length");
    if (contentRange) headers.set("Content-Range", contentRange);
    if (contentLength) headers.set("Content-Length", contentLength);

    return new NextResponse(result.stream, {
      status: contentRange ? 206 : 200,
      headers,
    });
  } catch {
    return new NextResponse("Video unavailable", { status: 404 });
  }
}
