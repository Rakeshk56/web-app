import { useMemo, useState } from "react";

const starterEmployees = [
  { id: 1, name: "Aarav Sharma", email: "aarav@example.com", department: "Engineering", role: "Frontend Developer", status: "Active" },
  { id: 2, name: "Diya Reddy", email: "diya@example.com", department: "Human Resources", role: "HR Specialist", status: "Active" },
  { id: 3, name: "Kabir Mehta", email: "kabir@example.com", department: "IT Operations", role: "System Administrator", status: "On leave" },
  { id: 4, name: "Ananya Rao", email: "ananya@example.com", department: "Finance", role: "Financial Analyst", status: "Active" },
];

const emptyForm = { name: "", email: "", department: "Engineering", role: "", status: "Active" };

function readEmployees() {
  try {
    const saved = localStorage.getItem("peopledesk-employees");
    return saved ? JSON.parse(saved) : starterEmployees;
  } catch {
    return starterEmployees;
  }
}

export default function App() {
  const [employees, setEmployees] = useState(readEmployees);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All departments");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  function saveEmployees(next) {
    setEmployees(next);
    localStorage.setItem("peopledesk-employees", JSON.stringify(next));
  }

  const filtered = useMemo(() => employees.filter((employee) => {
    const term = search.toLowerCase();
    const matchesSearch = [employee.name, employee.email, employee.role, employee.department]
      .some((value) => value.toLowerCase().includes(term));
    const matchesDepartment = department === "All departments" || employee.department === department;
    return matchesSearch && matchesDepartment;
  }), [employees, search, department]);

  const activeCount = employees.filter((employee) => employee.status === "Active").length;
  const departments = ["All departments", ...new Set(employees.map((employee) => employee.department))];

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(employee) {
    setEditingId(employee.id);
    setForm({ ...employee });
    setModalOpen(true);
  }

  function submitForm(event) {
    event.preventDefault();
    const cleaned = { ...form, name: form.name.trim(), email: form.email.trim(), role: form.role.trim() };
    if (!cleaned.name || !cleaned.email || !cleaned.role) return;
    if (editingId) {
      saveEmployees(employees.map((employee) => employee.id === editingId ? { ...cleaned, id: editingId } : employee));
    } else {
      saveEmployees([...employees, { ...cleaned, id: Date.now() }]);
    }
    setModalOpen(false);
  }

  function deleteEmployee(id) {
    if (window.confirm("Delete this employee record?")) {
      saveEmployees(employees.filter((employee) => employee.id !== id));
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">P</span><span>PeopleDesk</span></div>
        <div className="nav-label">WORKSPACE</div>
        <a className="nav-item active" href="#dashboard"><span>▦</span> Overview</a>
        <a className="nav-item" href="#employees"><span>♙</span> Employees <span className="nav-count">{employees.length}</span></a>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon">?</div><strong>Need a hand?</strong><p>This demo stores records in your browser.</p></div>
          <div className="profile"><div className="avatar admin">AD</div><div><strong>Admin User</strong><small>Workspace admin</small></div><span className="dots">•••</span></div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="top-actions"><span className="today">● System demo</span><div className="avatar admin">AD</div></div></header>
        <section className="page-heading">
          <div><p className="eyebrow">PEOPLE OPERATIONS</p><h1>Employee overview</h1><p className="subheading">Manage your people, all in one place.</p></div>
          <button className="primary-button" onClick={openAdd}><span>＋</span> Add employee</button>
        </section>

        <section className="stats-grid">
          <article className="stat-card"><div className="stat-top"><span>Total employees</span><span className="stat-icon purple">♙</span></div><div className="stat-number">{employees.length}</div><div className="stat-note">People in your workspace</div></article>
          <article className="stat-card"><div className="stat-top"><span>Active employees</span><span className="stat-icon green">✓</span></div><div className="stat-number">{activeCount}</div><div className="stat-note"><span className="green-text">● Active</span> team members</div></article>
          <article className="stat-card"><div className="stat-top"><span>Departments</span><span className="stat-icon blue">▤</span></div><div className="stat-number">{Math.max(0, departments.length - 1)}</div><div className="stat-note">Across the organization</div></article>
        </section>

        <section className="employees-panel" id="employees">
          <div className="panel-heading"><div><h2>All employees</h2><p>A directory of everyone in your workspace.</p></div><span className="record-count">{filtered.length} records</span></div>
          <div className="filters"><div className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employees..." /></div><select value={department} onChange={(event) => setDepartment(event.target.value)} aria-label="Filter by department">{departments.map((item) => <option key={item}>{item}</option>)}</select></div>
          <div className="table-wrap"><table><thead><tr><th>EMPLOYEE</th><th>DEPARTMENT</th><th>ROLE</th><th>STATUS</th><th></th></tr></thead><tbody>
            {filtered.map((employee, index) => <tr key={employee.id}><td><div className="person-cell"><div className={`avatar color-${index % 4}`}>{employee.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div><div><strong>{employee.name}</strong><small>{employee.email}</small></div></div></td><td>{employee.department}</td><td>{employee.role}</td><td><span className={`status ${employee.status === "Active" ? "status-active" : "status-leave"}`}><i />{employee.status}</span></td><td><div className="row-actions"><button onClick={() => openEdit(employee)} aria-label={`Edit ${employee.name}`}>Edit</button><button className="delete-action" onClick={() => deleteEmployee(employee.id)} aria-label={`Delete ${employee.name}`}>Delete</button></div></td></tr>)}
            {filtered.length === 0 && <tr><td className="empty-state" colSpan="5">No employees found. Try another search or add an employee.</td></tr>}
          </tbody></table></div>
          <div className="table-footer">Showing <strong>{filtered.length}</strong> of <strong>{employees.length}</strong> employees</div>
        </section>
        <footer className="footer">PeopleDesk <span>•</span> Employee management demo</footer>
      </main>

      {modalOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModalOpen(false); }}><form className="modal" onSubmit={submitForm}><div className="modal-heading"><div><p className="eyebrow">EMPLOYEE DIRECTORY</p><h2>{editingId ? "Edit employee" : "Add employee"}</h2></div><button type="button" className="close-button" onClick={() => setModalOpen(false)}>×</button></div>
        <label>Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Riya Kumar" /></label>
        <label>Email address<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="name@company.com" /></label>
        <div className="form-row"><label>Department<select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })}>{["Engineering", "IT Operations", "Human Resources", "Finance", "Sales", "Marketing"].map((item) => <option key={item}>{item}</option>)}</select></label><label>Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Active</option><option>On leave</option></select></label></div>
        <label>Job title<input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="e.g. Cloud Engineer" /></label>
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>Cancel</button><button className="primary-button" type="submit">{editingId ? "Save changes" : "Add employee"}</button></div>
      </form></div>}
    </div>
  );
}