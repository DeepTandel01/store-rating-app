import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const StoreCard = ({ store, onRated }) => {
  const [rating, setRating] = useState(store.userRating || 0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRate = async (val) => {
    setRating(val);
    setSubmitting(true);
    try {
      await api.post('/ratings', { storeId: store.id, rating: val });
      toast.success(store.userRating ? 'Rating updated!' : 'Rating submitted!');
      onRated();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to rate');
      setRating(store.userRating || 0);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 17, marginBottom: 4 }}>{store.name}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{store.address}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Overall Rating</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarRating value={Math.round(store.averageRating || 0)} readonly size="sm" />
            <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14 }}>
              {store.averageRating ? store.averageRating : 'N/A'}
            </span>
            <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>({store.totalRatings} reviews)</span>
          </div>
        </div>
        {store.userRating && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Your Rating</div>
            <span style={{ background: 'var(--gold-soft)', color: 'var(--gold)', padding: '2px 10px', borderRadius: 99, fontSize: 13, fontWeight: 700 }}>★ {store.userRating}</span>
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
          {submitting ? 'Submitting…' : store.userRating ? 'Update your rating:' : 'Rate this store:'}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              onClick={() => handleRate(s)}
              disabled={submitting}
              style={{
                background: 'none', border: 'none', padding: '4px 6px',
                fontSize: 22, cursor: 'pointer', transition: 'transform 0.15s',
                color: s <= (hover || rating) ? 'var(--gold)' : 'var(--text-dim)',
                transform: s <= hover ? 'scale(1.25)' : 'scale(1)'
              }}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
            >★</button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });

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

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 4 }}>Browse Stores</h1>
          <p style={{ color: 'var(--text-muted)' }}>Discover and rate stores on the platform</p>
        </div>
      </div>

      <div className="filter-row">
        {['name', 'address'].map(field => (
          <div className="form-group" key={field}>
            <label className="form-label">Search by {field}</label>
            <input className="form-input" name={field} value={filters[field]} onChange={e => setFilters(f => ({ ...f, [e.target.name]: e.target.value }))} placeholder={`e.g. ${field === 'name' ? 'Coffee House' : 'New York'}`} />
          </div>
        ))}
        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ name: '', address: '' })}>Clear</button>
        </div>
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : stores.length === 0 ? (
        <div className="empty-state"><div className="icon">🏪</div><p>No stores found</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {stores.map(store => (
            <StoreCard key={store.id} store={store} onRated={fetchStores} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList;
