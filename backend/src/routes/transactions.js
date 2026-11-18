import { Router } from "express";
import pool from "../config/database.js";
import { authenticate,allowRoles } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const router=Router();
router.get("/",authenticate,asyncHandler(async(req,res)=>{
  const [transactions]=await pool.query(`
    SELECT t.id,t.book_id AS bookId,COALESCE(t.book_title_snapshot,b.title,'Deleted book') AS bookTitle,
    t.type,t.quantity,t.created_at AS createdAt,u.name AS userName
    FROM transactions t LEFT JOIN books b ON b.id=t.book_id LEFT JOIN users u ON u.id=t.user_id
    ORDER BY t.created_at DESC LIMIT 500`);
  res.json({transactions});
}));
router.post("/",authenticate,asyncHandler(async(req,res)=>{
  const {bookId,type}=req.body||{};const quantity=Number(req.body?.quantity);
  if(!Number.isInteger(Number(bookId))||Number(bookId)<1)return res.status(400).json({message:"Select a valid book."});
  if(!["add","borrow","return"].includes(type))return res.status(400).json({message:"Transaction type must be add, borrow or return."});
  if(!Number.isInteger(quantity)||quantity<1)return res.status(400).json({message:"Quantity must be a whole number greater than zero."});
  if(type==="add"&&!["Admin","Librarian"].includes(req.user.role))return res.status(403).json({message:"Only administrators and librarians can add stock."});
  const conn=await pool.getConnection();
  try{
    await conn.beginTransaction();
    const [rows]=await conn.execute("SELECT id,title,quantity FROM books WHERE id=? FOR UPDATE",[Number(bookId)]);
    if(!rows.length){await conn.rollback();return res.status(404).json({message:"Book not found."});}
    const book=rows[0];let newQty=Number(book.quantity);
    if(type==="borrow"){
      if(newQty<quantity){await conn.rollback();return res.status(400).json({message:`Only ${newQty} copy/copies are currently available.`});}
      newQty-=quantity;
    } else if(type==="return"){
      const [[outstanding]]=await conn.execute(
        "SELECT COALESCE(SUM(CASE WHEN type='borrow' THEN quantity WHEN type='return' THEN -quantity ELSE 0 END),0) AS quantity FROM transactions WHERE book_id=? AND user_id=?",
        [book.id,req.user.id]
      );
      if(Number(outstanding.quantity)<quantity){
        await conn.rollback();
        return res.status(400).json({message:`Your recorded outstanding borrowing is ${Number(outstanding.quantity)} copy/copies.`});
      }
      newQty+=quantity;
    } else newQty+=quantity;
    await conn.execute("UPDATE books SET quantity=? WHERE id=?",[newQty,book.id]);
    await conn.execute("INSERT INTO transactions(book_id,book_title_snapshot,user_id,type,quantity) VALUES(?,?,?,?,?)",[book.id,book.title,req.user.id,type,quantity]);
    await conn.commit();
    res.status(201).json({message:"Transaction recorded and stock updated.",quantity:newQty});
  }catch(error){await conn.rollback();throw error;}finally{conn.release();}
}));
export default router;
