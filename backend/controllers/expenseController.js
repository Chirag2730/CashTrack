import xlsx from 'xlsx';
import Expense from '../models/Expense.js';
import moment from 'moment';

// Add Expense sources
export const addExpense = async (req, res) =>  {
    const userId = req.user.id;

    try {
        const {icon, category, amount, date} = req.body;

        // Validation: Check for missing fields
        if(!category || !amount || !date){
            return res.status(400).json({message:"All fields are required"});
        }

        // Create a new expense entry
        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date)
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

// Get all Expense sources
export const getAllExpense = async (req, res) => {
    const userId = req.user.id;

    try {
        const expense = await Expense.find({userId}).sort({date: -1});
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

// Delete Expense sources
export const deleteExpense = async (req, res) => {
    const expenseId = await Expense.findById(req.params.id)
    if (!expenseId) {
        return res.status(400).json({ message: "Expense not found" });
    }

    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Expense source deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

// Download Excel
export const downloadExpenseExcel = async (req, res) => {
    const userId= req.user.id;
    try {
        const expense= await Expense.find({userId}).sort({date: -1});


        // prepare data for excel
        const data= expense.map((item)=>({
            Category: item.category,
            Amount: item.amount,
            Date: moment(item.date).format("DD/MM/YYYY"),
        }));

        const wb=xlsx.utils.book_new();
        const ws=xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Expense");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");

    } catch (error) {
        res.status(500).json({message:"Server Error", error: error.message});
    }
};