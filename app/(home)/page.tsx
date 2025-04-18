import CurrentPrecipitation from "@/screens/home/components/CurrentPrecipitation";
import HeroBanner from "@/screens/home/components/HeroBanner";
import IncomeSources from "@/screens/home/widgets/IncomeSources";
import MonthlyIncome from "@/screens/home/widgets/MonthlyIncome";
import Pressure from "@/screens/home/widgets/Pressure";
import RecentTransactions from "@/screens/home/widgets/RecentTransactions";
import Expenditure from "@/screens/home/widgets/Expenditure";
import ActivityLogs from "@/screens/home/widgets/ActivityLogs";
import IncomeAndExpense from "@/screens/home/widgets/IncomeAndExpense";
import MonthlyExpenditure from "@/screens/home/widgets/MonthlyExpenditure"
import ExpenseSavingsRevenue from "@/screens/home/widgets/ExpenseSavingsRevenue";
export default function Home() {
  return (
    <main className="grid grid-cols-12 px-2 gap-4 my-12 max-w-[1200px] ">
      <HeroBanner />
      <Expenditure />
      <MonthlyIncome />
      <IncomeAndExpense />
      <ExpenseSavingsRevenue />
      <CurrentPrecipitation />
      <Pressure />
      <MonthlyExpenditure />
      <IncomeSources />
      <ActivityLogs />
      <RecentTransactions />
    </main>
  );
}
