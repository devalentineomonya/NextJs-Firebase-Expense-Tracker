"use client";
import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Grip } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";
import { format, startOfMonth, endOfMonth, getYear, getMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Expense {
  id: string;
  amount: number;
  dateSpent: Date;
  expenditureType: string;
  paymentMethod: string;
}

const StatsItem = ({
  iconBgColor,
  iconTextColor,
  category,
  amount,
  percentage,
}: {
  iconBgColor: string;
  iconTextColor: string;
  category: string;
  amount: number;
  percentage: string;
}) => (
  <div className="flex justify-between items-center mt-4 w-full">
    <div className="flex items-center">
      <div
        className="h-10 aspect-square rounded-md grid place-items-center"
        style={{ backgroundColor: iconBgColor, color: iconTextColor }}
      >
        <Grip className="w-6 h-6" />
      </div>
      <div className="ml-1">
        <h1 className="text-lg font-semibold">{category}</h1>
        <p className="text-[#7c8fac] text-sm">KES {amount.toFixed(2)}</p>
      </div>
    </div>
    <p className="text-sm ml-2 py-1 px-2 rounded-md">{percentage}</p>
  </div>
);

const MonthlyExpenditure = () => {
  const [user] = useAuthState(auth);
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));

  // Generate options
  const years = Array.from(
    { length: 11 },
    (_, i) => getYear(new Date()) - 5 + i
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(0, i), "MMMM")
  );

  // Calculate month range
  const monthStart = startOfMonth(new Date(selectedYear, selectedMonth));
  const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth));

  const expensesQuery = user
    ? query(
        collection(firestore, "expenses"),
        where("userId", "==", user.uid),
        where("dateSpent", ">=", Timestamp.fromDate(monthStart)),
        where("dateSpent", "<=", Timestamp.fromDate(monthEnd)),
        orderBy("dateSpent", "asc")
      )
    : null;

  const [expensesSnapshot, loading, error] = useCollection(expensesQuery);

  const { categoryData, chartData, totalMonthly } = useMemo(() => {
    if (!expensesSnapshot)
      return { categoryData: [], chartData: [], totalMonthly: 0 };

    const expenses = expensesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      dateSpent: doc.data().dateSpent.toDate(),
    })) as Expense[];

    const categories: Record<string, number> = {};
    let totalMonthly = 0;

    expenses.forEach((expense) => {
      categories[expense.expenditureType] =
        (categories[expense.expenditureType] || 0) + expense.amount;
      totalMonthly += expense.amount;
    });

    const categoryEntries = Object.entries(categories);
    const chartData = categoryEntries.map(([category, total]) => ({
      category,
      total,
    }));

    const categoryData = categoryEntries
      .map(([category, total]) => ({
        category,
        total,
        percentage: `${((total / totalMonthly) * 100).toFixed(0)}%`,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);

    return { categoryData, chartData, totalMonthly };
  }, [expensesSnapshot]);

  const categoryColors = [
    { iconBgColor: "#539bff1c", iconTextColor: "#539bff", barColor: "#539bff" },
    { iconBgColor: "#13deb91c", iconTextColor: "#13deb9", barColor: "#13deb9" },
    { iconBgColor: "#ffae1f1c", iconTextColor: "#ffae1f", barColor: "#ffae1f" },
    { iconBgColor: "#fa896b1c", iconTextColor: "#fa896b", barColor: "#fa896b" },
  ];

  if (error) {
    return (
      <div className="max-w-md text-xs font-light text-red-500">
        Error loading transactions: {error.message}
      </div>
    );
  }
  console.log(chartData);

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
      <CardHeader className="p-0 m-0 pt-4 px-4 mb-8">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="font-semibold text-lg">
              KES {totalMonthly.toFixed(2)}
            </h1>
            <p className="text-[#7c8fac] text-sm">Monthly Expenditure</p>
          </div>
          <div className="flex gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={month} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-64">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : chartData.length > 0 ? (
            <BarChart
            barSize={24}
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickMargin={0}
              className="-ml-4"
              axisLine={false}
              tickLine={false}
              domain={[0, "auto"]} 
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="total"
              radius={6}
              fill={({ index }) =>
                categoryColors[index % categoryColors.length].barColor
              }
            />
          </BarChart>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No expenses recorded this month
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col justify-between items-start">
        {categoryData.map((data, index) => (
          <StatsItem
            key={data.category}
            iconBgColor={categoryColors[index]?.iconBgColor || "#539bff1c"}
            iconTextColor={categoryColors[index]?.iconTextColor || "#539bff"}
            category={data.category}
            amount={data.total}
            percentage={data.percentage}
          />
        ))}
      </CardFooter>
    </Card>
  );
};

export default MonthlyExpenditure;
