import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const UpdatePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Required';
    const pwdRe = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;
    if (!pwdRe.test(form.newPassword)) errs.newPassword = '8–16 chars, one uppercase, one special character';
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.put('/auth/update-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      toast.success('Password updated successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 28, marginBottom: 28 }}>Update Password</h1>
      <div className="card" style={{ padding: 28 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input className="form-input" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
            {errors.currentPassword && <span className="form-error">{errors.currentPassword}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className="form-input" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
            {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>8–16 characters, at least 1 uppercase & 1 special character</span>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input className="form-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
