import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle.jsx";
import UserForm from "../components/UserForm.jsx";
import { api } from "../utils/api.js";
const empty={name:"",membershipId:"",password:"",role:"Member"};
export default function Users({currentUser}) {
  const [users,setUsers]=useState([]);const [setupRequired,setSetupRequired]=useState(false);
  const [form,setForm]=useState(empty);const [editingId,setEditingId]=useState(null);const [message,setMessage]=useState("");const [error,setError]=useState("");
  const isAdmin=currentUser?.role==="Admin";
  async function load(){try{const d=await api("/users");setUsers(d.users);setSetupRequired(d.setupRequired);setError("");}catch(e){setError(e.message);}}
  useEffect(()=>{load();},[currentUser]);
  function change(e){setForm({...form,[e.target.name]:e.target.value});}
  async function submit(e){e.preventDefault();setError("");setMessage("");try{
    if(editingId){const payload={name:form.name,membershipId:form.membershipId,role:form.role};if(form.password)payload.password=form.password;await api(`/users/${editingId}`,{method:"PUT",body:JSON.stringify(payload)});setMessage("User updated.");}
    else{await api("/users",{method:"POST",body:JSON.stringify(form)});setMessage(setupRequired?"First administrator created. Please sign in.":"User created.");}
    setForm(empty);setEditingId(null);await load();
  }catch(e){setError(e.message);}}
  function edit(u){setEditingId(u.id);setForm({name:u.name,membershipId:u.membershipId,password:"",role:u.role});}
  async function remove(u){if(!window.confirm(`Delete ${u.name}?`))return;try{await api(`/users/${u.id}`,{method:"DELETE"});setMessage("User deleted.");await load();}catch(e){setError(e.message);}}
  function cancel(){setEditingId(null);setForm(empty);}
  const canManage=isAdmin||setupRequired;
  return <div className="page">
    <PageTitle eyebrow="MEMBERS & STAFF" title="User management" description={setupRequired?"Create the first administrator account to initialise the library.":"Manage library member and staff accounts."}/>
    {(message||error)&&<p className={error?"form-message":"success-message"} role="status">{error||message}</p>}
    {!canManage?<section className="panel access-denied"><h3>Administrator access required</h3><p>Sign in with an administrator account to manage users.</p><Link className="button button-primary" to="/login">Go to login</Link></section>:
    <div className="content-grid">
      <UserForm form={form} onChange={change} onSubmit={submit} editing={Boolean(editingId)} setupRequired={setupRequired} onCancel={cancel}/>
      {!setupRequired&&<section className="panel catalogue-panel"><div className="panel-heading"><div><h3>Registered users</h3><p>{users.length} account(s)</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr></thead><tbody>{users.map(u=><tr key={u.id}><td className="cell-strong">{u.name}</td><td>{u.membershipId}</td><td><span className="status status-blue">{u.role}</span></td><td><div className="row-actions"><button className="button button-light button-small" onClick={()=>edit(u)}>Update</button><button className="button button-danger button-small" onClick={()=>remove(u)} disabled={u.id===currentUser?.id}>Delete</button></div></td></tr>)}</tbody></table></div>
      </section>}
    </div>}
  </div>;
}
