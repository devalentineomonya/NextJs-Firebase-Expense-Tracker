"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SocialLoginSection } from "@/screens/auth/components/SocialLoginSection";
import { InputField } from "@/screens/auth/components/InputField";
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
// After
import { use } from 'react'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>


const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional().default(false),
});


type LoginFormValues = z.infer<typeof loginSchema>;

const FormSection = (props: { redirectUrl: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [signInWithEmailPassword] = useSignInWithEmailAndPassword(auth);
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
    setIsLoading(true);
    try {
      const userData = await signInWithEmailPassword(data.email, data.password);
      if (userData) {
        toast.success("Login successful... redirecting to dashboard");

        router.push(props.redirectUrl);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Invalid email or password", {
          description: error.message,
        });
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
          className="w-full bg-primary dark:bg-slate-950 dark:hover:bg-slate-900 text-white rounded-md py-2 hover:bg-primary-dark"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </FormProvider>
  );
};

const SignupLink = () => (
  <div className="flex gap-2 text-base font-medium mt-6 justify-center">
    <p>New to Modernize?</p>
    <Link href="/auth/register" className="text-primary text-sm font-medium">
      Create an account
    </Link>
  </div>
);

export default function Login(props: {
    searchParams: SearchParams
  }) {
    const searchParams = use(props.searchParams)
  return (
    <div className="min-h-screen bg-[#5d87ff20] dark:bg-darkprimary flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#202936] shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px]   rounded-md p-6">
        <Logo />
        <SocialLoginSection  />
        <div className="flex items-center gap-4">
          <Separator className="flex-1 dark:bg-gray-500" />
          <span className="text-muted-foreground">or sign in with</span>
          <Separator className="flex-1 dark:bg-gray-500" />
        </div>
        <FormSection redirectUrl={searchParams.redirect as string} />
        <SignupLink />
      </div>
    </div>
  );
}
