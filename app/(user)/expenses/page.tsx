import ExpenseModal from "@/screens/expenses/ExpensesModal";
import ExpensesTable from "@/screens/expenses/ExpensesTable";

const ExpensesPage = () => {
  return (
    <div className="w-full h-full my-12 max-w-[1200px]">
      <ExpensesTable />
      <ExpenseModal />
    </div>
  );
};

export default ExpensesPage;
