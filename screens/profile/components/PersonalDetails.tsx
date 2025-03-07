import { useEffect, useState } from "react";
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
import { auth, firestore } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  storeName: z.string().min(1, "Store Name is required"),
  location: z.string().min(1, "Location is required"),
  currency: z.string().min(1, "Currency is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(1, "Address is required"),
  isProfileComplete: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

const PersonalDetails = () => {
  const [user, loading, error] = useAuthState(auth);
  const [loadingSave, setLoadingSave] = useState(false);
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          form.reset(userDoc.data() as FormData);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserDetails();
  }, [user, form]);

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    setLoadingSave(true);
    try {
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const isFirstUpdate =
        userDoc.exists() && !userDoc.data()?.isProfileComplete;

      await updateDoc(userRef, {
        ...data,
        isProfileComplete: true,
      });
      const newIdToken = await auth.currentUser?.getIdToken(true);

      await fetch("/api/update-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: newIdToken }),
      });
      
      if (isFirstUpdate) {
        toast.success("Profile completed! Redirecting to dashboard...");
        router.push("/");
      } else {
        toast.success("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating user data:", err);
      toast.error("Failed to update profile. Try again.");
    } finally {
      setLoadingSave(false);
    }
  };

  if (loading) return <Skeleton className="h-full w-full min-h-40" />;

  if (error) {
    return (
      <div className="max-w-md text-xs font-light text-red-500">
        Error loading user data: {error.message}
      </div>
    );
  }

  return (
    <Card className="flex h-full flex-col justify-start shadow-md rounded-md bg-transparent">
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <p className="text-sm text-gray-500">
          Update your personal details here.
        </p>
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
                      <span className="text-sm text-destructive">
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
                      <span className="text-sm text-destructive">
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
                    <Label>Location</Label>
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
                      <span className="text-sm text-destructive">
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
                    <Label>Currency</Label>
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
                      <span className="text-sm text-destructive">
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
                      disabled
                    />
                    {fieldState.error && (
                      <span className="text-sm text-destructive">
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
                      <span className="text-sm text-destructive">
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
                    <Label>Address</Label>
                    <Textarea
                      className="mt-1"
                      {...field}
                      placeholder="Enter your full address"
                    />
                    {fieldState.error && (
                      <span className="text-sm text-destructive">
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
              <Button type="submit" disabled={loadingSave}>
                {loadingSave ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default PersonalDetails;
