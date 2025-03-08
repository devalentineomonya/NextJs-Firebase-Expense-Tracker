"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SocialLoginSection } from "@/screens/auth/components/SocialLoginSection";
import { InputField } from "@/components/common/input/InputField";
import { CheckboxLinkGroup } from "@/screens/auth/components/CheckboxLinkGroup";
import { Logo } from "@/screens/auth/components/Logo";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import { toast } from "sonner";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { useRouter } from "next/navigation";
import { use } from "react";
import { reload } from "firebase/auth";
import useAuthStore from "@/lib/zustand/use-authenticating";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const FormSection = (props: { redirectUrl: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [signInWithEmailPassword] = useSignInWithEmailAndPassword(auth);
  const { isAuthenticating, setAuthState } = useAuthStore();
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setAuthState(true);

      const userCredential = await signInWithEmailPassword(
        data.email,
        data.password
      );
      if (!userCredential?.user) {
        toast.error("Invalid email or password");
        return;
      }

      const user = auth.currentUser;
      if (!user) throw new Error("User session not found");

      await reload(user);
      const newToken = await user.getIdToken(true);

      const updateSession = async (token: string) => {
        const response = await fetch("/api/update-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error("Session update failed");
        return response.json();
      };

      const sessionData = await updateSession(newToken);
      setIsRedirecting(true);
      if (!sessionData?.isProfileComplete) {
        toast.info("Please complete your profile to continue");
        router.push("/profile");
        return;
      }

      toast.success("Login successful... redirecting");
      router.push(props.redirectUrl);
    } catch (error: unknown) {
      console.error("Login error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";

      if (errorMessage.includes("auth/wrong-password")) {
        toast.error("Incorrect password");
      } else if (errorMessage.includes("auth/user-not-found")) {
        toast.error("Account not found");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
      setAuthState(false);
      setIsRedirecting(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <div>
              <InputField label="Email" id="email" type="text" {...field} />
              {fieldState.error && (
                <span className="text-sm text-red-500">
                  {fieldState.error.message}
                </span>
              )}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <div>
              <InputField
                label="Password"
                id="password"
                type="password"
                {...field}
              />
              {fieldState.error && (
                <span className="text-sm text-red-500">
                  {fieldState.error.message}
                </span>
              )}
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <CheckboxLinkGroup
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || isRedirecting || isAuthenticating}
          className="w-full bg-primary dark:bg-slate-950 dark:hover:bg-slate-900 text-white rounded-md py-2 hover:bg-primary-dark"
        >
          {isLoading
            ? "Signing in..."
            : isRedirecting
            ? "Redirecting..."
            : "Sign In"}
        </Button>
      </form>
    </FormProvider>
  );
};

const SignupLink = () => (
  <div className="flex gap-2 text-base font-medium mt-6 justify-center">
    <p>New to DeExpenser?</p>
    <Link href="/auth/register" className="text-primary text-sm font-medium">
      Create an account
    </Link>
  </div>
);

export default function Login(props: { searchParams: SearchParams }) {
  const searchParams = use(props?.searchParams) || { redirect: "/" };
  if (typeof searchParams.redirect !== "string") {
    searchParams.redirect = "/";
  }

  return (
    <div className="min-h-screen bg-[#5d87ff20] dark:bg-darkprimary flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#202936] shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px]   rounded-md p-6">
        <Logo />
        <SocialLoginSection searchParams={searchParams} />
        <div className="flex items-center gap-4">
          <Separator className="flex-1 dark:bg-gray-500" />
          <span className="text-muted-foreground">or sign in with</span>
          <Separator className="flex-1 dark:bg-gray-500" />
        </div>
        <FormSection redirectUrl={searchParams.redirect} />
        <SignupLink />
      </div>
    </div>
  );
}
