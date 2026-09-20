export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { 
  generateAdminSessionToken, 
  timingSafeCompare, 
  checkRateLimit 
} from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("cf-connecting-ip") || 
               "anonymous";

    // Strict rate limit: 5 login attempts per minute per IP
    const rateLimit = checkRateLimit(`auth:${ip}`, 5, 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many authentication attempts. Please wait 1 minute." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    const expectedPassword =
      process.env.ADMIN_PASSWORD ||
      process.env.ADMIN_ACCESS_TOKEN ||
      "";

    if (!expectedPassword || !password || !timingSafeCompare(password, expectedPassword)) {
      return NextResponse.json(
        { success: false, error: "Invalid administrator credentials." },
        { status: 401 }
      );
    }

    // Generate signed session token
    const token = await generateAdminSessionToken("admin_user");

    const response = NextResponse.json({ success: true });
    
    // Set HTTP-only secure cookie
    response.cookies.set("sahyak_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600 // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Authentication service error." },
      { status: 500 }
    );
  }
}
