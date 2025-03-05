"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InputField } from "@/components/common/input/InputField";
import { Logo } from "@/screens/auth/components/Logo";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { auth } from "@/lib/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { FormField } from "@/components/ui/form";
import { useRouter } from "next/navigation";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const FormSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();


  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      toast.success("Password reset email sent successfully");
      router.push("/auth/login");
      setEmailSent(true);
    } catch (error: unknown) {
      toast.error("Failed to send reset email", {
        description:
          error instanceof Error ? error.message : "Please try again later",
      });
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
              <InputField label="Email" id="email" type="email" {...field} />
              {fieldState.error && (
                <span className="text-sm text-red-500">
                  {fieldState.error.message}
                </span>
              )}
            </div>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading || emailSent}
          className="w-full bg-primary dark:bg-slate-950 dark:hover:bg-slate-900 text-white rounded-md py-2 hover:bg-primary-dark"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
              Sending...
            </div>
          ) : emailSent ? (
            "Email Sent - Check Your Inbox"
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-[#5d87ff20] dark:bg-darkprimary flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#202936] shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md p-6">
        <Logo />
        <p className="text-darklink text-sm text-center my-4">
          Please enter the email address associated with your account and
          we&apos;ll send you a link to reset your password.
        </p>

        <FormSection />

        <Link
          className="group relative flex items-stretch justify-center p-0.5 text-center font-medium hover:bg-[#5d88ff46] bg-[#5d87ff20]
           text-primary dark:hover:bg-primary rounded-md w-full mt-3"
          href="/auth/login"
        >
          <span className="flex items-center gap-2 transition-all duration-150 justify-center rounded-md px-4 py-2 text-sm">
            Back to Login
          </span>
        </Link>
      </div>
    </div>
  );
}
