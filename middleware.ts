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
  let emailVerified = false;
  let isProfileComplete = false;
  const { pathname } = request.nextUrl;

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
      console.log({ payload });
      isAuthenticated = true;
      emailVerified = payload.email_verified === true;
      isProfileComplete = payload.profileComplete === true;

      const currentTime = Date.now() / 1000;
      if (
        !emailVerified &&
        payload?.iat &&
        payload.iat > currentTime - 120 &&
        pathname !== "/auth/verify"
      ) {
        return NextResponse.redirect(
          new URL(`/auth/verify?freshLogin=true`, request.url)
        );
      }
    } catch (error) {
      console.error("JWT verification error:", error);
      isAuthenticated = false;
    }
  }

  if (isAuthenticated) {

    if (!emailVerified) {
      if (pathname !== "/auth/verify") {
        return NextResponse.redirect(new URL("/auth/verify", request.url));
      }
    } else {
    if (pathname === "/auth/verify") {
        return NextResponse.redirect(
          new URL(DEFAULT_LOGIN_REDIRECT, request.url)
        );
      }

      if (!isProfileComplete && pathname !== "/profile") {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    }

    if (PUBLIC_ROUTES.includes(pathname)) {
      const redirectUrl = emailVerified
        ? DEFAULT_LOGIN_REDIRECT
        : "/auth/verify";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  } else {
 
    if (!PUBLIC_ROUTES.includes(pathname)) {
      let callbackUrl = pathname;
      if (request.nextUrl.search) {
        callbackUrl += request.nextUrl.search;
      }
      const encodedCallbackUrl = encodeURIComponent(callbackUrl);
      return NextResponse.redirect(
        new URL(`/auth/login?redirect=${encodedCallbackUrl}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
