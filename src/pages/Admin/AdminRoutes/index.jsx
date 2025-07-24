import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/Admin/Sidebar/AdminSidebar';
import AdminDashboard from '../../components/Admin/Dashboard/AdminDashboard';
import UserManagement from '../../components/Admin/UserManagement/UserManagement';
import QuestionManagement from '../../components/Admin/QuestionManagement/QuestionManagement';
import AdminProfile from '../../components/Admin/AdminProfile/AdminProfile';
import { AdminProvider } from '../../../context/AdminContext';
import './AdminRoutes.css';

const AdminRoutes = () => {
  return (
    <AdminProvider>
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-main">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="questions" element={<QuestionManagement />} />
            <Route path="profile" element={<AdminProfile />} />
          </Routes>
        </main>
      </div>
    </AdminProvider>
  );
};

export default AdminRoutes;