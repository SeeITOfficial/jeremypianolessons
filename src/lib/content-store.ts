import fs from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";
import type { SiteContent } from "./types";

const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "site-content.json");
const BLOB_CONTENT_PATH = "studio/site-content.json";

export type PersistenceMode = "cloud" | "local" | "readonly";

function hasBlobStorage(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      (process.env.VERCEL_OIDC_TOKEN?.trim() && process.env.BLOB_STORE_ID?.trim())
  );
}

export function getPersistenceMode(): PersistenceMode {
  if (hasBlobStorage()) {
    return "cloud";
  }
  if (!process.env.VERCEL) {
    return "local";
  }
  return "readonly";
}

async function readLocalContent(): Promise<SiteContent> {
  const raw = await fs.readFile(LOCAL_DATA_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function getSiteContent(): Promise<SiteContent> {
  if (hasBlobStorage()) {
    try {
      const result = await get(BLOB_CONTENT_PATH, {
        access: "private",
        useCache: false,
      });
      if (result && result.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return JSON.parse(text) as SiteContent;
      }
    } catch (err) {
      console.error("Failed to read from studio store, falling back to bundled JSON:", err);
    }
  }

  return readLocalContent();
}

export interface SaveResult {
  ok: boolean;
  mode: PersistenceMode;
  message: string;
  content: SiteContent;
}

export async function saveSiteContent(nextContent: SiteContent): Promise<SaveResult> {
  const stamped: SiteContent = {
    ...nextContent,
    updatedAt: new Date().toISOString(),
  };

  const formatted = JSON.stringify(stamped, null, 2) + "\n";

  if (hasBlobStorage()) {
    await put(BLOB_CONTENT_PATH, formatted, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });

    if (!process.env.VERCEL) {
      await fs.writeFile(LOCAL_DATA_PATH, formatted, "utf-8").catch(() => {});
    }

    return {
      ok: true,
      mode: "cloud",
      message: "Saved and published live.",
      content: stamped,
    };
  }

  if (!process.env.VERCEL) {
    await fs.writeFile(LOCAL_DATA_PATH, formatted, "utf-8");
    return {
      ok: true,
      mode: "local",
      message: "Saved directly to data/site-content.json.",
      content: stamped,
    };
  }

  return {
    ok: false,
    mode: "readonly",
    message: "Cloud storage is not connected on this deployment. Use Export JSON below.",
    content: stamped,
  };
}
