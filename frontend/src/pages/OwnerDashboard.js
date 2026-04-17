import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StarRating from '../components/StarRating';
import SortableTable from '../components/SortableTable';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/stores/my-dashboard')
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.message || 'No store found for your account'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  if (error) return (
    <div className="page">
      <div className="alert alert-error">{error}</div>
      <p style={{ color: 'var(--text-muted)' }}>Ask an administrator to assign a store to your account.</p>
    </div>
  );

  const columns = [
    { key: 'user', label: 'Customer Name', render: (v) => v?.name || '—' },
    { key: 'user', label: 'Email', render: (v) => v?.email || '—' },
    { key: 'rating', label: 'Rating', render: (v) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <StarRating value={v} readonly size="sm" />
        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{v}</span>
      </div>
    )},
    { key: 'updatedAt', label: 'Date', render: v => new Date(v).toLocaleDateString() },
  ];

  return (
    <div className="page">
      <h1 style={{ fontSize: 32, marginBottom: 4 }}>My Store Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>{data.name}</p>

      <div className="grid-3" style={{ marginBottom: 40 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--gold)' }}>
            {data.averageRating ?? 'N/A'}
          </div>
          <div className="stat-label">Average Rating</div>
          {data.averageRating && (
            <StarRating value={Math.round(data.averageRating)} readonly size="sm" />
          )}
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{data.totalRatings}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Store Info</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}>{data.email}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{data.address}</div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Customer Reviews</h2>
      </div>

      {data.ratings?.length === 0 ? (
        <div className="empty-state"><div className="icon">⭐</div><p>No reviews yet</p></div>
      ) : (
        <SortableTable columns={columns} data={data.ratings || []} />
      )}
    </div>
  );
};

export default OwnerDashboard;
