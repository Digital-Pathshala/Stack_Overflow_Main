import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../Admin/AdminProfile.css";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState({
    fullName: "",
    email: "",
    role: "",
    profileImage:
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/profile');
      if (response.data.success) {
        const { fullName, email, role } = response.data.data;
        setAdminData({ fullName, email, role });
        setFormData(prev => ({
          ...prev,
          fullName,
          email
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setError('Failed to load admin profile');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
      };

      // Add password data if changing password
      if (formData.currentPassword && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          alert("New passwords don't match!");
          return;
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      
      const response = await axios.put(
        "http://localhost:5000/api/admin/profile",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setAdminData((prev) => ({
          ...prev,
          fullName: formData.fullName,
          email: formData.email,
        }));
        setIsEditing(false);
        // Reset password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        alert("Profile updated successfully!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <h1>Admin Profile</h1>
      </div>

      {!isEditing ? (
        <div className="profile-card">
          <div className="profile-content">
            <div className="profile-image-wrapper">
              <div className="profile-image"></div>
            </div>
            
            <div className="profile-info">
              <div className="info-group">
                <span className="info-label">Full Name</span>
                <span className="info-value">{adminData.fullName}</span>
              </div>

              <div className="info-group">
                <span className="info-label">Email</span>
                <span className="info-value">{adminData.email}</span>
              </div>

              <div className="info-group">
                <span className="info-label">Role</span>
                <span className="role-badge">{adminData.role}</span>
              </div>

              <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                <i className="fas fa-edit"></i>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-profile-edit">
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="password-section">
              <h3>Change Password</h3>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save Changes
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;