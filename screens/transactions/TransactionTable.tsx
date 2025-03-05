"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  Trash,
  Pencil,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { exportToCSV } from "@/lib/utils";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import TransactionPagination from "./TransactionPagination";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { useTransactionModal } from "@/lib/zustand/use-transaction-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Transaction {
  id: string;
  amount: string;
  customer: string;
  reference: string;
  channel: string;
  paidOn: string;
  type: "expense" | "income";
  status: "success" | "pending" | "failed";
}

const TransactionTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { onOpen } = useTransactionModal();
  const data: Transaction[] = [
    {
      id: "1",
      amount: "KES 1,350.00",
      customer: "Mann Makau",
      reference: "1007712931564870",
      channel: "Mobile Money",
      paidOn: "Monday, March 3, 2025 7:09 AM",
      type: "expense",
      status: "success",
    },
    {
      id: "2",
      amount: "KES 1,350.00",
      customer: "Tanny Chud",
      reference: "1370487564113407",
      channel: "Mobile Money",
      paidOn: "Sunday, March 2, 2025 4:59 PM",
      type: "expense",
      status: "success",
    },
    {
      id: "3",
      amount: "KES 855.00",
      customer: "Norbert Ochleng",
      reference: "1436166377607969",
      channel: "Mobile Money",
      paidOn: "Saturday, March 1, 2025 1:01 PM",
      type: "expense",
      status: "success",
    },
  ];

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "customer",
      header: "Customer",
    },
    {
      accessorKey: "reference",
      header: "Reference",
    },
    {
      accessorKey: "channel",
      header: "Channel",
    },
    {
      accessorKey: "paidOn",
      header: "Paid On",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variantMap: Record<string, BadgeProps["variant"]> = {
          success: "success",
          pending: "secondary",
          failed: "destructive",
        };
        return <Badge variant={variantMap[status]}>{status}</Badge>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge
            variant={type === "expense" ? "destructive" : "success"}
            className="capitalize"
          >
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => handleEdit(transaction.id)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleDelete(transaction.id)}
                className="cursor-pointer text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const handleEdit = (id: string) => {
    console.log("Edit transaction:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete transaction:", id);
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const handleExport = () => {
    const exportData = data.map((transaction) => ({
      amount: transaction.amount,
      customer: transaction.customer,
      reference: transaction.reference,
      channel: transaction.channel,
      paidOn: transaction.paidOn,
    }));

    exportToCSV(exportData, "transactions");
  };

  return (
    <Card className="shadow-none rounded-md border-none px-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-0">
        <div className="space-y-2">
          <CardTitle>All Accounts</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reference..."
                className="pl-8"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center flex-col gap-2">
          <Button onClick={onOpen} variant="outline">
            <PlusIcon className="mr-2 h-4 w-4" />
            Transaction
          </Button>
          <Button onClick={handleExport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Report CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="mt-6 px-0">
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.column.columnDef.header as React.ReactNode}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.renderValue() as string}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="px-0">
        <TransactionPagination
          currentPage={pagination.pageIndex + 1}
          totalPages={Math.ceil(data.length / pagination.pageSize)}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      </CardFooter>
    </Card>
  );
};

export default TransactionTable;
