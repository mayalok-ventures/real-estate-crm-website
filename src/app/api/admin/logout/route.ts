export const runtime = "edge";

import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("sahyak_admin_session");
  return response;
}
