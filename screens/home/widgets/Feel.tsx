"use client";
import { AreaChart, Area } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Grip } from "lucide-react";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const Feel = () => {
  return (
    <Card className="lg:row-span-6 col-span-12 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
      <CardHeader className="flex items-center justify-between flex-row">
        <div className="flex flex-col">
          <h1 className="font-semibold text-lg">$10,230</h1>
          <p className="text-[#7c8fac] text-sm">Expense</p>
        </div>
        <div className="w-11 aspect-square  bg-[#5d87ff1c] text-[#5d87ff] rounded-md grid place-items-center ">
            <Grip className="w-6 h-6" />
        </div>
      </CardHeader>
      <CardContent className="max-h-24">
        <ChartContainer className="h-28 w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="mobileGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.3}
                />
                <stop offset="100%" stopColor="transparent" stopOpacity={0} />
              </linearGradient>
            </defs>

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#mobileGradient)"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Feel;
