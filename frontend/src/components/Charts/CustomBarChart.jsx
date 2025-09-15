import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Alternate colors for bars
const getBarColor = (index) => {
  return index % 2 === 0 ? "#875CF5" : "#CFBEFB";
};

// Group data by month and collect sources + total amount
const groupDataByMonth = (data) => {
  const grouped = {};

  data.forEach(({ month, amount, source }) => {
    if (!grouped[month]) {
      grouped[month] = {
        month,
        amount: 0,
        entries: [],
      };
    }

    grouped[month].amount += amount;
    grouped[month].entries.push({ source, amount });
  });

  return Object.values(grouped);
};

// Custom tooltip that lists all sources and amounts
const customTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entries = payload[0].payload.entries || [];

    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        {entries.map((entry, index) => (
          <div key={index} className="mb-1">
            <p className="text-xs font-semibold text-purple-800">
              {entry.source}
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

const CustomBarChart = ({ data }) => {
  const groupedData = groupDataByMonth(data);

  return (
    <div className="bg-white mt-6">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={groupedData}>
          <CartesianGrid stroke="none" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#555" }}
            stroke="none"
          />
          <Tooltip content={customTooltip} />

          <Bar
            dataKey="amount"
            radius={[10, 10, 0, 0]}
          >
            {groupedData.map((_, index) => (
              <Cell key={index} fill={getBarColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
