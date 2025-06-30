import React, { useState, useEffect } from 'react';
import '../../components/AdminStyles.css';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    status: 'active',
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockItems = [
      {
        id: 1,
        name: 'Laptop Gaming X1',
        description: 'High performance gaming laptop',
        price: 1299.99,
        category: 'Electronics',
        stock: 25,
        status: 'active',
        created_at: '2024-01-15',
      },
      {
        id: 2,
        name: 'Wireless Mouse Pro',
        description: 'Professional wireless mouse',
        price: 79.99,
        category: 'Electronics',
        stock: 150,
        status: 'active',
        created_at: '2024-01-16',
      },
      {
        id: 3,
        name: 'Ergonomic Chair',
        description: 'Comfortable office chair',
        price: 299.99,
        category: 'Furniture',
        stock: 0,
        status: 'inactive',
        created_at: '2024-01-17',
      },
    ];
    setItems(mockItems);
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

    if (editingItem) {
      // Update item
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
              }
            : item,
        ),
      );
    } else {
      // Create new item
      const newItem = {
        id: Math.max(...items.map((i) => i.id), 0) + 1,
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        created_at: new Date().toISOString().split('T')[0],
      };
      setItems((prev) => [...prev, newItem]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      stock: item.stock.toString(),
      status: item.status,
    });
    setShowModal(true);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      status: 'active',
    });
    setEditingItem(null);
    setShowModal(false);
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1 className="page-title">Items Management</h1>
        <p className="page-subtitle">Manage product inventory and catalog</p>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h2 className="card-title">Items List</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New Item
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <div>
                    <strong>{item.name}</strong>
                    <br />
                    <small style={{ color: '#6c757d' }}>
                      {item.description}
                    </small>
                  </div>
                </td>
                <td>{item.category}</td>
                <td>${item.price}</td>
                <td>
                  <span
                    className={
                      item.stock === 0
                        ? 'status-badge status-inactive'
                        : 'status-badge status-active'
                    }
                  >
                    {item.stock}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${item.status === 'active' ? 'status-active' : 'status-inactive'}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>{item.created_at}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn action-btn-delete"
                      onClick={() => handleDelete(item.id)}
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

      {/* Modal for Create/Edit Item */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button className="modal-close" onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label className="form-label">Name</label>
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
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Item' : 'Create Item'}
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

export default ItemsPage;
