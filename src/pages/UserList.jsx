import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserList.css';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserList = () => {
  const navigate = useNavigate();
  const { authToken, currentUser } = useAuth();

  // State for users data
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // User permissions
  const [userLevel, setUserLevel] = useState(null);
  const [canManageUsers, setCanManageUsers] = useState(false);

  // Check user permissions
  useEffect(() => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const level = parsedUserData.role.level;
        const isAdmin = parsedUserData.is_admin == 1
        setUserLevel(level);

        // Check if user can manage users (admin and approver levels)
        setCanManageUsers(false);
        if (level <= 2 && isAdmin) {
          setCanManageUsers(true);
        }
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }, [currentUser]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const url = `${API_BASE_URL}/users/list?limit=${itemsPerPage}&offset=${offset}`;

        console.log('Fetching users from:', url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log('API Response:', response.data);

        if (response.data && response.data.data) {
          setUsers(response.data.data);
          setTotalUsers(response.data.meta?.total || 0);
        } else {
          setUsers([]);
          setTotalUsers(0);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        setUsers([]);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchUsers();
    }
  }, [currentPage, itemsPerPage, authToken]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalUsers / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (date.getFullYear() === 1) {
        return 'N/A';
      }
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  // Get role display name
  const getRoleDisplay = (role) => {
    if (!role) return 'Unknown';

    const roleNames = {
      0: 'SuperAdmin',
      1: 'Admin',
      2: 'Approver',
      3: 'Sales',
      4: 'Customer',
    };

    return roleNames[role.level];
  };

  // Get status display
  const getStatusDisplay = (status) => {
    switch (status) {
      case 0:
        return { text: 'Inactive', class: 'status-inactive' };
      case 1:
        return { text: 'Active', class: 'status-active' };
      default:
        return { text: 'Unknown', class: 'status-unknown' };
    }
  };

  // Handle edit user
  const handleEditUser = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  // Handle delete user
  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(`Are you sure you want to delete user "${userName}"?`)
    ) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/user/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Refresh the user list
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await axios.get(
        `${API_BASE_URL}/users/list?limit=${itemsPerPage}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      setUsers(response.data.data);
      setTotalUsers(response.data.meta?.total || 0);

      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Pagination component
  const PaginationControls = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 7;

      if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = Math.min(maxVisible - 1, totalPages);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - maxVisible + 2, 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className="pagination-wrapper">
        <div className="pagination-info">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, totalUsers)} of {totalUsers}{' '}
          users
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="pagination-btn nav-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Previous
            </button>

            <div className="pagination-numbers">
              {getPageNumbers().map((page, index) =>
                page === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="pagination-ellipsis"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${page}`}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              className="pagination-btn nav-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!authToken) {
    return (
      <div className="user-list-page">
        <div className="permission-denied">
          <div className="permission-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p>Please log in to view the user list.</p>
          <button className="login-button" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">User Management</h1>
            <p className="page-subtitle">
              Manage user accounts and permissions
            </p>
          </div>

          <div className="header-actions">
            <div className="user-level-badge">
              Level: {userLevel || 'Unknown'}
            </div>
            {canManageUsers && (
              <button
                className="add-user-button"
                onClick={() => navigate('/users/add')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 4V16M4 10H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Add User
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="controls-wrapper">
          <div className="left-controls">
            <div className="items-per-page">
              <label>Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="results-info">
              <span>{totalUsers} users found</span>
            </div>
          </div>

          <div className="right-controls">
            <button
              className="refresh-button"
              onClick={() => {
                setCurrentPage(1);
                // Trigger refresh by changing a dependency
                window.location.reload();
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M1 4V8H5M15 12V8H11M1.5 8A6.5 6.5 0 0113 4.5M14.5 8A6.5 6.5 0 013 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-section">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Users</h3>
            <p>{error}</p>
            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  {canManageUsers && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => {
                    const status = getStatusDisplay(user.status);
                    return (
                      <tr key={user.id}>
                        <td className="id-cell">{user.id}</td>
                        <td className="username-cell">
                          <div className="user-info">
                            <div className="username">{user.username}</div>
                            {user.google_id && (
                              <div className="google-badge">Google</div>
                            )}
                          </div>
                        </td>
                        <td className="name-cell">{user.name}</td>
                        <td className="email-cell">{user.email}</td>
                        <td className="phone-cell">{user.phone || 'N/A'}</td>
                        <td className="role-cell">
                          <span className="role-badge">
                            {getRoleDisplay(user.role)}
                          </span>
                        </td>
                        <td className="status-cell">
                          <span className={`status-badge ${status.class}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="date-cell">
                          {formatDate(user.created_at)}
                        </td>
                        {canManageUsers && (
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <button
                                className="action-btn edit-btn"
                                onClick={() => handleEditUser(user.id)}
                                title="Edit User"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M11.3333 2.00001C11.5084 1.82491 11.7166 1.68702 11.9451 1.59409C12.1736 1.50117 12.4179 1.45459 12.6649 1.45459C12.9119 1.45459 13.1562 1.50117 13.3847 1.59409C13.6131 1.68702 13.8214 1.82491 13.9965 2.00001C14.1716 2.1751 14.3095 2.38335 14.4024 2.61179C14.4953 2.84023 14.5419 3.08452 14.5419 3.33151C14.5419 3.57849 14.4953 3.82278 14.4024 4.05122C14.3095 4.27966 14.1716 4.48791 13.9965 4.66301L5.33317 13.3297L1.6665 14.3297L2.6665 10.663L11.3333 2.00001Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                              <button
                                className="action-btn delete-btn"
                                onClick={() =>
                                  handleDeleteUser(user.id, user.name)
                                }
                                title="Delete User"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M2 4H14M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M6.6665 7.33334V11.3333M9.3332 7.33334V11.3333"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={canManageUsers ? 9 : 8} className="no-data">
                      <div className="no-data-content">
                        <div className="no-data-icon">👥</div>
                        <h3>No Users Found</h3>
                        <p>There are no users to display.</p>
                        {canManageUsers && (
                          <button
                            className="add-first-user-button"
                            onClick={() => navigate('/users/add')}
                          >
                            Add First User
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && users.length > 0 && <PaginationControls />}
      </div>
    </div>
  );
};

export default UserList;
