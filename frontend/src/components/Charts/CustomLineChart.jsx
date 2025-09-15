import React from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

// Group data by month and collect categories + total amount
const groupDataByMonth = (data) => {
  const grouped = {};

  data.forEach(({ month, amount, category }) => {
    if (!grouped[month]) {
      grouped[month] = {
        month,
        amount: 0,
        entries: [],
      };
    }

    grouped[month].amount += amount;
    grouped[month].entries.push({ category, amount });
  });

  return Object.values(grouped);
};

const CustomLineChart = ({ data }) => {
  const groupedData = groupDataByMonth(data);

  // Custom tooltip that shows all categories + amounts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const entries = payload[0].payload.entries || [];

      return (
        <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
          {entries.map((entry, index) => (
            <div key={index} className="mb-1">
              <p className="text-xs font-semibold text-purple-800">
                {entry.category}
              </p>
              <p className="text-sm text-gray-600">
                Amount:{" "}
                <span className="text-sm font-medium text-gray-900">
                  ₹{entry.amount}
                </span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='bg-white'>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={groupedData}>
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor='#875cf5' stopOpacity={0.4} />
              <stop offset="95%" stopColor='#875cf5' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke='none' />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke='#875cf5'
            fill='url(#incomeGradient)'
            strokeWidth={3}
            dot={{ r: 3, fill: "#ab8df8" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
