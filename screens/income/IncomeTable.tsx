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
import { Badge } from "@/components/ui/badge";
import { useIncomeModal } from "@/lib/zustand/use-income";
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
import { Income } from "@/types/Income";
import IncomePagination from "./IncomePagination";

const IncomeTable = () => {
  const [user] = useAuthState(auth);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const incomesQuery = user
    ? query(
        collection(firestore, "income"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      )
    : null;

  const [incomes, loading, error] = useCollection(incomesQuery);

  const { onOpen, onEdit } = useIncomeModal();

  const incomesData = useMemo(
    () =>
      incomes?.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Income)
      ) || [],
    [incomes]
  );

  const handleEdit = useCallback(
    (income: Income) => {
      onEdit({
        ...income,
        createdAt: income.createdAt,
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
      await deleteDoc(doc(firestore, "income", deletingId));
      toast.success("Income deleted successfully");
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<Income>[] = [
    {
      accessorKey: "source",
      header: "Source",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `KES ${row.original.amount.toFixed(2)}`,
    },
    {
      accessorKey: "period",
      header: "Period",
      cell: ({ row }) => <Badge variant="outline">{row.original.period}</Badge>,
    },
    {
      accessorKey: "schedule",
      header: "Schedule",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.schedule}</Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Last Updated",
      cell: ({ row }) => format(row.original.createdAt.toDate(), "PPPPpppp"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const income = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(income)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(income.id)}
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
    data: incomesData,
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
    const exportData = incomesData.map((income) => ({
      Source: income.source,
      Amount: income.amount,
      Period: income.period,
      Schedule: income.schedule,
      "Last Updated": format(income.createdAt.toDate(), "PPPPpppp"),
    }));

    exportToCSV(exportData, "incomes");
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
        Error loading incomes: {error.message}
      </div>
    );
  }

  return (
    <Card className="shadow-none rounded-md border-none px-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-0">
        <div className="space-y-2">
          <CardTitle>Income Sources</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sources..."
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
            Add Income
          </Button>
          <Button onClick={handleExport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export CSV
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
                    No income sources found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="px-0">
        <IncomePagination
          currentPage={pagination.pageIndex + 1}
          totalPages={Math.ceil(
            (incomesData?.length || 0) / pagination.pageSize
          )}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      </CardFooter>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this income source? This action
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

export default IncomeTable;
