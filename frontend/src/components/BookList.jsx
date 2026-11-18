export default function BookList({books,canManage,onEdit,onDelete}) {
  return <section className="panel catalogue-panel">
    <div className="panel-heading"><div><h3>Library catalogue</h3><p>{books.length} registered title(s)</p></div></div>
    {books.length===0?<div className="empty-state compact"><h3>No books yet</h3><p>New titles will appear here.</p></div>:
    <div className="table-wrap"><table><thead><tr><th>Title / Author</th><th>Genre</th><th>ISBN</th><th>Stock</th>{canManage&&<th>Actions</th>}</tr></thead>
      <tbody>{books.map(b=><tr key={b.id}><td className="cell-strong">{b.title}<small className="sub-cell">{b.author}</small></td><td>{b.genre}</td><td>{b.isbn}</td><td><span className={`status ${b.quantity<2?"status-low":"status-good"}`}>{b.quantity}</span></td>{canManage&&<td><div className="row-actions"><button className="button button-light button-small" onClick={()=>onEdit(b)}>Update</button><button className="button button-danger button-small" onClick={()=>onDelete(b)}>Delete</button></div></td>}</tr>)}</tbody>
    </table></div>}
  </section>;
}
