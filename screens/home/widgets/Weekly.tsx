"use client";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { AreaChart, Area } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Grip } from "lucide-react";

const chartData = [{ mobile: 186 }, { mobile: 305 }, { mobile: 237 }, { mobile: 107 },
                  { mobile: 137 }, { mobile: 73 }, { mobile: 209 }, { mobile: 214 }];

const chartConfig = {
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const StatsItem = ({ iconBgColor, iconTextColor }: { iconBgColor: string; iconTextColor: string }) => (
  <div className="flex justify-between items-center mt-4 w-full">
    <div className="flex items-center">
      <div className="h-10 aspect-square rounded-md grid place-items-center"
           style={{ backgroundColor: iconBgColor, color: iconTextColor }}>
        <Grip className="w-6 h-6" />
      </div>
      <div className="ml-1">
        <h1 className="text-lg font-semibold">Weekly</h1>
        <p className="text-[#7c8fac] text-sm">Expenses</p>
      </div>
    </div>
    <p className="text-sm ml-2 py-1 px-2 rounded-md">+20%</p>
  </div>
);

const statsItems = [
  { iconBgColor: "#539bff1c", iconTextColor: "#539bff" },
  { iconBgColor: "#13deb91c", iconTextColor: "#13deb9" },
  { iconBgColor: "#ffae1f1c", iconTextColor: "#ffae1f" },
  { iconBgColor: "#fa896b1c", iconTextColor: "#fa896b" }
];

const Weekly = () => (
  <Card className="col-span-12 md:col-span-6 lg:col-span-4 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
    <CardHeader className="p-0 m-0 pt-4 px-4 mb-8">
      <h1 className="font-semibold text-lg">$10,230</h1>
      <p className="text-[#7c8fac] text-sm">Expense</p>
    </CardHeader>

    <CardContent className="max-h-24">
      <ChartContainer className="h-28 w-full" config={chartConfig}>
        <AreaChart accessibilityLayer data={chartData} margin={{ left: 12, right: 12 }}>
          <defs>
            <linearGradient id="mobileGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-mobile)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="transparent" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area dataKey="mobile" type="monotone" fill="url(#mobileGradient)"
                stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
        </AreaChart>
      </ChartContainer>
    </CardContent>

    <CardFooter className="flex-col justify-between items-start">
      {statsItems.map((item, index) => (
        <StatsItem key={index} {...item} />
      ))}
    </CardFooter>
  </Card>
);

export default Weekly;
