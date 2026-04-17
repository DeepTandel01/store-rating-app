import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StarRating from '../components/StarRating';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`).then(r => setUser(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;
  if (!user) return <div className="page"><div className="alert alert-error">User not found</div></div>;

  return (
    <div className="page" style={{ maxWidth: 600 }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>← Back</button>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>User Details</h1>

      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 4 }}>{user.name}</h2>
            <span className={`badge badge-${user.role}`}>{user.role?.replace('_', ' ')}</span>
          </div>
        </div>

        {[['Email', user.email], ['Address', user.address || '—']].map(([label, val]) => (
          <div key={label} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 15 }}>{val}</div>
          </div>
        ))}

        {user.role === 'store_owner' && user.store && (
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: 16 }}>Store Information</h3>
            <div style={{ marginBottom: 12 }}>
              <div className="form-label" style={{ marginBottom: 4 }}>Store Name</div>
              <div>{user.store.name}</div>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <div className="form-label" style={{ marginBottom: 4 }}>Average Rating</div>
                {user.store.averageRating ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating value={Math.round(user.store.averageRating)} readonly size="sm" />
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{user.store.averageRating}</span>
                  </div>
                ) : <span style={{ color: 'var(--text-muted)' }}>No ratings yet</span>}
              </div>
              <div>
                <div className="form-label" style={{ marginBottom: 4 }}>Total Ratings</div>
                <div>{user.store.totalRatings ?? 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
