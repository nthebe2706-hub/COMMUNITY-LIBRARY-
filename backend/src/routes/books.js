import { Router } from "express";
import pool from "../config/database.js";
import { authenticate,allowRoles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router=Router();
const fields=["title","author","genre","isbn"];
function validate(body){
  for(const f of fields) if(typeof body[f]!=="string"||!body[f].trim()) return `${f[0].toUpperCase()+f.slice(1)} is required.`;
  const q=Number(body.quantity);
  if(!Number.isInteger(q)||q<0) return "Quantity must be a whole number, zero or greater.";
  return null;
}
router.get("/",asyncHandler(async(req,res)=>{
  const [books]=await pool.query("SELECT id,title,author,genre,isbn,quantity,created_at AS createdAt,updated_at AS updatedAt FROM books ORDER BY title ASC");
  res.json({books});
}));
router.post("/",authenticate,allowRoles("Admin","Librarian"),asyncHandler(async(req,res)=>{
  const error=validate(req.body);if(error)return res.status(400).json({message:error});
  const b=req.body;
  const [result]=await pool.execute("INSERT INTO books(title,author,genre,isbn,quantity) VALUES(?,?,?,?,?)",[b.title.trim(),b.author.trim(),b.genre.trim(),b.isbn.trim(),Number(b.quantity)]);
  const [rows]=await pool.execute("SELECT id,title,author,genre,isbn,quantity FROM books WHERE id=?",[result.insertId]);
  res.status(201).json({message:"Book created.",book:rows[0]});
}));
router.put("/:id",authenticate,allowRoles("Admin","Librarian"),asyncHandler(async(req,res)=>{
  const error=validate(req.body);if(error)return res.status(400).json({message:error});
  const b=req.body;
  const [result]=await pool.execute("UPDATE books SET title=?,author=?,genre=?,isbn=?,quantity=? WHERE id=?",[b.title.trim(),b.author.trim(),b.genre.trim(),b.isbn.trim(),Number(b.quantity),req.params.id]);
  if(!result.affectedRows)return res.status(404).json({message:"Book not found."});
  res.json({message:"Book updated."});
}));
router.delete("/:id",authenticate,allowRoles("Admin","Librarian"),asyncHandler(async(req,res)=>{
  const [result]=await pool.execute("DELETE FROM books WHERE id=?",[req.params.id]);
  if(!result.affectedRows)return res.status(404).json({message:"Book not found."});
  res.json({message:"Book deleted."});
}));
export default router;
