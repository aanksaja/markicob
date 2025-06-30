import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import axios from 'axios';
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
} from '../../components/ui/Form';
import '../../components/AdminStyles.css';
import { useAuth } from '../../context/AuthContext';
import Pagination from '../../components/ui/Pagination'; // Assuming you have a Pagination component

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 10; // You can adjust this

const UsersPage = () => {
  const { authToken, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: '',
    status: '0',
    phone: '',
    alamat: ''
  });

  // Map status number to text
  const statusMap = {
    0: 'Active',
    1: 'Inactive'
  };

  // Map role_id to role name
  const roleMap = {
    1: 'Super Admin',
    2: 'Admin',
    3: 'Manager',
    4: 'User'
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const url = `${API_BASE_URL}/users/list?limit=${ITEMS_PER_PAGE}&offset=${offset}`;

        console.log('Fetching users from:', url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log('API Response:', response.data);

        if (response.data && response.data.data) {
          setUsers(response.data.data);
          setTotalUsers(response.data.meta.total);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, authToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Update user via API
        await axios.put(`${API_BASE_URL}/users/${editingUser.id}`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      } else {
        // Create new user via API
        await axios.post(`${API_BASE_URL}/users`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
      
      // Refresh user list
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const response = await axios.get(`${API_BASE_URL}/users/list?limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      setUsers(response.data.data);
      setTotalUsers(response.data.meta.total);
      resetForm();
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Failed to save user. Please try again.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role_id: user.role_id.toString(),
      status: user.status.toString(),
      phone: user.phone,
      alamat: user.alamat
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        // Refresh user list
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const response = await axios.get(`${API_BASE_URL}/users/list?limit=${ITEMS_PER_PAGE}&offset=${offset}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        setUsers(response.data.data);
        setTotalUsers(response.data.meta.total);
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role_id: '',
      status: '0',
      phone: '',
      alamat: ''
    });
    setEditingUser(null);
    setShowModal(false);
    setError(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1 className="page-title">Users Management</h1>
        <p className="page-subtitle">
          Manage all system users and their permissions
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="admin-card">
        <div className="card-header">
          <h2 className="card-title">Users List</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New User
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : (
          <>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{roleMap[user.role_id] || `Unknown (${user.role_id})`}</td>
                    <td>
                      <span
                        className={`status-badge ${user.status === 0 ? 'status-active' : 'status-inactive'}`}
                      >
                        {statusMap[user.status]}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3">
              <Pagination
                currentPage={currentPage}
                totalItems={totalUsers}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>

      {/* Modal for Create/Edit User */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name" required>
              Full Name
            </FormLabel>
            <FormInput
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter user's full name"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="username" required>
              Username
            </FormLabel>
            <FormInput
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
              disabled={!!editingUser} // Disable for editing existing user
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="email" required>
              Email
            </FormLabel>
            <FormInput
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="phone">
              Phone
            </FormLabel>
            <FormInput
              id="phone"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="alamat">
              Address
            </FormLabel>
            <FormInput
              id="alamat"
              type="text"
              name="alamat"
              value={formData.alamat}
              onChange={handleInputChange}
              placeholder="Enter address"
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="role_id" required>
              Role
            </FormLabel>
            <FormSelect
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Role</option>
              <option value="1">Super Admin</option>
              <option value="2">Admin</option>
              <option value="3">Manager</option>
              <option value="4">User</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="status">Status</FormLabel>
            <FormSelect
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="0">Active</option>
              <option value="1">Inactive</option>
            </FormSelect>
          </FormGroup>

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <div className="action-buttons">
            <Button type="submit" variant="primary">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;