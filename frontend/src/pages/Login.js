import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back!`);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>★</div>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: 'var(--accent)' }}>StoreRate</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8, padding: '13px' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>

        <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-elevated)', borderRadius: 10, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
          <strong style={{ color: 'var(--text)' }}>Demo Admin:</strong> admin@storerating.com / Admin@123
        </div>
      </div>
    </div>
  );
};

export default Login;
