"use client";
import React from "react";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/config";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import banner from "@/public/banner.png";

const HeroBanner = () => {
  const [user] = useAuthState(auth);
  return (
    <Card className="col-span-12 lg:col-span-8 rounded-lg bg-[rgba(93,_135,_255,_0.1)]">
      <CardContent className="px-4 py-2">
        <div className="flex max-sm:flex-col w-full ">
          <div className="flex-1 py-4 pl-3">
            <div className=" flex items-center gap-x-2  mb-7">
              <Avatar className=" bg-[rgba(93,_135,_255,_0.1)]/50">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h2 className="text-lg capitalize">
                Welcome back {user?.displayName?.split(" ")[0] || "User"}!
              </h2>
            </div>
            <div className="flex items-center divide-x   gap-x-4">
              <div>
                <h1 className="text-3xl text-gray-700 dark:text-gray-200 font-semibold">
                  $2,340
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 font-light">
                  Total Expenses
                </p>
              </div>
              <div className="pl-4">
                <h1 className="text-3xl text-gray-700 dark:text-gray-200 font-semibold">
                  $2,340
                </h1>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 font-light">
                  Total Expenses
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-end ">
            <Image src={banner} alt="earth" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroBanner;
