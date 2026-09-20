/**
 * Enterprise Application Hardening & Edge Input Sanitization
 */

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export const sanitizeHtml = escapeHtml;

export function sanitizeString(
  input: unknown,
  maxLength = 500,
  allowNewlines = false
): string {
  if (typeof input !== "string") return "";
  let clean = input.trim().slice(0, maxLength);
  if (!allowNewlines) {
    clean = clean.replace(/[\r\n]+/g, " ");
  }
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return escapeHtml(clean);
}

export function sanitizeEmail(input: unknown): { valid: boolean; email: string } {
  if (typeof input !== "string") return { valid: false, email: "" };
  const clean = input.trim().toLowerCase().slice(0, 254);
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return {
    valid: emailRegex.test(clean),
    email: clean,
  };
}

export function sanitizePhone(input: unknown): { valid: boolean; phone: string } {
  if (typeof input !== "string") return { valid: false, phone: "" };
  const clean = input.trim().replace(/[^\d+]/g, "").slice(0, 20);
  const phoneRegex = /^\+?[0-9]{7,16}$/;
  return {
    valid: phoneRegex.test(clean),
    phone: clean,
  };
}

export function timingSafeCompare(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count };
}

let ephemeralSessionSecret: string | null = null;

function getAdminSessionSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.trim().length > 0) {
    return process.env.ADMIN_SESSION_SECRET.trim();
  }
  if (process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.trim().length > 0) {
    return `sess_${process.env.ADMIN_PASSWORD.trim()}`;
  }
  // In environments without configured secrets, generate an ephemeral random 256-bit secret per process
  if (!ephemeralSessionSecret) {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    ephemeralSessionSecret = Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
  }
  return ephemeralSessionSecret;
}

export async function generateAdminSessionToken(userId: string): Promise<string> {
  const secret = getAdminSessionSecret();
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 3600;
  const payload = btoa(JSON.stringify({ sub: userId, role: "admin", exp }));

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${header}.${payload}`)
  );

  const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `${header}.${payload}.${sigBase64}`;
}

export async function verifyAdminSessionToken(
  token: string
): Promise<{ valid: boolean; userId?: string }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false };

    const [header, payload, signature] = parts;
    const secret = getAdminSessionSecret();

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBinary = Uint8Array.from(
      atob(signature.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBinary,
      encoder.encode(`${header}.${payload}`)
    );

    if (!isValid) return { valid: false };

    const parsedPayload = JSON.parse(atob(payload));
    if (parsedPayload.exp && parsedPayload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }

    return { valid: true, userId: parsedPayload.sub };
  } catch {
    return { valid: false };
  }
}
