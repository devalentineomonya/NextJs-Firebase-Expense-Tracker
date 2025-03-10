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
import { exportData } from "@/lib/utils";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo, useCallback, useEffect } from "react";
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
import { Expense } from "@/types/Expenses";
import { toast } from "sonner";
import ExportButton from "@/components/common/exportButton/ExportButton";
import TableLoading from "@/components/common/loader/TableLoading";

const ExpensesTable = () => {
  const [user] = useAuthState(auth);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [exportType, setExportType] = useState<"csv" | "excel" | "pdf">();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [referenceFilter, setReferenceFilter] = useState("");

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
            dateSpent: doc.data().dateSpent.toDate(),
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
      header: "Expenditure Type",
      cell: ({ row }) => <Badge>{row.original.expenditureType}</Badge>,
    },
    {
      accessorKey: "referenceNumber",
      header: "Reference Number",
    },
    {
      accessorKey: "dateSpent",
      header: "Date Spent",
      cell: ({ row }) => {
        const date = row.original.dateSpent;
        if (!date) return "N/A";
        return format(date, "PPPPpppp");
      },
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
      columnFilters: [
        {
          id: "referenceNumber",
          value: referenceFilter,
        },
      ],
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const dataToExport = expensesData.map((expense) => ({
      Amount: expense.amount,
      "Date Spent": format(expense.dateSpent, "PPPPpppp"),
      "Expenditure Type": expense.expenditureType,
      "Payment Method": expense.paymentMethod,
      "Reference Number": expense.referenceNumber,
    }));
    if (exportType) {
      exportData(dataToExport, "expenses", exportType);
    }
  }, [exportType, expensesData]);

  if (loading) {
    return <TableLoading />;
  }

  if (error) {
    return (
      <div className="max-w-md text-base font-medium text-red-500">
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
                value={referenceFilter}
                onChange={(e) => setReferenceFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center flex-col gap-2">
          <Button variant="outline" onClick={onOpen}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Expense
          </Button>
          <ExportButton setExportType={setExportType} />
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
