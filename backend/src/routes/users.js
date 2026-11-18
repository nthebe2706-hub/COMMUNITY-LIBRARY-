import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { authenticate,allowRoles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router=Router();
const safe=u=>({id:u.id,name:u.name,membershipId:u.membership_id,role:u.role,createdAt:u.created_at});
router.get("/",asyncHandler(async(req,res)=>{
  const [[{total}]]=await pool.query("SELECT COUNT(*) AS total FROM users");
  if(Number(total)===0)return res.json({users:[],setupRequired:true});
  const header=req.headers.authorization||"";
  if(!header.startsWith("Bearer "))return res.status(401).json({message:"Sign in as an administrator to view users."});
  let session;
  try{session=jwt.verify(header.slice(7),process.env.JWT_SECRET);}catch{return res.status(401).json({message:"Please sign in again."});}
  if(session.role!=="Admin")return res.status(403).json({message:"Only administrators can view user accounts."});
  const [rows]=await pool.query("SELECT id,name,membership_id,role,created_at FROM users ORDER BY name");
  res.json({users:rows.map(safe),setupRequired:false});
}));
router.post("/",asyncHandler(async(req,res)=>{
  const [[{total}]]=await pool.query("SELECT COUNT(*) AS total FROM users");
  const first=Number(total)===0;
  if(!first){
    const header=req.headers.authorization||"";
    if(!header.startsWith("Bearer "))return res.status(401).json({message:"Administrator sign-in is required."});
    let session;try{session=jwt.verify(header.slice(7),process.env.JWT_SECRET);}catch{return res.status(401).json({message:"Please sign in again."});}
    if(session.role!=="Admin")return res.status(403).json({message:"Only an administrator can add users."});
  }
  const {name,membershipId,password}=req.body||{};
  const role=first?"Admin":req.body.role;
  if(!name?.trim()||!membershipId?.trim()||!password)return res.status(400).json({message:"Name, membership ID and password are required."});
  if(String(password).length<8)return res.status(400).json({message:"Password must contain at least 8 characters."});
  if(!["Admin","Librarian","Member"].includes(role))return res.status(400).json({message:"Select a valid role."});
  const hash=await bcrypt.hash(String(password),12);
  const [result]=await pool.execute("INSERT INTO users(name,membership_id,password_hash,role) VALUES(?,?,?,?)",[name.trim(),membershipId.trim(),hash,role]);
  res.status(201).json({message:first?"First administrator created.":"User created.",user:{id:result.insertId,name:name.trim(),membershipId:membershipId.trim(),role}});
}));
router.put("/:id",authenticate,allowRoles("Admin"),asyncHandler(async(req,res)=>{
  const {name,membershipId,password,role}=req.body||{};
  if(!name?.trim()||!membershipId?.trim()||!["Admin","Librarian","Member"].includes(role))return res.status(400).json({message:"Name, membership ID and a valid role are required."});
  if(Number(req.params.id)===Number(req.user.id)&&role!=="Admin")return res.status(400).json({message:"You cannot remove your own administrator role."});
  if(password&&String(password).length<8)return res.status(400).json({message:"Password must contain at least 8 characters."});
  let result;
  if(password){const hash=await bcrypt.hash(String(password),12);[result]=await pool.execute("UPDATE users SET name=?,membership_id=?,password_hash=?,role=? WHERE id=?",[name.trim(),membershipId.trim(),hash,role,req.params.id]);}
  else [result]=await pool.execute("UPDATE users SET name=?,membership_id=?,role=? WHERE id=?",[name.trim(),membershipId.trim(),role,req.params.id]);
  if(!result.affectedRows)return res.status(404).json({message:"User not found."});
  res.json({message:"User updated."});
}));
router.delete("/:id",authenticate,allowRoles("Admin"),asyncHandler(async(req,res)=>{
  if(Number(req.params.id)===Number(req.user.id))return res.status(400).json({message:"You cannot delete the account you are currently using."});
  const [r]=await pool.execute("DELETE FROM users WHERE id=?",[req.params.id]);
  if(!r.affectedRows)return res.status(404).json({message:"User not found."});
  res.json({message:"User deleted."});
}));
export default router;
