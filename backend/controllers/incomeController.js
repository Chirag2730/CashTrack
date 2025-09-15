import xlsx from 'xlsx';
import Income from '../models/Income.js';
import moment from 'moment';

// Add income sources
export const addIncome = async (req, res) =>  {
    const userId = req.user.id;

    try {
        const {icon, source, amount, date} = req.body;

        // Validation: Check for missing fields
        if(!source || !amount || !date){
            return res.status(400).json({message:"All fields are required"});
        }

        // Create a new income entry
        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });

        await newIncome.save();
        res.status(201).json(newIncome);
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

// Get all income sources
export const getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({userId}).sort({date: -1});
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

// Delete income sources
export const deleteIncome = async (req, res) => {
    const incomeId = await Income.findById(req.params.id)
    if (!incomeId) {
        return res.status(400).json({ message: "Income not found" });
    }

    try {
        await Income.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Income source deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"Server Error"});
    }
};

// Download Excel
export const downloadIncomeExcel = async (req, res) => {
    const userId= req.user.id;
    try {
        const income= await Income.find({userId}).sort({date: -1});


        // prepare data for excel
        const data= income.map((item)=>({
            Source: item.source,
            Amount: item.amount,
            Date: moment(item.date).format("DD/MM/YYYY"),
        }));
        console.log(data);

        const wb=xlsx.utils.book_new();
        const ws=xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Income");
        xlsx.writeFile(wb, "income_details.xlsx");
        res.download("income_details.xlsx");

    } catch (error) {
        res.status(500).json({message:"Server Error", error: error.message});
    }
};