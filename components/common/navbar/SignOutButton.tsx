"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);

      await fetch("/api/auth/signout", { method: "POST" });

      window.sessionStorage.setItem("force-auth-check", "true");

      router.push(`/auth/login?t=${Date.now()}`);

      router.refresh();

    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full mt-4"
      size="lg"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
