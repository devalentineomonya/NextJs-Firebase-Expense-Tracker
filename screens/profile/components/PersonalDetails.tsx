import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/common/input/InputField";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { FormProvider } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  storeName: z.string().min(1, "Store Name is required"),
  location: z.string().min(1, "Location is required"),
  currency: z.string().min(1, "Currency is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
});

type FormData = z.infer<typeof formSchema>;

const PersonalDetails = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <Card className="flex h-full flex-col justify-start shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent mt-5">
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <p className="text-sm text-gray-500">To change your personal details, edit and save from here.</p>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="name"
                render={({ field, fieldState }) => (
                  <div>
                    <InputField
                      label="Your Name"
                      id="name"
                      type="text"
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
                name="storeName"
                render={({ field, fieldState }) => (
                  <div>
                    <InputField
                      label="Store Name"
                      id="storeName"
                      type="text"
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
                name="location"
                render={({ field, fieldState }) => (
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Location
                    </Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="India">India</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <span className="text-sm font-medium text-destructive mt-1">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <FormField
                name="currency"
                render={({ field, fieldState }) => (
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Currency
                    </Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <span className="text-sm font-medium text-destructive mt-1">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <FormField
                name="email"
                render={({ field, fieldState }) => (
                  <div>
                    <InputField
                      label="Email"
                      id="email"
                      type="email"
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
                name="phone"
                render={({ field, fieldState }) => (
                  <div>
                    <InputField
                      label="Phone"
                      id="phone"
                      type="text"
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
                name="address"
                render={({ field, fieldState }) => (
                  <div className="col-span-1 md:col-span-2">
                    <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                      Address
                    </Label>
                    <Textarea
                      className="mt-1"
                      {...field}
                      placeholder="Enter your full address"
                    />
                    {fieldState.error && (
                      <span className="text-sm font-medium text-destructive mt-1">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;
