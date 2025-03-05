import TransactionTable from "@/screens/transactions/TransactionTable";
import TransactionModal from "@/screens/transactions/TransactionModal";

const TransactionsPage = () => {
  return (
    <div className="w-full h-full my-12 max-w-[1200px]">
      <TransactionTable />
      <TransactionModal />
    </div>
  );
};

export default TransactionsPage;
