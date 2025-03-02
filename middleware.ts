import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];
const DEFAULT_LOGIN_REDIRECT = "/";
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  let isAuthenticated = false;

  if (session) {
    try {
      const jwks = createRemoteJWKSet(
        new URL(
          "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
        )
      );

      const { payload } = await jwtVerify(session, jwks, {
        issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
        audience: FIREBASE_PROJECT_ID,
      });

      console.log("JWT payload:", payload);
      isAuthenticated = true;
    } catch (error) {
      console.error("JWT verification error:", error);
      isAuthenticated = false;
    }
  }

  const { pathname } = request.nextUrl;

  if (
    (isAuthenticated && PUBLIC_ROUTES.includes(pathname)) ||
    pathname.includes("auth")
  ) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url));
  }

  if (
    !isAuthenticated &&
    !PUBLIC_ROUTES.includes(pathname) &&
    !pathname.includes("auth")
  ) {
    let callbackUrl = pathname;
    if (request.nextUrl.search) {
      callbackUrl += request.nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(
      new URL(`/auth/login?redirect=${encodedCallbackUrl}`, request.url)
    );
  }

  if (
    isAuthenticated &&
    !PUBLIC_ROUTES.includes(pathname) &&
    !pathname.includes("auth")
  ) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam) {
      const redirectUrl = decodeURIComponent(redirectParam);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
