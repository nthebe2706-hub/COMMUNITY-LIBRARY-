import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pool from "./config/database.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import transactionRoutes from "./routes/transactions.js";
import userRoutes from "./routes/users.js";
import dashboardRoutes from "./routes/dashboard.js";
const app=express();
app.use(helmet());
app.use(cors({origin:(process.env.FRONTEND_URL||"http://localhost:5173").split(",").map(s=>s.trim()),credentials:false}));
app.use(express.json({limit:"100kb"}));
app.use("/api/auth/login",rateLimit({windowMs:15*60*1000,max:30,standardHeaders:true,legacyHeaders:false,message:{message:"Too many login attempts. Try again later."}}));
app.get("/api/health",async(req,res)=>{try{await pool.query("SELECT 1");res.json({status:"ok",database:"connected"});}catch{res.status(503).json({status:"error",database:"unavailable"});}});
app.use("/api/auth",authRoutes);
app.use("/api/books",bookRoutes);
app.use("/api/transactions",transactionRoutes);
app.use("/api/users",userRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use((req,res)=>res.status(404).json({message:"API endpoint not found."}));
app.use((err,req,res,next)=>{
  if(err?.code==="ER_DUP_ENTRY")return res.status(409).json({message:"That ISBN or membership ID is already registered."});
  console.error(err);
  res.status(500).json({message:process.env.NODE_ENV==="production"?"An unexpected server error occurred.":"Server error. Check backend terminal and database connection."});
});
pool.query(`
  SELECT
    DATABASE() AS databaseName,
    @@hostname AS serverName,
    @@port AS serverPort,
    (SELECT COUNT(*) FROM books) AS bookCount
`).then(([rows]) => {
  console.log("DATABASE CHECK:", rows[0]);
}).catch(console.error);
const port=Number(process.env.PORT||5000);
app.listen(port,()=>console.log(`Community Library API running at http://localhost:${port}`));
