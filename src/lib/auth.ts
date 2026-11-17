import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { get, put } from "@vercel/blob";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "jeremy_admin_session";
const LOCAL_PIN_PATH = path.join(process.cwd(), ".admin-pin.local.json");
const BLOB_AUTH_PATH = "studio/admin-auth.json";
const LOCAL_DEV_FALLBACK_PIN = "000000";

interface StoredPinRecord {
  salt: string;
  hash: string;
  updatedAt: string;
}

export function isValidSixDigitPin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

function hasBlobStorage(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      (process.env.VERCEL_OIDC_TOKEN?.trim() && process.env.BLOB_STORE_ID?.trim())
  );
}

function hashPin(pin: string, salt: string): string {
  return crypto.scryptSync(pin, salt, 64).toString("hex");
}

function verifyScryptHash(pin: string, record: StoredPinRecord): boolean {
  const derived = Buffer.from(hashPin(pin, record.salt), "hex");
  const expected = Buffer.from(record.hash, "hex");
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

async function readStoredPinRecord(): Promise<StoredPinRecord | null> {
  if (hasBlobStorage()) {
    try {
      const result = await get(BLOB_AUTH_PATH, {
        access: "private",
        useCache: false,
      });
      if (result && result.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        const parsed = JSON.parse(text) as StoredPinRecord;
        if (parsed?.salt && parsed?.hash) return parsed;
      }
    } catch {
      return null;
    }
    return null;
  }

  try {
    const raw = await fs.readFile(LOCAL_PIN_PATH, "utf-8");
    const parsed = JSON.parse(raw) as StoredPinRecord;
    if (parsed?.salt && parsed?.hash) return parsed;
    return null;
  } catch {
    return null;
  }
}

async function writeStoredPinRecord(record: StoredPinRecord): Promise<void> {
  const serialized = JSON.stringify(record, null, 2) + "\n";

  if (hasBlobStorage()) {
    await put(BLOB_AUTH_PATH, serialized, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  await fs.writeFile(LOCAL_PIN_PATH, serialized, "utf-8");
}

export async function getAuthStatus(): Promise<{
  hasCustomPin: boolean;
  isConfigured: boolean;
  isLocalFallback: boolean;
}> {
  const custom = await readStoredPinRecord();
  if (custom) {
    return { hasCustomPin: true, isConfigured: true, isLocalFallback: false };
  }

  const envPin = process.env.ADMIN_PIN?.trim();
  if (envPin && isValidSixDigitPin(envPin)) {
    return { hasCustomPin: false, isConfigured: true, isLocalFallback: false };
  }

  if (!process.env.VERCEL) {
    return { hasCustomPin: false, isConfigured: true, isLocalFallback: true };
  }

  return { hasCustomPin: false, isConfigured: false, isLocalFallback: false };
}

export async function verifyPin(inputPin: string): Promise<{
  valid: boolean;
  configured: boolean;
}> {
  if (!isValidSixDigitPin(inputPin)) {
    return { valid: false, configured: true };
  }

  const custom = await readStoredPinRecord();
  if (custom) {
    return { valid: verifyScryptHash(inputPin, custom), configured: true };
  }

  const envPin = process.env.ADMIN_PIN?.trim();
  if (envPin && isValidSixDigitPin(envPin)) {
    const a = Buffer.from(inputPin);
    const b = Buffer.from(envPin);
    return {
      valid: a.length === b.length && crypto.timingSafeEqual(a, b),
      configured: true,
    };
  }

  if (!process.env.VERCEL) {
    const a = Buffer.from(inputPin);
    const b = Buffer.from(LOCAL_DEV_FALLBACK_PIN);
    return {
      valid: a.length === b.length && crypto.timingSafeEqual(a, b),
      configured: true,
    };
  }

  return { valid: false, configured: false };
}

export async function changePin(
  currentPin: string,
  newPin: string
): Promise<{ ok: boolean; message: string }> {
  if (!isValidSixDigitPin(currentPin) || !isValidSixDigitPin(newPin)) {
    return { ok: false, message: "Both PINs must be exactly 6 digits." };
  }

  const check = await verifyPin(currentPin);
  if (!check.configured || !check.valid) {
    return { ok: false, message: "Current 6-digit PIN is incorrect." };
  }

  if (process.env.VERCEL && !hasBlobStorage()) {
    return {
      ok: false,
      message: "Cloud storage is not connected on this deployment.",
    };
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPin(newPin, salt);
  await writeStoredPinRecord({
    salt,
    hash,
    updatedAt: new Date().toISOString(),
  });

  return {
    ok: true,
    message: "Your 6-digit studio PIN has been updated.",
  };
}

function getSigningKey(): string {
  const secret =
    process.env.ADMIN_SECRET?.trim() ||
    process.env.ADMIN_PIN?.trim() ||
    "local-dev-only-studio-secret";
  return crypto
    .createHash("sha256")
    .update(`jeremy-piano-session:${secret}`)
    .digest("hex");
}

export function createSessionToken(): string {
  const issuedAt = Date.now().toString(36);
  const nonce = crypto.randomBytes(8).toString("hex");
  const payload = `${issuedAt}.${nonce}`;
  const sig = crypto
    .createHmac("sha256", getSigningKey())
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issuedAt, nonce, sig] = parts;
  const payload = `${issuedAt}.${nonce}`;
  const expectedSig = crypto
    .createHmac("sha256", getSigningKey())
    .update(payload)
    .digest("hex");

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length) return false;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

  const issuedMs = parseInt(issuedAt, 36);
  if (Number.isNaN(issuedMs)) return false;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - issuedMs < sevenDaysMs;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
