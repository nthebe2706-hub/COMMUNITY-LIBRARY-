import React, { useEffect, useState } from "react";
import { NavLink, Navigate, Route, Routes, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Books from "./pages/Books.jsx";
import Transactions from "./pages/Transactions.jsx";
import Users from "./pages/Users.jsx";
import Login from "./pages/Login.jsx";
import { api } from "./utils/api.js";
import "./App.css";

function Navbar({ currentUser, onLogout }) {
  const activeClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";
  return <header className="topbar">
    <div className="brand"><div><strong>Community Library</strong><span>Management System</span></div></div>
    <nav className="navigation">
      <NavLink end to="/" className={activeClass}>Dashboard</NavLink>
      <NavLink to="/books" className={activeClass}>Books</NavLink>
      <NavLink to="/transactions" className={activeClass}>Transactions</NavLink>
      <NavLink to="/users" className={activeClass}>Users</NavLink>
      {!currentUser ? <NavLink to="/login" className={activeClass}>Login</NavLink> : <button className="button button-light button-small" onClick={onLogout}>Log out</button>}
    </nav>
  </header>;
}
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("library_user")) || null; } catch { return null; }
  });
  const [checking, setChecking] = useState(Boolean(localStorage.getItem("library_token")));
  useEffect(() => {
    if (!localStorage.getItem("library_token")) { setChecking(false); return; }
    api("/auth/me").then(({ user }) => { setCurrentUser(user); localStorage.setItem("library_user", JSON.stringify(user)); })
      .catch(() => { localStorage.removeItem("library_token"); localStorage.removeItem("library_user"); setCurrentUser(null); })
      .finally(() => setChecking(false));
  }, []);
  function handleLogin(data) {
    localStorage.setItem("library_token", data.token);
    localStorage.setItem("library_user", JSON.stringify(data.user));
    setCurrentUser(data.user);
  }
  function handleLogout() {
    localStorage.removeItem("library_token"); localStorage.removeItem("library_user"); setCurrentUser(null);
  }
  if (checking) return <div className="main-content">Checking your session…</div>;
  return <div className="app-shell">
    <Navbar currentUser={currentUser} onLogout={handleLogout} />
    <div className="welcome-strip"><div><span className="eyebrow">COMMUNITY LIBRARY</span><p>Your entire library, simplified</p></div><div className="session">{currentUser ? <span>Signed in as <b>{currentUser.name}</b> ({currentUser.role})</span> : <span className="muted">Please sign in for staff actions</span>}</div></div>
    <main className="main-content"><Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/books" element={<Books currentUser={currentUser} />} />
      <Route path="/transactions" element={<Transactions currentUser={currentUser} />} />
      <Route path="/users" element={<Users currentUser={currentUser} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} currentUser={currentUser} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></main>
    <footer className="footer">Community Library </footer>
  </div>;
}
