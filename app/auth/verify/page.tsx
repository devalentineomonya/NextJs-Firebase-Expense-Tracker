"use client";
import { Button } from "@/components/ui/button";
import { Logo } from "@/screens/auth/components/Logo";
import { useSendEmailVerification } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, reload } from "firebase/auth";

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#5d87ff20] dark:bg-darkprimary flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#202936] rounded-md p-6
      shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px]
       flex flex-col items-center">
        <Logo />
        <div className="mt-6 mb-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        <p className="text-darklink text-sm text-center">
          Loading your verification page...
        </p>
      </div>
    </div>
  );
};

export default function Verify() {
  const [user, setUser] = useState<User | null>(null);
  const [sendEmailVerification, sending, error] =
    useSendEmailVerification(auth);
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthLoading(false);
      setUser(user);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const checkAuthState = async () => {
      if (!user) return;

      try {
        await reload(user);
        if (user.emailVerified) {
          const newToken = await user.getIdToken(true);
          toast.loading("Updating your session...", { id: "session-update" });

          await fetch("/api/update-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: newToken }),
          });

          toast.success("Session updated! Redirecting...");
          router.push("/");
        }
      } catch (error) {
        console.error("Auto-check failed:", error);
      }
    };

    const interval = setInterval(checkAuthState, 5000);
    return () => clearInterval(interval);
  }, [user, router]);

  const checkVerification = async () => {
    if (!user) return;

    setIsChecking(true);
    const toastId = toast.loading("Starting verification check...");

    try {
      // Step 1: Reload user data
      toast.loading("Refreshing user status...", { id: toastId });
      await reload(user);

      // Step 2: Force token refresh
      toast.loading("Generating new session token...", { id: toastId });
      const newToken = await user.getIdToken(true);

      // Step 3: Update session cookie
      toast.loading("Updating session...", { id: toastId });
      await fetch("/api/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: newToken }),
      });

      // Step 4: Final verification check
      if (user.emailVerified) {
        toast.success("Verification confirmed! Redirecting...", {
          id: toastId,
        });
        router.push("/");
      } else {
        throw new Error("Email still not verified");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Verification check failed";
      toast.error(message, { id: toastId });
    } finally {
      setIsChecking(false);
    }
  };

  const handleResend = async () => {
    if (!user) return;

    const toastId = toast.loading("Sending verification email...");
    try {
      const success = await sendEmailVerification();
      if (success) {
        toast.success("Verification email resent!", { id: toastId });
      } else {
        throw new Error("Failed to resend email");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Resend failed";
      toast.error(message, { id: toastId });
    }
  };

  if (authLoading) return <LoadingScreen />;
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#5d87ff20] dark:bg-darkprimary flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#202936] rounded-md p-6 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] ">
        <Logo />
        <p className="text-darklink text-sm text-center my-4">
          We sent a verification link to your email address. Please check your
          inbox at:
        </p>
        <h6 className="text-sm font-bold my-4 text-center break-all">
          {user.email}
        </h6>

        <div className="flex flex-col gap-4">
          <Button
            onClick={checkVerification}
            disabled={isChecking}
            className="w-full bg-primary dark:bg-slate-950 dark:hover:bg-slate-900 text-white rounded-md py-2 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? "Checking Verification..." : "I've Verified My Email"}
          </Button>

          <div className="flex gap-2 text-base text-ld font-medium mt-6 items-center justify-center">
            <p>Didn&apos;t receive the email?</p>
            <Button
              variant="link"
              onClick={handleResend}
              disabled={sending}
              className="text-primary text-sm font-medium p-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Resend Verification Email"}
            </Button>
          </div>

          {error && (
            <p className="text-red-500 text-center text-sm">{error.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
