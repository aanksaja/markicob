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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UsersPage = () => {
  const { authToken, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active',
  });
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const offset = (currentPage - 1) * itemsPerPage;
        const url = `${API_BASE_URL}/users/list`;

        console.log('Fetching users from:', url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

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

      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      // Update user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user,
        ),
      );
    } else {
      // Create new user
      const newUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        ...formData,
        created_at: new Date().toISOString().split('T')[0],
      };
      setUsers((prev) => [...prev, newUser]);
    }

    resetForm();
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      status: 'active',
    });
    setEditingUser(null);
    setShowModal(false);
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1 className="page-title">Users Management</h1>
        <p className="page-subtitle">
          Manage all system users and their permissions
        </p>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h2 className="card-title">Users List</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New User
          </Button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>{user.created_at}</td>
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
              Name
            </FormLabel>
            <FormInput
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter user name"
              required
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
            <FormLabel htmlFor="role" required>
              Role
            </FormLabel>
            <FormSelect
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              placeholder="Select Role"
              required
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="Manager">Manager</option>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FormSelect>
          </FormGroup>

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
