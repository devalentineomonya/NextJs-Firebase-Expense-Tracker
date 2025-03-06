import { Button } from "@/components/ui/button";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import { Grip } from "lucide-react";
import React from "react";

const CityButton = ({
  iconBgColor,
  iconTextColor,
  cityName,
  cityDescription
}: {
  iconBgColor: string;
  iconTextColor: string;
  cityName: string;
  cityDescription: string;
}) => (
  <Button
    className="hover:bg-transparent py-8 w-full my-1 flex justify-between items-center"
    variant="ghost"
  >
    <div className="flex gap-x-2 items-center">
      <div
        className="h-10 aspect-square rounded-md grid place-items-center"
        style={{
          backgroundColor: iconBgColor,
          color: iconTextColor
        }}
      >
        <Grip className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-semibold text-lg">{cityName}</h4>
        <p className="text-[#7c8fac] text-sm">{cityDescription}</p>
      </div>
    </div>
    <p className="dark:text-gray-400 text-gray-500 text-xs">View All</p>
  </Button>
);

const cities = [
  {
    iconBgColor: "#539bff1c",
    iconTextColor: "#539bff",
    cityName: "Nairobi",
    cityDescription: "Nairobi"
  },
  {
    iconBgColor: "#13deb91c",
    iconTextColor: "#13deb9",
    cityName: "Nairobi",
    cityDescription: "Nairobi"
  },
  {
    iconBgColor: "#ffae1f1c",
    iconTextColor: "#ffae1f",
    cityName: "Nairobi",
    cityDescription: "Nairobi"
  },
  {
    iconBgColor: "#fa896b1c",
    iconTextColor: "#fa896b",
    cityName: "Nairobi",
    cityDescription: "Nairobi"
  },
];

const OtherCities = () => {
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
      <CardHeader className="p-0 m-0 pt-4 px-4 mb-4">
        <h1 className="font-semibold text-lg">$10,230</h1>
        <p className="text-[#7c8fac] text-sm">Expense</p>
      </CardHeader>
      <CardContent className="pb-0">
        {cities.map((city, index) => (
          <CityButton key={index} {...city} />
        ))}
        <Button
          className="w-full py-1 bg-transparent border-indigo-400"
          variant="outline"
        >
          View All
        </Button>
      </CardContent>
    </Card>
  );
};

export default OtherCities;
