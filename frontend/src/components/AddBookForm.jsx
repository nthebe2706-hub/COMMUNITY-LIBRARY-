export default function AddBookForm({form,onChange,onSubmit,editing,onCancel}) {
  return <section className="panel form-panel">
    <div className="panel-heading"><div><h3>{editing?"Update book":"Add a new book"}</h3><p>Enter the book details</p></div><span className="panel-number">01</span></div>
    <form onSubmit={onSubmit} className="form-stack">
      <label>Book title<input name="title" value={form.title} onChange={onChange} required maxLength="180" /></label>
      <label>Author<input name="author" value={form.author} onChange={onChange} required maxLength="120" /></label>
      <label>Genre<input name="genre" value={form.genre} onChange={onChange} required maxLength="80" /></label>
      <label>ISBN<input name="isbn" value={form.isbn} onChange={onChange} required maxLength="30" /></label>
      <label>{editing?"Quantity in stock":"Initial quantity"}<input name="quantity" type="number" min="0" step="1" value={form.quantity} onChange={onChange} required /></label>
      <div className="form-actions"><button className="button button-primary" type="submit">{editing?"Save changes":"Add book"}</button>{editing&&<button className="button button-light" type="button" onClick={onCancel}>Cancel</button>}</div>
    </form>
  </section>;
}
