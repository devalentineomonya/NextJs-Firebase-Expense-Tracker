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
import { exportToCSV } from "@/lib/utils";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import TransactionPagination from "./TransactionPagination";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { useTransactionModal } from "@/lib/zustand/use-transaction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { auth, firestore } from "@/lib/firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { Transaction } from "@/types/Transactions";

const TransactionTable = () => {
  const [user] = useAuthState(auth);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const transactionsQuery = user
    ? query(
        collection(firestore, "transactions"),
        where("userId", "==", user.uid),
        orderBy("date", "desc")
      )
    : null;

  const [transactions, loading, error] = useCollection(transactionsQuery);

  const { onOpen, onEdit } = useTransactionModal();

  const transactionsData = useMemo(
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

  const handleEdit = useCallback(
    (transaction: Transaction) => {
      onEdit({
        ...transaction,
        date: transaction.date,
      });
    },
    [onEdit]
  );

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId || !user) return;

    try {
      await deleteDoc(doc(firestore, "transactions", deletingId));
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `KES ${row.original.amount.toFixed(2)}`,
    },
    {
      accessorKey: "receiverName",
      header: "Receiver Name",
    },
    {
      accessorKey: "receiver",
      header: "Receiver Email",
    },
    {
      accessorKey: "paymentMode",
      header: "Payment Method",
    },
    {
      accessorKey: "date",
      header: "Paid On",
      cell: ({ row }) => format(row.original.date.toDate(), "PPPPpppp"),
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
    {
      id: "actions",
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
              <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(transaction.id)}
                className="text-destructive"
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

  const table = useReactTable({
    data: transactionsData || [],
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
  });

  const handleExport = () => {
    const exportData = (transactionsData || []).map(
      (transaction: Transaction) => ({
        Amount: transaction.amount,
        "Receiver Name": transaction.receiverName,
        "Receiver Email": transaction.receiver,
        "Payment Method": transaction.paymentMode,
        Date: format(transaction.date.toDate(), "PPPPpppp"),
        Status: transaction.status,
      })
    );

    exportToCSV(exportData, "transactions");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md text-xs font-light text-red-500">
        Error loading transactions: {error.message}
      </div>
    );
  }

  return (
    <Card className="shadow-none rounded-md border-none px-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-0">
        <div className="space-y-2">
          <CardTitle>All Transactions</CardTitle>
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
                      {flexRender(
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap"
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
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
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="px-0">
        <TransactionPagination
          currentPage={pagination.pageIndex + 1}
          totalPages={Math.ceil(
            (transactionsData?.length || 0) / pagination.pageSize
          )}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      </CardFooter>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default TransactionTable;
