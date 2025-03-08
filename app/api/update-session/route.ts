import { NextResponse } from "next/server";
import { serialize } from "cookie";
import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authorization token required" },
        { status: 400 }
      );
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const firestore = admin.firestore();
    const userDoc = await firestore.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: "User document not found" },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    await admin.auth().setCustomUserClaims(userId, {
      profileComplete: !!userData?.isProfileComplete,
      emailVerified: decodedToken.email_verified,
    });

    const cookie = serialize("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    const response = NextResponse.json({ success: true, isProfileComplete: !!userData?.isProfileComplete }, { status: 200 });
    response.headers.set("Set-Cookie", cookie);
    return response;
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, error: "Session update failed" },
      { status: 401 }
    );
  }
}
