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
import { useState, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import ExpensesPagination from "./ExpensesPagination";
import { useExpenseModal } from "@/lib/zustand/use-expense";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Expense } from "@/types/Expenses";
import { toast } from "sonner";

const ExpensesTable = () => {
  const [user] = useAuthState(auth);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { onOpen, onEdit } = useExpenseModal();

  const expensesQuery = user
    ? query(
        collection(firestore, "expenses"),
        where("userId", "==", user.uid),
        orderBy("dateSpent", "desc")
      )
    : null;

  const [expenses, loading, error] = useCollection(expensesQuery);

  const expensesData = useMemo(
    () =>
      expenses?.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Expense)
      ) || [],
    [expenses]
  );

  const handleEdit = useCallback(
    (expense: Expense) => {
      onEdit({
        ...expense,
        dateSpent: expense.dateSpent,
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
      await deleteDoc(doc(firestore, "expenses", deletingId));
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `KES ${row.original.amount.toFixed(2)}`,
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Mode",
    },

    {
      accessorKey: "expenditureType",
      header: "ExpenditureType",
      cell: ({ row }) => <Badge>{row.original.expenditureType}</Badge>,
    },
    {
      accessorKey: "referenceNumber",
      header: "Reference Number",
    },
    {
      accessorKey: "dateSpent",
      header: "Date Spent",
      cell: ({ row }) => format(row.original.dateSpent.toDate(), "PPPPpppp"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const expense = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(expense)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(expense.id)}
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
    data: expensesData,
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
    const exportData = expensesData.map((expense) => ({
      Amount: expense.amount,
      "Date Spent": format(expense.dateSpent.toDate(), "PPPPpppp"),
      "Expenditure Type": expense.expenditureType,
      "Payment Method": expense.paymentMethod,
      "Reference Number": expense.referenceNumber,
    }));

    exportToCSV(exportData, "expenses");
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
        Error loading expenses: {error.message}
      </div>
    );
  }

  return (
    <Card className="shadow-none rounded-md border-none px-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-0">
        <div className="space-y-2">
          <CardTitle>All Expenses</CardTitle>
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
          <Button variant="outline" onClick={onOpen}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Ne Expense
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
              {table.getRowModel().rows.length ? (
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
                    No expenses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="px-0">
        <ExpensesPagination
          currentPage={pagination.pageIndex + 1}
          totalPages={Math.ceil(
            (expensesData?.length || 0) / pagination.pageSize
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

export default ExpensesTable;
