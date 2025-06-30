import React, { useState, useEffect } from 'react';
import '../../components/AdminStyles.css';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });

  const availablePermissions = [
    'users_read',
    'users_create',
    'users_update',
    'users_delete',
    'items_read',
    'items_create',
    'items_update',
    'items_delete',
    'invoices_read',
    'invoices_create',
    'invoices_update',
    'invoices_delete',
    'roles_read',
    'roles_create',
    'roles_update',
    'roles_delete',
    'admin_access',
  ];

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockRoles = [
      {
        id: 1,
        name: 'Admin',
        description: 'Full system access',
        permissions: availablePermissions,
        user_count: 2,
        created_at: '2024-01-01',
      },
      {
        id: 2,
        name: 'Manager',
        description: 'Management level access',
        permissions: [
          'users_read',
          'items_read',
          'items_create',
          'items_update',
          'invoices_read',
          'invoices_create',
        ],
        user_count: 5,
        created_at: '2024-01-01',
      },
      {
        id: 3,
        name: 'User',
        description: 'Basic user access',
        permissions: ['items_read', 'invoices_read'],
        user_count: 125,
        created_at: '2024-01-01',
      },
    ];
    setRoles(mockRoles);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingRole) {
      // Update role
      setRoles((prev) =>
        prev.map((role) =>
          role.id === editingRole.id ? { ...role, ...formData } : role,
        ),
      );
    } else {
      // Create new role
      const newRole = {
        id: Math.max(...roles.map((r) => r.id), 0) + 1,
        ...formData,
        user_count: 0,
        created_at: new Date().toISOString().split('T')[0],
      };
      setRoles((prev) => [...prev, newRole]);
    }

    resetForm();
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setShowModal(true);
  };

  const handleDelete = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    if (role && role.user_count > 0) {
      alert(
        'Cannot delete role that is assigned to users. Please reassign users first.',
      );
      return;
    }

    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles((prev) => prev.filter((role) => role.id !== roleId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
    setEditingRole(null);
    setShowModal(false);
  };

  const formatPermissionName = (permission) => {
    return permission
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1 className="page-title">Roles Management</h1>
        <p className="page-subtitle">Manage user roles and permissions</p>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h2 className="card-title">Roles List</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Create New Role
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Permissions</th>
              <th>Users</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>
                  <strong>{role.name}</strong>
                </td>
                <td>{role.description}</td>
                <td>
                  <div style={{ maxWidth: '200px' }}>
                    <small style={{ color: '#6c757d' }}>
                      {role.permissions.length} permission(s)
                    </small>
                    <br />
                    <small>
                      {role.permissions
                        .slice(0, 3)
                        .map((p) => formatPermissionName(p))
                        .join(', ')}
                      {role.permissions.length > 3 && '...'}
                    </small>
                  </div>
                </td>
                <td>
                  <span className="status-badge status-active">
                    {role.user_count}
                  </span>
                </td>
                <td>{role.created_at}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn-edit"
                      onClick={() => handleEdit(role)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn action-btn-delete"
                      onClick={() => handleDelete(role.id)}
                      disabled={role.user_count > 0}
                      style={{
                        opacity: role.user_count > 0 ? 0.5 : 1,
                        cursor: role.user_count > 0 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit Role */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </h3>
              <button className="modal-close" onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label className="form-label">Role Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Role description"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Permissions</label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                    padding: '15px',
                    border: '2px solid #e9ecef',
                    borderRadius: '5px',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  {availablePermissions.map((permission) => (
                    <label
                      key={permission}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '5px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                        style={{ marginRight: '8px' }}
                      />
                      <span style={{ fontSize: '14px' }}>
                        {formatPermissionName(permission)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingRole ? 'Update Role' : 'Create Role'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
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

export default RolesPage;
