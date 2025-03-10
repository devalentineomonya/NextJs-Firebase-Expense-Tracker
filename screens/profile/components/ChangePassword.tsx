import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/common/input/InputField";
import { FormField } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { toast } from "sonner";

const passwordValidation = {
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
};

const createPasswordSchema = (hasPassword: boolean) => {
  const schema = z
    .object({
      ...passwordValidation,
      ...(hasPassword && {
        currentPassword: z.string().min(6, "Current password is required"),
      }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  return schema;
};

type FormData = z.infer<ReturnType<typeof createPasswordSchema>>;

const ChangePassword = () => {
  const [user] = useAuthState(auth);
  const hasPassword = user?.providerData?.some(
    (provider) => provider.providerId === "password"
  );

  const methods = useForm<FormData>({
    resolver: zodResolver(createPasswordSchema(!!hasPassword)),
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (!user) throw new Error("User not authenticated");
      if (!user.email) throw new Error("Email not available");

      if (hasPassword) {
        const credential = EmailAuthProvider.credential(
          user.email,
          data.currentPassword as string
        );
        await reauthenticateWithCredential(user, credential);
      }

      await updatePassword(user, data.newPassword);
      const newToken = await user.getIdToken(true);

      const response = await fetch("/api/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: newToken }),
      });

      if (!response.ok) throw new Error("Session update failed");

      toast.success(
        hasPassword
          ? "Password changed successfully!"
          : "Password set successfully!"
      );

      methods.reset();
    } catch (error) {
      console.error("Password update error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Password update failed";

      if (errorMessage.includes("requires-recent-login")) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Card className="flex h-full flex-col justify-start shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent mt-5">
      <CardHeader>
        <CardTitle>
          {hasPassword ? "Change Password" : "Set Password"}
        </CardTitle>
        <p className="text-sm text-gray-500">
          {hasPassword
            ? "To change your password, please confirm your current password"
            : "Set a password for your account"}
        </p>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {hasPassword && (
              <FormField
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <div>
                    <InputField
                      label="Current Password"
                      id="currentPassword"
                      type="password"
                      {...field}
                    />
                    {fieldState.error && (
                      <span className="text-sm font-medium text-destructive mt-1">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />
            )}

            <FormField
              name="newPassword"
              render={({ field, fieldState }) => (
                <div>
                  <InputField
                    label="New Password"
                    id="newPassword"
                    type="password"
                    {...field}
                  />
                  {fieldState.error && (
                    <span className="text-sm font-medium text-destructive mt-1">
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />

            <FormField
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <div>
                  <InputField
                    label="Confirm Password"
                    id="confirmPassword"
                    type="password"
                    {...field}
                  />
                  {fieldState.error && (
                    <span className="text-sm font-medium text-destructive mt-1">
                      {fieldState.error.message}
                    </span>
                  )}
                </div>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting
                ? "Processing..."
                : hasPassword
                ? "Change Password"
                : "Set Password"}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
