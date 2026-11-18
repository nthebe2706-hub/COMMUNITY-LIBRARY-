import { Router } from "express";
import pool from "../config/database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router=Router();
router.get("/summary",asyncHandler(async(req,res)=>{
  const [[users]]=await pool.query("SELECT COUNT(*) AS users FROM users");
  const [[transactions]]=await pool.query("SELECT COUNT(*) AS transactions FROM transactions");
  res.json({users:Number(users.users),transactions:Number(transactions.transactions)});
}));
export default router;
