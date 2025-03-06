"use client";
import { Bar, BarChart } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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

const Visibility = () => {
  return (
    <Card className="col-span-12 md:col-span-6 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent p-4">
      <CardHeader className="p-0 pb-2  m-0" >
        <div className="w-full max-w-11 aspect-square bg-[#5d87ff1c] text-[#5d87ff] rounded-md grid place-items-center">
            <Grip className="w-6 h-6" />
        </div>
      </CardHeader>
      <CardContent className="p-0 m-0" >
        <ChartContainer  config={chartConfig}>
          <BarChart height={2} accessibilityLayer data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="pb-0 px-0">
        <div className="flex flex-col ">
          <h5 className="font-semibold text-lg">10,230</h5>
          <p className="text-[#7c8fac] text-xs mt-1">Total Visitors</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Visibility;
