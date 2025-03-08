import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type TimelineItemProps = {
  time: string;
  variant: "primary" | "info" | "success" | "warning" | "error";
  showLine?: boolean;
  children: React.ReactNode;
};

const TimelineItem = ({
  time,
  variant,
  showLine = true,
  children,
}: TimelineItemProps) => {
  const borderColors = {
    primary: "#539bff",
    info: "#13deb9",
    success: "#fa896b",
    warning: "#ffae1f",
    error: "#ffae1f",
  };

  return (
    <div className="flex gap-x-3">
      <div className="w-1/4 text-end">
        <span>{time}</span>
      </div>
      <div
        className={`relative ${
          showLine
            ? "after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-border dark:after:bg-gray-500"
            : "after:hidden"
        }`}
      >
        <div className="relative z-[1] w-7 h-7 flex justify-center items-center">
          <div
            className={`h-3 w-3 rounded-full bg-transparent border-2`}
            style={{ borderColor: borderColors[variant] }}
          />
        </div>
      </div>
      <div className="w-1/4 grow pt-0.5 pb-6">{children}</div>
    </div>
  );
};

const timelineItems = [
  {
    time: "09:30",
    variant: "primary" as const,
    children: <p>Payment received from John Doe of $385.90</p>,
  },
  {
    time: "10:00 am",
    variant: "info" as const,
    children: (
      <div>
        <h6>New sale recorded</h6>
        <a className="text-primary" href="#">
          #ML-3467
        </a>
      </div>
    ),
  },
  {
    time: "12:00 am",
    variant: "success" as const,
    children: <p>Payment was made of $64.95 to Michael</p>,
  },
  {
    time: "09:30 am",
    variant: "warning" as const,
    children: (
      <div>
        <h6>New sale recorded</h6>
        <a className="text-primary" href="#">
          #ML-3467
        </a>
      </div>
    ),
  },
  {
    time: "09:30 am",
    variant: "error" as const,
    children: (
      <div>
        <h6>New sale recorded</h6>
        <a className="text-primary" href="#">
          #ML-3467
        </a>
      </div>
    ),
  },
  {
    time: "12:00 am",
    variant: "success" as const,
    children: <p>Payment Done</p>,
    showLine: false,
  },
];

const ActivityLogs = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
      <CardHeader className="p-0 m-0 pt-4 px-4 mb-4">
        <h1 className="font-semibold text-lg">Activity Logs</h1>
        <p className="text-[#7c8fac] text-sm">
          User activities in the last 30 days
        </p>
      </CardHeader>
      <CardContent className="pb-0">
        <div className="mt-6">
          {timelineItems.map((item, index) => (
            <TimelineItem
              key={index}
              time={item.time}
              variant={item.variant}
              showLine={item.showLine}
            >
              {item.children}
            </TimelineItem>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogs;
