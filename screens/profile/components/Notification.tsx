import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/common/input/InputField";
import { FormField } from "@/components/ui/form";

import { FormProvider } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const notificationSchema = z.object({
  email: z.string().email("Valid email is required"),
  transactionNotifications: z.boolean().default(false),
  paymentReminders: z.boolean().default(false),
  orderConfirmation: z.boolean().default(true),
  orderStatusChanges: z.boolean().default(true),
  deliveryUpdates: z.boolean().default(true),
  promotionalOffers: z.boolean().default(false),
});

type FormData = z.infer<typeof notificationSchema>;

const Notification = () => {
  const methods = useForm<FormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      orderConfirmation: true,
      orderStatusChanges: true,
      deliveryUpdates: true,
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Notification preferences:", data);
  };

  return (
    <Card className="flex h-full flex-col shadow-none rounded-md bg-transparent my-5 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <p className="text-sm text-gray-500">
          Select the notifications you&apos;d like to receive via email. Service
          messages (payment, security, legal) cannot be disabled.
        </p>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              render={({ field, fieldState }) => (
                <div className="space-y-2">
                  <InputField
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="notification@example.com"
                    {...field}
                  />
                  {fieldState.error && (
                    <span className="text-sm font-medium text-destructive">
                      {fieldState.error.message}
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Required for notifications
                  </p>
                </div>
              )}
            />

            <div className="space-y-4">
              <FormField
                name="transactionNotifications"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label>Transaction Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Important transaction updates and alerts
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <FormField
                name="paymentReminders"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label>Payment Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Upcoming payment due dates and reminders
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <FormField
                name="orderConfirmation"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label>Order Confirmations</Label>
                      <p className="text-sm text-muted-foreground">
                        Confirmations for new customer orders
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <FormField
                name="orderStatusChanges"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label>Order Status Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Changes to order processing stages
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <FormField
                name="deliveryUpdates"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label>Delivery Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Real-time shipment tracking information
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />

              <FormField
                name="promotionalOffers"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <Label>Promotional Offers</Label>
                      <p className="text-sm text-muted-foreground">
                        Special deals and marketing communications
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <div className="flex justify-end gap-2">
                <Button type="submit" className="w-full">
                  Save
                </Button>
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default Notification;
