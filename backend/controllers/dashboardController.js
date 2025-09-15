import Income from '../models/Income.js';
import Expense from '../models/Expense.js';
import { isValidObjectId, Types } from 'mongoose';

// Dashboard Data
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new Types.ObjectId(String(userId));

    // Fetch total income and expenses
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);



    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get income transactions in last 60 days
    const last60DaysIncomeTrans = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total income for last 60 days
    const incomeLast60Days = last60DaysIncomeTrans.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get expense transactions in last 30 days
    const last30DaysExpenseTrans = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total expense for last 30 days
    const expenseLast30Days = last30DaysExpenseTrans.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // This is faster
    const incomeTxns = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5);
    const expenseTxns = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    const lastTransactions = [
      ...incomeTxns.map((txn) => ({ ...txn.toObject(), type: "income" })),
      ...expenseTxns.map((txn) => ({ ...txn.toObject(), type: "expense" })),
    ].sort((a, b) => b.date - a.date);

    // Final response
    res.status(200).json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0,
      last30DaysExpenses: {
        total: expenseLast30Days,
        transactions: last30DaysExpenseTrans,
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60DaysIncomeTrans,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export {getDashboardData}