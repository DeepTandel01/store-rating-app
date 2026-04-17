import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import UpdatePassword from './pages/UpdatePassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminStores from './pages/AdminStores';
import StoreList from './pages/StoreList';
import OwnerDashboard from './pages/OwnerDashboard';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/update-password" element={
      <ProtectedRoute roles={['user', 'store_owner']}>
        <Layout><UpdatePassword /></Layout>
      </ProtectedRoute>
    } />

    <Route path="/stores" element={
      <ProtectedRoute roles={['user']}>
        <Layout><StoreList /></Layout>
      </ProtectedRoute>
    } />

    <Route path="/owner/dashboard" element={
      <ProtectedRoute roles={['store_owner']}>
        <Layout><OwnerDashboard /></Layout>
      </ProtectedRoute>
    } />

    <Route path="/admin/dashboard" element={
      <ProtectedRoute roles={['admin']}>
        <Layout><AdminDashboard /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/admin/users" element={
      <ProtectedRoute roles={['admin']}>
        <Layout><AdminUsers /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/admin/users/:id" element={
      <ProtectedRoute roles={['admin']}>
        <Layout><AdminUserDetail /></Layout>
      </ProtectedRoute>
    } />
    <Route path="/admin/stores" element={
      <ProtectedRoute roles={['admin']}>
        <Layout><AdminStores /></Layout>
      </ProtectedRoute>
    } />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1c1c28', color: '#e8e8f0', border: '1px solid #2a2a3d' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#1c1c28' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#1c1c28' } }
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
