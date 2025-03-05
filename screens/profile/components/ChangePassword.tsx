import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/common/input/InputField";
import { FormField } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof passwordSchema>;

const ChangePassword = () => {
  const methods = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Password change data:", data);
  };

  return (
    <Card className="flex h-full flex-col justify-start shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent mt-5">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <p className="text-sm text-gray-500">To change your password, please confirm here.</p>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" className="w-full">
              Change Password
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;
