"use client";
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, Timestamp } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";
import { getYear, startOfYear, endOfYear, eachMonthOfInterval, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const IncomeAndExpense = () => {
  const [user] = useAuthState(auth);
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));

  // Generate year options
  const years = Array.from({ length: 11 }, (_, i) => getYear(new Date()) - 5 + i);

  // Calculate year range
  const yearStart = startOfYear(new Date(selectedYear, 0));
  const yearEnd = endOfYear(new Date(selectedYear, 11));

  // Income query
  const incomeQuery = user
    ? query(
        collection(firestore, "Income"),
        where("userId", "==", user.uid),
        where("date", ">=", Timestamp.fromDate(yearStart)),
        where("date", "<=", Timestamp.fromDate(yearEnd))
      )
    : null;

  // Expenses query
  const expensesQuery = user
    ? query(
        collection(firestore, "Expenses"),
        where("userId", "==", user.uid),
        where("date", ">=", Timestamp.fromDate(yearStart)),
        where("date", "<=", Timestamp.fromDate(yearEnd))
      )
    : null;

  const [incomeSnapshot, incomeLoading, incomeError] = useCollection(incomeQuery);
  const [expensesSnapshot, expensesLoading, expensesError] = useCollection(expensesQuery);

  const { chartData, netSavings } = useMemo(() => {
    // Initialize all months with empty values
    const months = eachMonthOfInterval({
      start: new Date(selectedYear, 0),
      end: new Date(selectedYear, 11)
    });

    const monthlyData = months.map(month => ({
      month: format(month, "MMM"),
      income: 0,
      expenses: 0,
    }));

    let totalIncome = 0;
    let totalExpenses = 0;

    // Process income data
    incomeSnapshot?.docs.forEach((doc) => {
      const data = doc.data();
      const monthIndex = data.date.toDate().getMonth();
      monthlyData[monthIndex].income += data.amount;
      totalIncome += data.amount;
    });

    // Process expenses data
    expensesSnapshot?.docs.forEach((doc) => {
      const data = doc.data();
      const monthIndex = data.date.toDate().getMonth();
      monthlyData[monthIndex].expenses += data.amount;
      totalExpenses += data.amount;
    });

    return {
      chartData: monthlyData,
      netSavings: totalIncome - totalExpenses
    };
  }, [incomeSnapshot, expensesSnapshot, selectedYear]);

  if (incomeError || expensesError) {
    return (
      <div className="max-w-md text-xs font-light text-red-500">
        Error loading data: {incomeError?.message || expensesError?.message}
      </div>
    );
  }

  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
      <CardHeader className="p-0 m-0 pt-4 px-4 mb-8">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="font-semibold text-lg">KES {netSavings.toFixed(2)}</h1>
            <p className="text-[#7c8fac] text-sm">Net Savings</p>
          </div>
          <div className="flex gap-2">
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
        {incomeLoading || expensesLoading ? (
          <Skeleton className="h-full w-full" />
        ) : chartData.length > 0 ? (
          <BarChart
            data={chartData}
            barSize={10}
            margin={{ left: -35, right: 0, top: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis axisLine={false} tickLine={false} dataKey="month" />
            <YAxis
              tickMargin={0}
              className="-ml-4"
              axisLine={false}
              tickLine={false}
              domain={[0, 'auto']}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelKey="month" indicator="line" />}
            />
            <Bar dataKey="income" fill="#49beff" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="#5d87ff" radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No financial records this year
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeAndExpense;
