"use client";
import React from "react";
import { Bar, BarChart } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
];
const chartConfig = {
  running: {
    label: "Running",
    color: "hsl(var(--chart-1))",
  },
  swimming: {
    label: "Swimming",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
const MonthlyIncome = () => {
  const [marginBottom, setMarginBottom] = React.useState(0);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMarginBottom(150);
    }
  }, []);
  return (
    <Card className="col-span-12 md:col-span-6 max-lg:mt-4 max-lg:max-h-64 lg:col-span-2  ml-4 rounded-lg bg-transparent flex flex-col shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px]">
      <CardHeader className="p-0 m-0 pt-4 px-4">
        <h1 className="font-semibold text-lg">$10,230</h1>
        <p className="text-[#7c8fac] text-sm">Expense</p>
      </CardHeader>
      <CardContent className="flex-1 h-full pt-0 ">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            margin={{ bottom: marginBottom }}
            accessibilityLayer
            data={chartData}
            barSize={10}
            className="h-full"
          >
            <Bar
              dataKey="running"
              stackId="a"
              className="mb-0.5"
              fill="var(--color-running)"
              radius={[4, 4, 4, 4]}
            />
            <Bar
              dataKey="swimming"
              stackId="a"
              fill="var(--color-swimming)"
              radius={[4, 4, 4, 4]}
              width={10}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent labelKey="activities" indicator="line" />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyIncome;
