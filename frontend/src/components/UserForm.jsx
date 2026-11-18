export default function UserForm({form,onChange,onSubmit,editing,setupRequired,onCancel}) {
  return <section className="panel form-panel">
    <div className="panel-heading"><div><h3>{editing?"Update user":setupRequired?"Create first administrator":"Register a user"}</h3><p>Name, membership ID and role</p></div><span className="panel-number">03</span></div>
    <form className="form-stack" onSubmit={onSubmit}>
      <label>Full name<input name="name" value={form.name} onChange={onChange} required maxLength="120" /></label>
      <label>Membership ID<input name="membershipId" value={form.membershipId} onChange={onChange} required maxLength="40" /></label>
      <label>{editing?"New password (leave blank to keep current)":"Password"}<input name="password" type="password" value={form.password} onChange={onChange} minLength="8" required={!editing} autoComplete="new-password" /></label>
      {!setupRequired&&<label>Role<select name="role" value={form.role} onChange={onChange}><option>Member</option><option>Librarian</option><option>Admin</option></select></label>}
      {setupRequired&&<p className="sub-cell">The first account is automatically assigned the Admin role.</p>}
      <div className="form-actions"><button className="button button-primary" type="submit">{editing?"Save changes":setupRequired?"Create administrator":"Add user"}</button>{editing&&<button className="button button-light" type="button" onClick={onCancel}>Cancel</button>}</div>
    </form>
  </section>;
}
