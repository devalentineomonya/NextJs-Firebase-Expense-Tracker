import IncomeTable from "@/screens/income/IncomeTable";
import IncomeModal from "@/screens/income/IncomeModal";
const IncomePage = () => {
  return (
    <div className="w-full h-full my-12 max-w-[1200px]">
      <IncomeTable />
      <IncomeModal />
    </div>
  );
};

export default IncomePage;
