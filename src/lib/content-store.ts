import fs from "fs/promises";
import path from "path";
import type { SiteContent } from "./types";

const LOCAL_DATA_PATH = path.join(process.cwd(), "data", "site-content.json");
const DEFAULT_GITHUB_REPO = "SeeITOfficial/jeremypianolessons";
const DEFAULT_GITHUB_BRANCH = "main";
const GITHUB_FILE_PATH = "data/site-content.json";

export type PersistenceMode = "local" | "github" | "readonly";

export function getPersistenceMode(): PersistenceMode {
  if (process.env.GITHUB_TOKEN?.trim()) {
    return "github";
  }
  if (!process.env.VERCEL) {
    return "local";
  }
  return "readonly";
}

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN?.trim();
  const repo = process.env.GITHUB_REPO?.trim() || DEFAULT_GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH?.trim() || DEFAULT_GITHUB_BRANCH;
  return { token, repo, branch };
}

async function readLocalContent(): Promise<SiteContent> {
  const raw = await fs.readFile(LOCAL_DATA_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

async function readGitHubContent(): Promise<SiteContent | null> {
  const { token, repo, branch } = getGitHubConfig();
  if (!token) return null;

  const url = `https://api.github.com/repos/${repo}/contents/${GITHUB_FILE_PATH}?ref=${encodeURIComponent(branch)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const payload = (await res.json()) as { content?: string; encoding?: string };
  if (!payload.content) return null;
  const decoded = Buffer.from(payload.content, "base64").toString("utf-8");
  return JSON.parse(decoded) as SiteContent;
}

export async function getSiteContent(): Promise<SiteContent> {
  if (process.env.VERCEL && process.env.GITHUB_TOKEN?.trim()) {
    try {
      const remote = await readGitHubContent();
      if (remote) return remote;
    } catch (err) {
      console.error("Failed to fetch remote GitHub content, falling back to local:", err);
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

  // 1. If GITHUB_TOKEN is set, commit directly to the repo's data/site-content.json
  const { token, repo, branch } = getGitHubConfig();
  if (token) {
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${GITHUB_FILE_PATH}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const currentRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
      headers,
      cache: "no-store",
    });

    let sha: string | undefined;
    if (currentRes.ok) {
      const currentData = (await currentRes.json()) as { sha?: string };
      sha = currentData.sha;
    }

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "Update studio content via Admin Studio",
        content: Buffer.from(formatted, "utf-8").toString("base64"),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putRes.ok) {
      const errText = await putRes.text();
      return {
        ok: false,
        mode: "github",
        message: `GitHub sync failed (${putRes.status}): ${errText}`,
        content: stamped,
      };
    }

    // Also update local file if running in a writable local environment
    if (!process.env.VERCEL) {
      await fs.writeFile(LOCAL_DATA_PATH, formatted, "utf-8").catch(() => {});
    }

    return {
      ok: true,
      mode: "github",
      message: "Saved and synced live to your repository.",
      content: stamped,
    };
  }

  // 2. Local development filesystem write
  if (!process.env.VERCEL) {
    await fs.writeFile(LOCAL_DATA_PATH, formatted, "utf-8");
    return {
      ok: true,
      mode: "local",
      message: "Saved directly to data/site-content.json.",
      content: stamped,
    };
  }

  // 3. Read-only deployed fallback (no GITHUB_TOKEN configured yet)
  return {
    ok: false,
    mode: "readonly",
    message:
      "Live server is in read-only mode (no GITHUB_TOKEN configured). Use Export JSON below or add GITHUB_TOKEN in Vercel env vars for instant live saves.",
    content: stamped,
  };
}
