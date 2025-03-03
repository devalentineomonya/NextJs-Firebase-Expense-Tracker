import CurrentPrecipitation from "@/screens/home/components/CurrentPrecipitation";
import HeroBanner from "@/screens/home/components/HeroBanner";
import OtherCities from "@/screens/home/widgets/OtherCities";
import MonthlyIncome from "@/screens/home/widgets/MonthlyIncome";
import Pressure from "@/screens/home/widgets/Pressure";
import SummaryTable from "@/screens/home/widgets/SummaryTable";
import Expenditure from "@/screens/home/widgets/Expenditure";
import Trends from "@/screens/home/widgets/Trends";
import IncomeAndExpense from "@/screens/home/widgets/IncomeAndExpense";
import Weekly from "@/screens/home/widgets/Weekly";
import ExpenseSavingsRevenue from "@/screens/home/widgets/ExpenseSavingsRevenue";
export default function Home() {
  return (
    <main className="grid grid-cols-12 px-4 my-12 max-w-[1200px] ">
      <HeroBanner />
      <Expenditure />
      <MonthlyIncome />
      <IncomeAndExpense />
      <ExpenseSavingsRevenue />
      <CurrentPrecipitation />
      <Pressure />
      <Weekly />
      <OtherCities />
      <Trends />
      <SummaryTable />
    </main>
  );
}
