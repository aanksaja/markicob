import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { isLoggedIn, currentUser } = useAuth(); // Ambil isLoggedIn dan currentUser dari context
  // Redirect ke halaman login jika belum login
  if (!isLoggedIn) {
    console.log('isLoggedIn:', isLoggedIn); // Debugging: tampilkan data pengguna di konsol
    return <Navigate to="/login" replace />;
  }

  // Jika currentUser belum ada (misal ada masalah parsing), bisa tampilkan loading atau error
  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <h2>User Profile</h2>
          <p>Loading profile data or data not found...</p>
          <p>Please try logging in again if the problem persists.</p>
        </div>
      </div>
    );
  }

  // Get role display name
  const getRoleDisplay = (roleId) => {
    const roles = {
      1: 'Admin',
      2: 'Approver',
      3: 'Sales',
      4: 'Customer',
    };
    return roles[roleId] || `Role ${roleId}`;
  };

  // Tampilkan data pengguna
  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      {/* Avatar Section */}
      <div className="profile-avatar-section">
        <div className="profile-avatar">👤</div>
        <div className="profile-name">
          {currentUser.name || 'Not Available'}
        </div>
        <div className="profile-role">
          {getRoleDisplay(currentUser.role_id)}
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="profile-info-grid">
        <div className="profile-info-card">
          <h3>Personal Information</h3>
          <div className="info-item">
            <span className="info-label">Username</span>
            <span className="info-value">{currentUser.username}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Full Name</span>
            <span className="info-value">
              {currentUser.name || 'Not Available'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">
              {currentUser.email || 'Not Available'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Phone</span>
            <span className="info-value">
              {currentUser.phone || 'Not Available'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Address</span>
            <span className="info-value">
              {currentUser.alamat || 'Not Available'}
            </span>
          </div>
        </div>

        <div className="profile-info-card">
          <h3>Account Information</h3>
          <div className="info-item">
            <span className="info-label">Role</span>
            <span className="info-value">
              {getRoleDisplay(currentUser.role_id)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Status</span>
            <span
              className={`info-value status-badge ${currentUser.status === 0 ? 'status-active' : 'status-inactive'}`}
            >
              {currentUser.status === 0 ? 'Active' : 'Inactive'}
            </span>
          </div>
          {currentUser.google_id && (
            <div className="info-item">
              <span className="info-label">Google ID</span>
              <span className="info-value">{currentUser.google_id}</span>
            </div>
          )}
          <div className="info-item">
            <span className="info-label">Member Since</span>
            <span className="info-value">
              {new Date(currentUser.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Additional Information (if available) */}
      {(currentUser.no_rek || currentUser.bank || currentUser.area_kerja) && (
        <div className="profile-info-card" style={{ marginTop: '2rem' }}>
          <h3>Additional Information</h3>
          {currentUser.no_rek && (
            <div className="info-item">
              <span className="info-label">Account Number</span>
              <span className="info-value">{currentUser.no_rek}</span>
            </div>
          )}
          {currentUser.bank && (
            <div className="info-item">
              <span className="info-label">Bank</span>
              <span className="info-value">{currentUser.bank}</span>
            </div>
          )}
          {currentUser.area_kerja && (
            <div className="info-item">
              <span className="info-label">Work Area</span>
              <span className="info-value">{currentUser.area_kerja}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="profile-actions">
        <button className="edit-profile-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M11.3333 2.00001C11.5084 1.82491 11.7166 1.68702 11.9451 1.59409C12.1736 1.50117 12.4179 1.45459 12.6649 1.45459C12.9119 1.45459 13.1562 1.50117 13.3847 1.59409C13.6131 1.68702 13.8214 1.82491 13.9965 2.00001C14.1716 2.1751 14.3095 2.38335 14.4024 2.61179C14.4953 2.84023 14.5419 3.08452 14.5419 3.33151C14.5419 3.57849 14.4953 3.82278 14.4024 4.05122C14.3095 4.27966 14.1716 4.48791 13.9965 4.66301L5.33317 13.3297L1.6665 14.3297L2.6665 10.663L11.3333 2.00001Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
