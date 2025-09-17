import moment from "moment";
import { useUserAuth } from "../../hooks/useUserAuth";
import TransactionInfoCard from "../../components/Cards/TransactionInfoCard";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { API_PATHS } from "../../utils/apiPath";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Recent = () => {
  useUserAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useCallback to memoize fetch function
  const fetchDashboardData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    // fix it so that u get dashboard data and add the total bal, inc, exp
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      if (response?.data?.recentTransactions) {
        setTransactions(response.data.recentTransactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Something went wrong:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formattedTransactions = transactions?.slice(0, 60).map(item => ({
    ...item,
    formattedDate: moment(item.date).format("Do MMM YYYY"),
    title: item.type === 'expense' ? item.category : item.source,
  }));

  return (
    <DashboardLayout activeMenu="Recent">
      <div className="my-5 mx-auto max-w-4xl">
        <div className="card">
          <div className="flex items-center justify-between">
            <h5 className="text-lg ">Recent Transactions</h5>
          </div>

          <div className="mt-6">
            {loading && <p className="text-center py-4">Loading...</p>}
            {error && <p className="text-center text-red-500 py-4">{error}</p>}
            {!loading && !error && formattedTransactions.length === 0 && (
              <p className="text-center py-4">No recent transactions found.</p>
            )}

            {!loading && !error && formattedTransactions.map(item => (
              <TransactionInfoCard
                key={item._id}
                title={item.title}
                icon={item.icon}
                date={item.formattedDate}
                amount={item.amount}
                type={item.type}
                hideDeleteBtn
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Recent;
