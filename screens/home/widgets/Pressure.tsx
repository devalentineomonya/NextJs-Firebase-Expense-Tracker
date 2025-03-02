"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Grip } from "lucide-react";
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const Pressure = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 mt-6 ml-4 flex flex-col shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
      <CardHeader className="p-0 m-0 pt-4 px-4 mb-8">
        <h1 className="font-semibold text-lg">$10,230</h1>
        <p className="text-[#7c8fac] text-sm">Expense</p>
      </CardHeader>
      <CardContent className="w-full h-1/2">
        <ChartContainer className="p-0 m-0  h-full w-full" config={chartConfig}>
          <BarChart barSize={24} accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-between items-center mt-4 h-full ">
        <div className="flex items-center">
          <div className="h-10 aspect-square rounded-md bg-[#5d87ff1c] text-[#5d87ff] grid place-items-center">
            <Grip className="w-6 h-6" />
          </div>
          <div className="ml-1">
            <h3 className="font-medium text-[#7c8fac]">$23,450</h3>
            <h4 className="font-normal text-sm">Total Sales</h4>
          </div>
        </div>
        <div className="flex items-center">
          <div className="h-10 aspect-square rounded-md bg-[#ffae1f1c] text-[#ffae1f] grid place-items-center">
            <Grip className="w-6 h-6" />
          </div>
          <div className="ml-1">
            <h3 className="font-medium text-[#7c8fac]">$23,450</h3>
            <h4 className="font-normal text-sm">Total Sales</h4>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Pressure;
