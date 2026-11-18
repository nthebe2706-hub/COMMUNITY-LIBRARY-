import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle.jsx";
import { api } from "../utils/api.js";
export default function Transactions({currentUser}) {
  const [books,setBooks]=useState([]); const [transactions,setTransactions]=useState([]);
  const [bookId,setBookId]=useState(""); const [type,setType]=useState("borrow"); const [quantity,setQuantity]=useState("1");
  const [message,setMessage]=useState(""); const [error,setError]=useState("");
  const canTransact=Boolean(currentUser);
  async function load(){try{const [b,t]=await Promise.all([api("/books"),api("/transactions")]);setBooks(b.books);setTransactions(t.transactions);setError("");}catch(e){setError(e.message);}}
  useEffect(()=>{load();},[]);
  async function submit(e){e.preventDefault();setMessage("");setError("");try{await api("/transactions",{method:"POST",body:JSON.stringify({bookId:Number(bookId),type,quantity:Number(quantity)})});setMessage("Transaction recorded and stock updated.");setBookId("");setQuantity("1");await load();}catch(e){setError(e.message);}}
  return <div className="page">
    <PageTitle eyebrow="STOCK CONTROL" title="Transactions" description="Record stock arrivals, borrowing and returned books." />
    {(message||error)&&<p className={error?"form-message":"success-message"} role="status">{error||message}</p>}
    <div className="content-grid transaction-grid">
      <section className="panel form-panel"><div className="panel-heading"><div><h3>Record a transaction</h3><p>Stock in, borrow or return</p></div><span className="panel-number">02</span></div>
        {!canTransact?<div className="empty-state compact"><h3>Sign in required</h3><p>Sign in to record stock movements.</p></div>:books.length===0?<div className="empty-state compact"><h3>Add a book first</h3><p>There are no books to transact yet.</p></div>:
        <form className="form-stack" onSubmit={submit}>
          <label>Select book<select value={bookId} onChange={e=>setBookId(e.target.value)} required><option value="">Choose a book</option>{books.map(b=><option key={b.id} value={b.id}>{b.title} — {b.quantity} in stock</option>)}</select></label>
          <label>Transaction type<select value={type} onChange={e=>setType(e.target.value)}><option value="add">Add stock (new arrival)</option><option value="borrow">Borrow book (deduct stock)</option><option value="return">Return borrowed book</option></select></label>
          <label>Quantity<input type="number" min="1" step="1" value={quantity} onChange={e=>setQuantity(e.target.value)} required /></label>
          <button className="button button-primary" type="submit">Save transaction</button>
        </form>}
      </section>
      <section className="panel catalogue-panel"><div className="panel-heading"><div><h3>Current stock</h3><p>Live quantities</p></div></div>
        <div className="stock-list">{books.length===0?<p className="muted">No books in catalogue.</p>:books.map(b=><div className="stock-item" key={b.id}><div><b>{b.title}</b><small>{b.author}</small></div><span className={`status ${b.quantity<2?"status-low":"status-good"}`}>{b.quantity} copies</span></div>)}</div>
      </section>
    </div>
    <section className="panel history-panel"><div className="panel-heading"><div><h3>Transaction history</h3><p>{transactions.length} recorded transaction(s)</p></div></div>
      {transactions.length===0?<div className="empty-state compact"><h3>No transactions recorded</h3><p>Saved stock movements will appear here.</p></div>:
      <div className="table-wrap"><table><thead><tr><th>Book</th><th>Action</th><th>Quantity</th><th>Processed by</th><th>Date and time</th></tr></thead><tbody>{transactions.map(t=><tr key={t.id}><td className="cell-strong">{t.bookTitle}</td><td><span className={`status ${t.type==="add"||t.type==="return"?"status-good":"status-blue"}`}>{t.type==="add"?"Stock added":t.type==="return"?"Returned":"Borrowed"}</span></td><td>{t.quantity}</td><td>{t.userName||"System"}</td><td>{new Date(t.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}
