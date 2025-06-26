import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserAdd.css';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserAdd = () => {
  const navigate = useNavigate();
  const { authToken, currentUser } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    name: '',
    alamat: '',
    phone: '',
    role_id: '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [userLevel, setUserLevel] = useState(null);
  const [canAddUser, setCanAddUser] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);

  // Role options
  // const roleOptions = [
  //   { id: 1, name: 'admin', label: 'Admin' },
  //   { id: 2, name: 'approver', label: 'Approver' },
  //   { id: 3, name: 'sales', label: 'Sales' },
  //   { id: 4, name: 'customer', label: 'Customer' },
  // ];

  useEffect(() => {
  const fetchRoles = async () => {
    try {
      const response = await axios.get(API_BASE_URL + '/user/roles', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const rolesArray = Array.isArray(response.data) 
        ? response.data 
        : response.data.roles || response.data.data || [];
      setRoleOptions(rolesArray); // Assuming the response contains the roles data
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  fetchRoles();
}, [authToken])



  // Check user permissions on component mount
  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const level = parsedUserData.role.level;
        setUserLevel(level);

        // Check if user can add users (admin and approver levels)
        if (level >=4) {
          setCanAddUser(false);
        } else {
          setCanAddUser(true);
        }
      } else {
        // No user data found
        setCanAddUser(false);
      }

    } catch (error) {
      console.error('Error parsing user data:', error);
      setCanAddUser(false);
    }
  }, [currentUser]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Address is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/register`,
        {
          ...formData,
          role_id: parseInt(formData.role_id),
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('User created successfully:', response.data);

      // Show success message
      alert('User created successfully!');

      // Reset form
      setFormData({
        username: '',
        password: '',
        email: '',
        name: '',
        alamat: '',
        phone: '',
        role_id: '',
      });

      // Navigate back to user list
      navigate('/users/list');
    } catch (error) {
      console.error('Error creating user:', error);

      if (error.response) {
        // Server responded with error
        const errorMessage =
          error.response.data?.message || 'Failed to create user';
        alert(errorMessage);
      } else if (error.request) {
        // Network error
        alert('Network error. Please check your connection.');
      } else {
        // Other error
        alert('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // If user doesn't have permission
  if (!canAddUser) {
    return (
      <div className="user-add-page">
        <div className="permission-denied">
          <div className="permission-icon">🚫</div>
          <h2>Access Denied</h2>
          <p>You don't have permission to add users.</p>
          <button
            className="back-button"
            onClick={() => navigate('/users/list')}
          >
            Back to User List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-add-page">
      <div className="page-header">
        <div className="header-content">
          <button
            className="back-button-header"
            onClick={() => navigate('/users/list')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
          <div className="header-text">
            <h1 className="page-title">Add New User</h1>
            <p className="page-subtitle">
              Create a new user account with appropriate permissions
            </p>
          </div>
          <div className="user-level-badge">
            Level: {userLevel || 'Unknown'}
          </div>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-grid">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                <span className="label-icon">👤</span>
                Username
                <span className="required">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`form-input ${errors.username ? 'error' : ''}`}
                placeholder="Enter username"
                disabled={loading}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <span className="label-icon">🔒</span>
                Password
                <span className="required">*</span>
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                Email
                <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
                disabled={loading}
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                <span className="label-icon">🏷️</span>
                Full Name
                <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter full name"
                disabled={loading}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                <span className="label-icon">📱</span>
                Phone Number
                <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="Enter phone number"
                disabled={loading}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            {/* Role Field */}
            <div className="form-group">
              <label htmlFor="role_id" className="form-label">
                <span className="label-icon">🛡️</span>
                User Role
                <span className="required">*</span>
              </label>
              <select
                id="role_id"
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                className={`form-select ${errors.role_id ? 'error' : ''}`}
                disabled={loading}
              >
                <option value="">Select a role</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              {errors.role_id && (
                <span className="error-message">{errors.role_id}</span>
              )}
            </div>
          </div>

          {/* Address Field (full width) */}
          <div className="form-group full-width">
            <label htmlFor="alamat" className="form-label">
              <span className="label-icon">🏠</span>
              Address
              <span className="required">*</span>
            </label>
            <textarea
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              className={`form-textarea ${errors.alamat ? 'error' : ''}`}
              placeholder="Enter complete address"
              rows="3"
              disabled={loading}
            />
            {errors.alamat && (
              <span className="error-message">{errors.alamat}</span>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/users/list')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating User...
                </>
              ) : (
                <>
                  <span className="button-icon">➕</span>
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAdd;
