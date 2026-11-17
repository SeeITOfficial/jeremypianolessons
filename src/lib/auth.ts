import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "jeremy_admin_session";
const DEFAULT_DEV_PASSCODE = "jeremy-piano-2026";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_DEV_PASSCODE;
}

export function isUsingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD?.trim();
}

function getSigningKey(): string {
  const secret = process.env.ADMIN_SECRET?.trim() || getAdminPassword();
  return crypto
    .createHash("sha256")
    .update(`jeremy-piano-admin-key:${secret}`)
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

export function verifyPasscode(input: string): boolean {
  const expected = getAdminPassword();
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
