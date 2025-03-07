import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request: Request) {
  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 });
  }

  const cookie = serialize("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", cookie);

  return response;
}
