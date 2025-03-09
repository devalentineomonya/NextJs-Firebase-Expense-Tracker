"use client";

import { Button } from "@/components/ui/button";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import { collection, orderBy, query, where, limit } from "firebase/firestore";
import { Grip } from "lucide-react";
import React, { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/lib/firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Income } from "@/types/Income";
import Link from "next/link";

const fill = ["#5d87ff", "#49beff", "#ffae1f", "#c8c814", "#13deb9"];

const IncomeButton = ({
  source,
  id,
  amount,
  idx,
}: Income & { idx: number }) => (
  <Button
    className="hover:bg-transparent py-8 w-full my-1 flex justify-between items-center"
    variant="ghost"
  >
    <div className="flex gap-x-2 items-center">
      <div
        className="h-10 aspect-square rounded-md grid place-items-center"
        style={{
          backgroundColor: `${fill[idx]}1c`,
          color: fill[idx],
        }}
      >
        <Grip className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-semibold text-lg">{source.slice(0, 10)}</h4>
        <p className="text-[#7c8fac] text-sm text-start">KES {amount}</p>
      </div>
    </div>
    <Link
      href={`income/${id}`}
      className="dark:text-gray-400 text-gray-500 text-xs"
    >
      View All
    </Link>
  </Button>
);

const IncomeSources = () => {
  const [user] = useAuthState(auth);
  const incomeQuery = user
    ? query(
        collection(firestore, "income"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(5)
      )
    : null;

  const [income, loading, error] = useCollection(incomeQuery);
  const incomeData = useMemo(() => {
    return income?.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Income[];
  }, [income]);

  if (error) {
    return (
      <div className="max-w-md text-xs font-light text-red-500">
        Error loading transactions: {error.message}
      </div>
    );
  }
  const totalIncome = incomeData?.reduce(
    (acc, income) => acc + income.amount,
    0
  );
  return (
    <Card className="col-span-12 md:col-span-6 lg:col-span-4 shadow-[rgba(145,_158,_171,_0.3)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px] rounded-md bg-transparent">
      <CardHeader className="p-0 m-0 pt-4 px-4 mb-4">
        <h1 className="font-semibold text-lg">KES {totalIncome}</h1>
        <p className="text-[#7c8fac] text-sm">Income</p>
      </CardHeader>

      <CardContent className="pb-0">
        {loading ? (
          <Skeleton className="h-[300px] w-full mt-6 mb-2" />
        ) : (
          incomeData
            ?.slice(0, 5)
            .map((income, index) => (
              <IncomeButton key={index} {...income} idx={index} />
            ))
        )}
        <Link href={`/income`}>
          <Button
            className="w-full py-1 bg-transparent border-indigo-400"
            variant="outline"
          >
            View All
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default IncomeSources;
