"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  useSignInWithGoogle,
  useSignInWithGithub,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase/config";
import { toast } from "sonner";
import useAuthStore from "@/lib/zustand/use-authenticating";
import { doc, setDoc, getDoc } from "firebase/firestore";

type SearchParams = {
  redirect?: string;
};

const SocialButton = ({
  provider,
  iconSrc,
  loading,
  disabled,
  onClick,
}: {
  provider: string;
  iconSrc: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      disabled={disabled}
      variant="outline"
      className="w-full flex gap-2 items-center py-6 px-4 border border-ld"
      onClick={onClick}
    >
      {loading ? (
        <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <Image alt={provider} width={18} height={18} src={iconSrc} priority />
      )}
      {provider}
    </Button>
  );
};

export const SocialLoginSection = ({
  searchParams,
}: {
  searchParams?: SearchParams;
}) => {
  const router = useRouter();
  const redirectUrl = searchParams?.redirect || "/";
  const { isAuthenticating, setAuthState } = useAuthStore();

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);
  const [signInWithGitHub, githubUser, githubLoading, githubError] =
    useSignInWithGithub(auth);
  const [toastId, setToastId] = useState<string | number | undefined>(
    undefined
  );

  const handleAuth = async (authFunction: () => void) => {
    setAuthState(true);
    const loadingToastId = toast.loading("Creating session, redirecting...");
    setToastId(loadingToastId);
    authFunction();
  };

  useEffect(() => {
    const user = googleUser || githubUser;

    if (user) {
      const { uid, displayName, email } = user.user;

      if (!uid || !email) {
        toast.error("Error retrieving user data.");
        setAuthState(false);
        return;
      }

      const userDocRef = doc(firestore, "users", uid);

      const saveUserToFirestore = async () => {
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              name: displayName || "Anonymous",
              email,
              isProfileComplete: false,
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error("Error saving user data:", error);
          toast.error("Failed to save user data.");
        }
      };

      saveUserToFirestore().then(() => {
        toast.dismiss(toastId);
        router.push(redirectUrl);
        setAuthState(false);
      });
    }
  }, [googleUser, githubUser, router, redirectUrl, setAuthState, toastId]);

  useEffect(() => {
    if (googleError || githubError) {
      console.error("Authentication Error:", googleError || githubError);
      toast.dismiss(toastId);
      toast.error("Authentication failed. Please try again.");
      setAuthState(false);
    }
  }, [googleError, githubError, setAuthState, toastId]);

  return (
    <div className="flex gap-4 my-6">
      <SocialButton
        provider="Google"
        iconSrc="/google.svg"
        loading={googleLoading}
        disabled={isAuthenticating}
        onClick={() => handleAuth(signInWithGoogle)}
      />
      <SocialButton
        provider="GitHub"
        iconSrc="/github.svg"
        loading={githubLoading}
        disabled={isAuthenticating}
        onClick={() => handleAuth(signInWithGitHub)}
      />
    </div>
  );
};
