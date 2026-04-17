import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/dashboard/stats').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: 32, marginBottom: 4 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Platform overview at a glance</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: 40 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{stats?.totalUsers ?? 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--gold)' }}>{stats?.totalStores ?? 0}</div>
          <div className="stat-label">Total Stores</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats?.totalRatings ?? 0}</div>
          <div className="stat-label">Total Ratings</div>
        </div>
      </div>

      <div className="grid-2">
        <Link to="/admin/users" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
            <h3 style={{ marginBottom: 8 }}>Manage Users</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>View, filter, and add users across all roles</p>
          </div>
        </Link>
        <Link to="/admin/stores" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🏪</div>
            <h3 style={{ marginBottom: 8 }}>Manage Stores</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>View all stores, their ratings and details</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
