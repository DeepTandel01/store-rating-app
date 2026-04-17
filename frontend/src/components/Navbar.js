import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = {
    admin: [
      { to: '/admin/dashboard', label: 'Dashboard' },
      { to: '/admin/users', label: 'Users' },
      { to: '/admin/stores', label: 'Stores' },
    ],
    user: [
      { to: '/stores', label: 'Browse Stores' },
      { to: '/update-password', label: 'Password' },
    ],
    store_owner: [
      { to: '/owner/dashboard', label: 'My Store' },
      { to: '/update-password', label: 'Password' },
    ],
  };

  const navLinks = user ? (links[user.role] || []) : [];

  return (
    <nav style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 32 }}>
        <Link to="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: 'var(--accent)', letterSpacing: '-0.5px', textDecoration: 'none' }}>
          ★ StoreRate
        </Link>

        <div style={{ display: 'flex', gap: 4, flex: 1 }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: location.pathname === link.to ? 'var(--accent)' : 'var(--text-muted)',
                background: location.pathname === link.to ? 'var(--accent-soft)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user.name.split(' ')[0]}</span>
              <span className={`badge badge-${user.role}`} style={{ fontSize: 10, padding: '1px 7px' }}>{user.role.replace('_', ' ')}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
