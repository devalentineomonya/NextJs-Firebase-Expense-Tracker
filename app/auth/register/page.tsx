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
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import useAuthStore from "@/lib/zustand/use-authenticating";
import { FirebaseError } from "firebase/app";
import useProfileComplete from "@/lib/zustand/use-profile-complete";

const registrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z
    .boolean()
    .refine((val) => val, "You must accept the terms and conditions"),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [createUserWithEmailPassword] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const { setAuthState, isAuthenticating } = useAuthStore();
  const { setIsProfileComplete } = useProfileComplete();
  const [updateProfile] = useUpdateProfile(auth);
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
    setAuthState(true);
    try {
      const userData = await createUserWithEmailPassword(
        data.email,
        data.password
      );
      console.log("Current User:", userData?.user?.uid);
      console.log("Current User:", userData);
      if (userData?.user) {
        await Promise.all([
          sendEmailVerification(),
          updateProfile({
            displayName: data.name,
          }),
          setDoc(doc(firestore, "users", userData.user.uid), {
            userId: userData.user.uid,
            name: data.name,
            email: data.email,
            isProfileComplete: false,
          }),
        ]);
        toast.success("Verification email sent! Please check your inbox.");
        setIsProfileComplete(false);
        router.push("/auth/verify");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error instanceof Error
          ? error.message
          : error instanceof FirebaseError
          ? error.message
          : "An error occurred"
      );
    } finally {
      setIsLoading(false);
      setAuthState(false);
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
          disabled={isLoading || isAuthenticating}
          className="w-full"
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
      />
      <Label htmlFor="terms" className="text-sm">
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

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full">
      <div className="w-full max-w-[450px] bg-white shadow-md rounded-md p-6">
        <Logo />
        <SocialLoginSection />
        <Separator />
        <RegisterForm />
        <SignupLink />
      </div>
    </div>
  );
}
