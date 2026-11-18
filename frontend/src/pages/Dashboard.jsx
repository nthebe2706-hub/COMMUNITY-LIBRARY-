import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle.jsx";
import LibraryStat from "../components/LibraryStat.jsx";
import { api } from "../utils/api.js";
export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [summary, setSummary] = useState({ users: 0, transactions: 0 });
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api("/books"), api("/dashboard/summary")])
      .then(([bookData, summaryData]) => { setBooks(bookData.books); setSummary(summaryData); })
      .catch(e => setError(e.message));
  }, []);
  const copies = books.reduce((sum, b) => sum + Number(b.quantity), 0);
  const lowStock = books.filter(b => Number(b.quantity) < 2);
  return <div className="page">
    <PageTitle eyebrow="OVERVIEW" title="Dashboard" description="Current status of your community library." action={<Link className="button button-primary" to="/books">＋ Manage books</Link>} />
    {error && <p className="form-message">{error}. Make sure the backend and database are running.</p>}
    <div className="stats-grid">
      <LibraryStat label="Book titles" value={books.length} note="Different titles in catalogue" />
      <LibraryStat label="Available copies" value={copies} note="Copies currently in stock" tone="green" />
      <LibraryStat label="Low-stock titles" value={lowStock.length} note="Fewer than 2 copies" tone="orange" />
      <LibraryStat label="Registered users" value={summary.users} note="Members and staff" tone="purple" />
    </div>
    <section className="panel"><div className="panel-heading"><div><h3>Book availability</h3><p>Live stock</p></div><Link to="/books" className="text-link">Manage books →</Link></div>
      {books.length === 0 ? <div className="empty-state"><div className="empty-icon">▤</div><h3>Your catalogue is ready</h3><p>Add your first book to start tracking availability.</p><Link className="button button-primary" to="/books">Add first book</Link></div> :
      <div className="table-wrap"><table><thead><tr><th>Book title</th><th>Author</th><th>Genre</th><th>Copies</th><th>Status</th></tr></thead><tbody>{books.map(b => <tr key={b.id}><td className="cell-strong">{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>{b.quantity}</td><td><span className={`status ${b.quantity < 2 ? "status-low" : "status-good"}`}>{b.quantity < 2 ? "Low stock" : "Available"}</span></td></tr>)}</tbody></table></div>}
    </section>
    <div className="tip-box"><span className="tip-icon">i</span><div><b>Stock reminder</b><p>Books with fewer than 2 copies are highlighted as low stock.</p></div></div>
  </div>;
}
