"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import * as z from "zod";
import { FormField } from "@/components/ui/form";
import { InputField } from "@/components/common/input/InputField";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/screens/auth/components/Logo";
import { SocialLoginSection } from "@/screens/auth/components/SocialLoginSection";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useSendEmailVerification,
  useCreateUserWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";

const registrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z
    .boolean()
    .refine((val) => val, "You must accept the terms and conditions"),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const FormSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createUserWithEmailPassword] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const router = useRouter();
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  const onSubmit = async (data: RegistrationFormValues) => {
    setIsLoading(true);
    try {
      const userData = await createUserWithEmailPassword(
        data.email,
        data.password
      );

      if (userData) {
        const success = await sendEmailVerification();

        if (success) {
          toast.success("Verification email sent! Please check your inbox.");
          router.push("/auth/verify");
        } else {
          throw new Error("Failed to send verification email");
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
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
          name="name"
          render={({ field, fieldState }) => (
            <div>
              <InputField label="Name" id="name" type="text" {...field} />
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
          name="terms"
          render={({ field }) => (
            <CheckboxLinkGroup
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {form.formState.errors.terms && (
          <p className="text-sm text-red-500">
            {form.formState.errors.terms.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary dark:bg-slate-950 dark:hover:bg-slate-900 text-white rounded-md py-2 hover:bg-primary-dark"
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </FormProvider>
  );
};

const CheckboxLinkGroup = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex justify-between my-5">
    <div className="flex items-center gap-2">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(checked) => onChange(!!checked)}
        className="rounded border border-border dark:border-gray-500 cursor-pointer text-primary"
      />
      <Label
        htmlFor="terms"
        className="text-sm text-gray-900 dark:text-white opacity-90"
      >
        I accept the terms and conditions
      </Label>
    </div>
  </div>
);
const SignupLink = () => (
  <div className="flex gap-2 text-base font-medium mt-6 justify-center">
    <p>Already have an account?</p>
    <Link href="/auth/login" className="text-primary text-sm font-medium">
      Sign in
    </Link>
  </div>
);

export default function Login() {
  return (
    <div className="min-h-screen bg-[#5d87ff20] dark:bg-darkprimary flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-[450px] bg-white dark:bg-[#202936] shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px]   rounded-md p-6">
        <Logo />
        <SocialLoginSection />
        <div className="flex items-center gap-4">
          <Separator className="flex-1 dark:bg-gray-500" />
          <span className="text-muted-foreground">or sign up with</span>
          <Separator className="flex-1 dark:bg-gray-500" />
        </div>
        <FormSection />
        <SignupLink />
      </div>
    </div>
  );
}
