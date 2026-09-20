/**
 * Cloudflare D1 Context Accessor
 */

import type { D1Database } from "@/lib/d1-database";

declare const __non_webpack_require__: ((id: string) => any) | undefined;

export function getD1Database(): D1Database | null {
  // 1. Direct global binding
  try {
    const g = globalThis as unknown as Record<string, unknown>;
    if (g.DB && typeof (g.DB as D1Database).prepare === "function") {
      return g.DB as D1Database;
    }
  } catch {
    // Ignore
  }

  // 2. process.env.DB
  try {
    const penv = process.env as unknown as Record<string, unknown>;
    if (penv.DB && typeof (penv.DB as D1Database).prepare === "function") {
      return penv.DB as D1Database;
    }
  } catch {
    // Ignore
  }

  // 3. globalThis.env?.DB
  try {
    const g = globalThis as unknown as {
      env?: { DB?: D1Database };
      __env__?: { DB?: D1Database };
    };
    if (g.env?.DB && typeof g.env.DB.prepare === "function") {
      return g.env.DB;
    }
    if (g.__env__?.DB && typeof g.__env__.DB.prepare === "function") {
      return g.__env__.DB;
    }
  } catch {
    // Ignore
  }

  // 4. @cloudflare/next-on-pages getRequestContext
  try {
    const reqFn = typeof __non_webpack_require__ !== "undefined" ? __non_webpack_require__ : (typeof require !== "undefined" ? require : null);
    if (reqFn) {
      const moduleName = "@cloudflare/next-on-pages";
      const nextOnPages = reqFn(moduleName);
      if (typeof nextOnPages?.getRequestContext === "function") {
        const ctx = nextOnPages.getRequestContext();
        const db = ctx?.env?.DB as D1Database | undefined;
        if (db && typeof db.prepare === "function") {
          return db;
        }
      }
    }
  } catch {
    // Ignore
  }

  return null;
}

export const getCloudflareD1 = (req?: unknown): D1Database | null => getD1Database();
