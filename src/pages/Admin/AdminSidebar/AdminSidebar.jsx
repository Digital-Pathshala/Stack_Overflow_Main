import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';
import logo from '../../../assets/logo.png';

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img src={logo} alt="Digital Pathshala Logo" className="sidebar-logo-img" />
                    <span className="logo-text">Digital Pathshala</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fas fa-users"></i>
                            <span>Users</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/questions" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fas fa-question-circle"></i>
                            <span>Questions</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/admin/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                            <i className="fas fa-user-circle"></i>
                            <span>Profile</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button className="help-btn">
                    <i className="fas fa-question-circle"></i>
                    <span>Help Center</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;