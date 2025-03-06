"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase/config";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useIncomeModal } from "@/lib/zustand/use-income";
import { ScrollArea } from "@/components/ui/scroll-area";

const incomeSchema = z.object({
  source: z.string().min(1, "Source is required"),
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  period: z.enum(["daily", "weekly", "monthly", "annually"]),
  schedule: z.string().optional(),
});

type IncomeFormValues = z.infer<typeof incomeSchema>;

const IncomeModal = () => {
  const [user] = useAuthState(auth);
  const { open, currentIncome, onClose } = useIncomeModal();
  const [loading, setLoading] = useState(false);

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      source: "",
      amount: 0,
      period: "monthly",
      schedule: "",
    },
  });

  useEffect(() => {
    if (currentIncome) {
      form.reset({
        ...currentIncome,
        period: currentIncome.period as
          | "daily"
          | "weekly"
          | "monthly"
          | "annually",
        schedule: currentIncome.schedule || "",
      });
    } else {
      form.reset({ source: "", amount: 0, period: "monthly", schedule: "" });
    }
  }, [currentIncome, form]);

  const selectedPeriod = form.watch("period");

  const onSubmit = async (data: IncomeFormValues) => {
    if (!user) {
      toast.error("Authentication required");
      return;
    }
    setLoading(true);

    const incomeData = {
      id: currentIncome?.id || uuidv4(),
      userId: user.uid,
      createdAt: Timestamp.now(),
      ...data,
    };

    try {
      await setDoc(doc(firestore, "income", incomeData.id), incomeData, {
        merge: true,
      });
      toast.success(
        `Income ${currentIncome ? "updated" : "added"} successfully`
      );
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error saving income:", error);
      toast.error("Failed to save income");
    } finally {
      setLoading(false);
    }
  };

  const ScheduleSelector = ({
    period,
    value,
    onChange,
  }: {
    period: "daily" | "weekly" | "monthly" | "annually";
    value: string;
    onChange: (value: string) => void;
  }) => {
    const generateTimeIntervals = () => {
      const times = [];
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 5) {
          const formattedHour = hour.toString().padStart(2, "0");
          const formattedMinute = minute.toString().padStart(2, "0");
          times.push(`${formattedHour}:${formattedMinute}`);
        }
      }
      return times;
    };

    const options = useMemo(() => {
      switch (period) {
        case "daily":
          return generateTimeIntervals();
        case "weekly":
          return [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
        case "monthly":
          return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
        case "annually":
          return [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
        default:
          return [];
      }
    }, [period]);

    return (
      <ScrollArea className="h-48 rounded-md border">
        <div className="grid grid-cols-3 gap-2 p-2">
          {options.map((option) => (
            <Button
              key={option}
              variant={value === option ? "default" : "outline"}
              onClick={() => onChange(option)}
              className="h-8 px-2 text-xs"
              type="button"
            >
              {option}
            </Button>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {currentIncome ? "Edit Income" : "Add New Income"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input placeholder="Income source" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (KES)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Period</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
                control={form.control}
                name="schedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {selectedPeriod === "daily" && "Payment Time"}
                      {selectedPeriod === "weekly" && "Payment Day"}
                      {selectedPeriod === "monthly" && "Payment Date"}
                      {selectedPeriod === "annually" && "Payment Month"}
                    </FormLabel>
                    <FormControl>
                      <ScheduleSelector
                        period={selectedPeriod}
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div className="flex justify-end gap-2">
              <Button
                disabled={loading}
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">
                {loading ? "Saving..." : "Save Income"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IncomeModal;
