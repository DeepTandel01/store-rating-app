import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import SortableTable from '../components/SortableTable';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errs = {};
  if (form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20–60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
  if (!form.address || form.address.length > 400) errs.address = 'Address required (max 400 chars)';
  return errs;
};

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    try {
      const res = await api.get('/stores', { params });
      setStores(res.data);
    } catch (e) { toast.error('Failed to load stores'); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchStores(); }, [fetchStores]);
  useEffect(() => {
    api.get('/users', { params: { role: 'store_owner' } }).then(r => setOwners(r.data)).catch(() => {});
  }, []);

  const handleFilterChange = e => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleFormChange = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setFormErrors(er => ({ ...er, [e.target.name]: '' })); };

  const handleCreate = async e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    setSubmitting(true);
    try {
      await api.post('/stores', { ...form, ownerId: form.ownerId || null });
      toast.success('Store created!');
      setShowModal(false);
      setForm({ name: '', email: '', address: '', ownerId: '' });
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create store');
    } finally { setSubmitting(false); }
  };

  const columns = [
    { key: 'name', label: 'Store Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address', render: v => v?.length > 40 ? v.slice(0, 40) + '…' : v },
    {
      key: 'averageRating', label: 'Rating', sortable: false,
      render: (v) => v ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <StarRating value={Math.round(v)} readonly size="sm" />
          <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>{v}</span>
        </div>
      ) : <span style={{ color: 'var(--text-dim)' }}>No ratings</span>
    },
  ];

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title">Stores</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Store</button>
      </div>

      <div className="filter-row">
        {['name', 'address'].map(field => (
          <div className="form-group" key={field}>
            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input className="form-input" name={field} value={filters[field]} onChange={handleFilterChange} placeholder={`Filter by ${field}`} />
          </div>
        ))}
        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ name: '', address: '' })}>Clear</button>
        </div>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <SortableTable columns={columns} data={stores} />
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2>Add New Store</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              {[['name', 'Store Name', 'text'], ['email', 'Email', 'email']].map(([name, label, type]) => (
                <div className="form-group" key={name}>
                  <label className="form-label">{label}</label>
                  <input className="form-input" type={type} name={name} value={form[name]} onChange={handleFormChange} required />
                  {formErrors[name] && <span className="form-error">{formErrors[name]}</span>}
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className="form-input" name="address" value={form.address} onChange={handleFormChange} rows={2} required style={{ resize: 'vertical' }} />
                {formErrors.address && <span className="form-error">{formErrors.address}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Store Owner (optional)</label>
                <select className="form-select" name="ownerId" value={form.ownerId} onChange={handleFormChange}>
                  <option value="">— No owner —</option>
                  {owners.map(o => <option key={o.id} value={o.id}>{o.name} ({o.email})</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Creating…' : 'Create Store'}</button>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;
