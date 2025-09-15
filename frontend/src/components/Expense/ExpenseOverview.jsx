import React, { useEffect, useState } from "react";
import { prepExpLineChartData } from "../../utils/helper";
import { LuPlus } from "react-icons/lu";
import CustomLineChart from "../Charts/CustomLineChart";

const ExpenseOverview = ({ transactions, onAddExpense }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepExpLineChartData(transactions);
    setChartData(result);
    return () => {};
  }, [transactions]);

  return (
    <div className="card">
        <div className="flex items-center justify-between">
            <div className="">
                <h5 className="text-lg">Expense Overview</h5>
                <p className="text-xs text-gray-400 mt-0.5">
                    Track your spendings overtime and gain insights to where
                    your money goes
                </p>
            </div>
            <button className="add-btn" onClick={onAddExpense}>
                <LuPlus className="text-lg"/>Add Expense
            </button>
        </div>
        <div className="mt-10">
            <CustomLineChart data={chartData}/>
        </div>
    </div>
  )
};

export default ExpenseOverview;
