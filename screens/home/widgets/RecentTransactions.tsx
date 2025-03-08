"use client";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { firestore, auth } from "@/lib/firebase/config";
import { Transaction } from "@/types/Transactions";
import { Badge, BadgeProps } from "@/components/ui/badge";

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      return <h6 className="font-medium">{row.original.id.slice(0, 3)}...</h6>;
    },
  },
  {
    header: "Transaction",
    accessorKey: "receiverName",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <h6 className="font-medium">{row.original.receiverName}</h6>
          <p className="text-sm text-gray-500">
            {row.original.referenceNumber.slice(0, 10)}...
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "receiver",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variantMap: Record<string, BadgeProps["variant"]> = {
        success: "success",
        pending: "warning",
        failed: "destructive",
      };
      return <Badge variant={variantMap[status]}>{status}</Badge>;
    },
  },
];

const RecentTransactions = () => {
  const [user] = useAuthState(auth);

  const transactionsQuery = user
    ? query(
        collection(firestore, "transactions"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
        limit(5)
      )
    : null;

  const [transactions, loading, error] = useCollection(transactionsQuery);

  const data = useMemo(
    () =>
      transactions?.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Transaction)
      ) || [],
    [transactions]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return (
      <div className="max-w-md text-xs font-light text-red-500">
        Error loading transactions: {error.message}
      </div>
    );
  }
  return (
    <Card className="col-span-12 lg:col-span-8 rounded-lg bg-transparent flex flex-col shadow-[rgba(145,_158,_171,_0.2)_0px_0px_2px_0px,_rgba(145,_158,_171,_0.02)_0px_12px_24px_-4px]">
      <CardHeader className="p-0 m-0 pt-4 px-4">
        <h1 className="font-semibold text-lg">Recent Transactions</h1>
        <p className="text-[#7c8fac] text-sm">
          How to secure recent transactions
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full mt-6" />
        ) : (
          <Table className="mt-6">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="pb-2" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow
                    className="hover:bg-transparent"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className={`py-4 ${
                          rowIndex === table.getRowModel().rows.length - 1
                            ? ""
                            : " border-y border-y-gray-200 dark:border-y-gray-700"
                        }`}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
