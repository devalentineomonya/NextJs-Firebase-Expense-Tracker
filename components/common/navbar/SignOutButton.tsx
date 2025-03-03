"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignOutButton = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    const toastid = toast.loading("Signing out...");
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      window.sessionStorage.setItem("force-auth-check", "true");
      signOut(auth).catch((error) =>
        console.error("Firebase sign out error:", error)
      );
      await router.push(`/auth/login?t=${Date.now()}`);
      setIsOpen(false);
      setTimeout(async () => await router.refresh(), 500);
      toast.dismiss(toastid);
    } catch (error) {
      console.error("Sign out error:", error);
      toast.dismiss(toastid);
      toast.error("Sign out failed");
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
