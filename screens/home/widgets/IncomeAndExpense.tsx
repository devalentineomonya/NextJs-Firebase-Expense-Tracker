"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { month: "Jan", savings: 30, expenses: -20 },
  { month: "Feb", savings: 40, expenses: -30 },
  { month: "Mar", savings: 50, expenses: -25 },
  { month: "Apr", savings: 35, expenses: -40 },
  { month: "May", savings: 45, expenses: -35 },
  { month: "Jun", savings: 55, expenses: -30 },
  { month: "Jul", savings: 60, expenses: -45 },
  { month: "Aug", savings: 50, expenses: -50 },
];

const IncomeAndExpense = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 mt-6 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
      <CardHeader className="p-0 m-0 pt-4 px-4 mb-8">
        <h1 className="font-semibold text-lg">$10,230</h1>
        <p className="text-[#7c8fac] text-sm">Expense</p>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            savings: {
              label: "Savings",
              color: "hsl(var(--chart-1))",
            },
            expenses: {
              label: "Expenses",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="min-h-[285px] w-full"
        >
          <BarChart
            data={data}
            barSize={10}
            margin={{ left: -35, right: 0, top: 0, bottom: 0 }}
          >
            <ChartLegend content={<ChartLegendContent />} />
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis axisLine={false} tickLine={false} dataKey="month" />
            <YAxis
              tickMargin={0}
              className="-ml-4"
              axisLine={false}
              tickLine={false}
              domain={[-60, 80]}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={1}
              content={
                <ChartTooltipContent labelKey="month" indicator="line" />
              }
            />
            <Bar dataKey="savings" fill="#49beff" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" fill="#5d87ff" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeAndExpense;
