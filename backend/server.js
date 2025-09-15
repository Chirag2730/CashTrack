import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(
    cors({
        origin:process.env.CLIENT_URL || "*",
        methods: ["GET","POST","PUT ","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],

    })
);

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Server upload folder 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*other",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}

app.listen(PORT, ()=>console.log(`server is running on port ${PORT}`));