import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const validate = (form) => {
  const errs = {};
  if (form.name.length < 20 || form.name.length > 60) errs.name = 'Name must be 20–60 characters';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address';
  if (form.address.length > 400) errs.address = 'Address max 400 characters';
  const pwdRe = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
  if (!pwdRe.test(form.password)) errs.password = '8–16 chars, one uppercase, one special character';
  return errs;
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setServerError('');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/stores');
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Registration failed';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>★</div>
          <h1 style={{ fontSize: 28, color: 'var(--text)' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>Join StoreRate and start reviewing</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {serverError && <div className="alert alert-error">{serverError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" placeholder="Your full name (min 20 chars)" value={form.name} onChange={handleChange} required />
              {errors.name && <span className="form-error">{errors.name}</span>}
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{form.name.length}/60 characters</span>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-input" name="address" placeholder="Your address" value={form.address} onChange={handleChange} rows={2} style={{ resize: 'vertical' }} />
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" name="password" placeholder="8–16 chars, uppercase + special" value={form.password} onChange={handleChange} required />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8, padding: '13px' }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
