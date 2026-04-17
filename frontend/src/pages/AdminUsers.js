import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SortableTable from '../components/SortableTable';
import toast from 'react-hot-toast';

const ROLES = ['admin', 'user', 'store_owner'];

const validate = (form) => {
  const errs = {};
  if (form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20–60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
  if (form.address && form.address.length > 400) errs.address = 'Max 400 characters';
  const pwdRe = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
  if (!pwdRe.test(form.password)) errs.password = '8–16 chars, 1 uppercase, 1 special char';
  return errs;
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    try {
      const res = await api.get('/users', { params });
      setUsers(res.data);
    } catch (e) { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleFilterChange = e => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFormChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setFormErrors(er => ({ ...er, [e.target.name]: '' })); };

  const handleCreate = async e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await api.post('/users', form);
      toast.success('User created!');
      setShowModal(false);
      setForm({ name: '', email: '', password: '', address: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Failed';
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address', render: v => v ? (v.length > 40 ? v.slice(0, 40) + '…' : v) : '—' },
    { key: 'role', label: 'Role', render: v => <span className={`badge badge-${v}`}>{v?.replace('_', ' ')}</span> },
  ];

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title">Users</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add User</button>
      </div>

      <div className="filter-row">
        {['name', 'email', 'address'].map(field => (
          <div className="form-group" key={field}>
            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input className="form-input" name={field} value={filters[field]} onChange={handleFilterChange} placeholder={`Filter by ${field}`} />
          </div>
        ))}
        <div className="form-group">
          <label className="form-label">Role</label>
          <select className="form-select" name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ name: '', email: '', address: '', role: '' })}>Clear</button>
        </div>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <SortableTable columns={columns} data={users} onRowClick={row => navigate(`/admin/users/${row.id}`)} />
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2>Add New User</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['password', 'Password', 'password'], ['address', 'Address', 'text']].map(([name, label, type]) => (
                <div className="form-group" key={name}>
                  <label className="form-label">{label}</label>
                  <input className="form-input" type={type} name={name} value={form[name]} onChange={handleFormChange} required={name !== 'address'} />
                  {formErrors[name] && <span className="form-error">{formErrors[name]}</span>}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" name="role" value={form.role} onChange={handleFormChange}>
                  {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create User'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
