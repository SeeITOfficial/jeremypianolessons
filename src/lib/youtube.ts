/**
 * Extracts a 11-character YouTube video ID from standard watch, short, embed, or share URLs.
 */
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      const vParam = url.searchParams.get("v");
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }
      const parts = url.pathname.split("/").filter(Boolean);
      const markerIdx = parts.findIndex((p) =>
        ["embed", "shorts", "live", "v"].includes(p)
      );
      if (markerIdx !== -1 && parts[markerIdx + 1]) {
        const candidate = parts[markerIdx + 1];
        return /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
    : null;
}
