import { Skeleton } from "@/components/ui/skeleton";

const TableLoading = () => {
  return (
    <div>
      <Skeleton className="h-8 w-[150px] -mb-3" />
      <div className="flex flex-row items-center justify-between space-y-0 px-0">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex items-center flex-col gap-2">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-8 w-[150px]" />
        </div>
      </div>
      <Skeleton className="h-[350px] w-full mt-8" />
    </div>
  );
};

export default TableLoading;
