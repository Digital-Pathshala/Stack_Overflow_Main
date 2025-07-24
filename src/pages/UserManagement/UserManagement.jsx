import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "user",
    password: "" 
  });

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      setUsers(response.data.data);
    } catch (error) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      role: "user",
      password: ""
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        setError("Failed to delete user");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update existing user
        const response = await axios.put(
          `http://localhost:5000/api/users/${editingUser._id}`,
          formData
        );
        setUsers(users.map(user => 
          user._id === editingUser._id ? response.data.data : user
        ));
      } else {
        // Create new user
        const response = await axios.post(
          "http://localhost:5000/api/users",
          formData
        );
        setUsers([...users, response.data.data]);
      }
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="user-management">
      <div className="header">
        <h1>User Management</h1>
        <button
          className="add-user-btn"
          onClick={() => {
            setEditingUser(null);
            setFormData({
              fullName: "",
              email: "",
              role: "user",
              password: ""
            });
            setShowModal(true);
          }}
        >
          <i className="fas fa-plus"></i>
          Add User
        </button>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isVerified ? "Verified" : "Pending"}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEdit(user)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(user._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingUser ? "Edit User" : "Create New User"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="modal-actions">
                <button type="submit" className="btn primary">
                  {editingUser ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;