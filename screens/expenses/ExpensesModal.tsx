"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useExpenseModal } from "@/lib/zustand/use-expense";

const expenseSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least 1"),
  expenditureType: z.string().min(1, "Expenditure type is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  dateSpent: z.date(),
  note: z.string().optional(),
});
type ExpenseFormValues = z.infer<typeof expenseSchema>;

const ExpenseModal = () => {
  const [user] = useAuthState(auth);
  const { open, currentExpense, onClose } = useExpenseModal();
  const [loading, setLoading] = useState(false);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      expenditureType: "",
      paymentMethod: "",
      dateSpent: new Date(),
      note: "",
    },
  });

  useEffect(() => {
    if (currentExpense) {
      form.reset({
        ...currentExpense,
        dateSpent:
          currentExpense.dateSpent instanceof Timestamp
            ? currentExpense.dateSpent.toDate()
            : currentExpense.dateSpent,
      });
    } else {
      form.reset({
        amount: 0,
        expenditureType: "",
        paymentMethod: "",
        dateSpent: new Date(),
        note: "",
      });
    }
  }, [currentExpense, form]);

  const onSubmit = async (data: ExpenseFormValues) => {
    if (!user) {
      toast.error("Authentication required");
      return;
    }
    setLoading(true);

    const expenseData = {
      id: currentExpense?.id || uuidv4(),
      referenceNumber: uuidv4(),
      userId: user.uid,
      createdAt: Timestamp.now(),
      ...data,
      dateSpent: Timestamp.fromDate(data.dateSpent),
    };

    try {
      await setDoc(doc(firestore, "expenses", expenseData.id), expenseData, {
        merge: true,
      });
      toast.success(
        `Expense ${currentExpense ? "updated" : "added"} successfully`
      );
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const currentDate = form.getValues("dateSpent") || new Date();
      const newDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        currentDate.getHours(),
        currentDate.getMinutes()
      );
      form.setValue("dateSpent", newDate);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    const currentDate = form.getValues("dateSpent") || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    form.setValue("dateSpent", newDate);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {currentExpense ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expenditureType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expenditure Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Office Supplies">
                          Office Supplies
                        </SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Mobile Money">
                          Mobile Money
                        </SelectItem>
                        <SelectItem value="Bank Transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateSpent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy hh:mm aa")
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="sm:flex">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i + 1)
                                .reverse()
                                .map((hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getHours() % 12 === hour % 12
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("hour", hour.toString())
                                    }
                                  >
                                    {hour}
                                  </Button>
                                ))}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                (minute) => (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange(
                                        "minute",
                                        minute.toString()
                                      )
                                    }
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                )
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                              {["AM", "PM"].map((ampm) => (
                                <Button
                                  key={ampm}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    ((ampm === "AM" &&
                                      field.value.getHours() < 12) ||
                                      (ampm === "PM" &&
                                        field.value.getHours() >= 12))
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() => handleTimeChange("ampm", ampm)}
                                >
                                  {ampm}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add expense details..."
                      className="resize-none"
                      {...field}
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
                {loading ? "Saving..." : "Save Expense"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModal;
