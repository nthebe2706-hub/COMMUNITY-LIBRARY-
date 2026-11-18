import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle.jsx";
import AddBookForm from "../components/AddBookForm.jsx";
import BookList from "../components/BookList.jsx";
import { api } from "../utils/api.js";
const blank = { title:"", author:"", genre:"", isbn:"", quantity:"1" };
export default function Books({ currentUser }) {
  const [books,setBooks] = useState([]); const [form,setForm] = useState(blank);
  const [editingId,setEditingId] = useState(null); const [message,setMessage] = useState(""); const [error,setError] = useState("");
  const canManage = ["Admin","Librarian"].includes(currentUser?.role);
  async function load(){try{const d=await api("/books");setBooks(d.books);setError("");}catch(e){setError(e.message);}}
  useEffect(()=>{load();},[]);
  function change(e){setForm({...form,[e.target.name]:e.target.value});}
  async function submit(e){
    e.preventDefault();setMessage("");setError("");
    try{
      const payload={...form,quantity:Number(form.quantity)};
      if(!Number.isInteger(payload.quantity)||payload.quantity<0)throw new Error("Quantity must be a whole number, zero or greater.");
      await api(editingId?`/books/${editingId}`:"/books",{method:editingId?"PUT":"POST",body:JSON.stringify(payload)});
      setMessage(editingId?"Book updated successfully.":"Book added successfully.");setForm(blank);setEditingId(null);await load();
    }catch(err){setError(err.message);}
  }
  function edit(b){setEditingId(b.id);setForm({title:b.title,author:b.author,genre:b.genre,isbn:b.isbn,quantity:String(b.quantity)});setMessage("");}
  async function remove(b){if(!window.confirm(`Delete "${b.title}" from the catalogue?`))return;try{await api(`/books/${b.id}`,{method:"DELETE"});setMessage("Book deleted.");await load();}catch(e){setError(e.message);}}
  function cancel(){setEditingId(null);setForm(blank);}
  return <div className="page">
    <PageTitle eyebrow="COLLECTION" title="Book management" description="Add titles, update details and manage stock quantities." />
    {(!currentUser||!canManage)&&<p className="tip-box">Sign in as an Admin or Librarian to add, edit or delete books. The catalogue remains visible to everyone.</p>}
    {(message||error)&&<p className={error?"form-message":"success-message"} role="status">{error||message}</p>}
    <div className="content-grid">
      {canManage&&<AddBookForm form={form} onChange={change} onSubmit={submit} editing={Boolean(editingId)} onCancel={cancel}/>}
      <BookList books={books} canManage={canManage} onEdit={edit} onDelete={remove}/>
    </div>
  </div>;
}
