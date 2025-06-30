import React, { useState, useEffect } from 'react';
import '../../components/AdminStyles.css';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    amount: '',
    status: 'pending',
    due_date: '',
    description: '',
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockInvoices = [
      {
        id: 'INV-001',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        amount: 1299.99,
        status: 'paid',
        due_date: '2024-02-15',
        created_at: '2024-01-15',
        description: 'Purchase of Laptop Gaming X1',
      },
      {
        id: 'INV-002',
        customer_name: 'Jane Smith',
        customer_email: 'jane@example.com',
        amount: 79.99,
        status: 'pending',
        due_date: '2024-02-10',
        created_at: '2024-01-16',
        description: 'Wireless Mouse Pro',
      },
      {
        id: 'INV-003',
        customer_name: 'Bob Johnson',
        customer_email: 'bob@example.com',
        amount: 299.99,
        status: 'overdue',
        due_date: '2024-01-20',
        created_at: '2024-01-05',
        description: 'Ergonomic Chair',
      },
    ];
    setInvoices(mockInvoices);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateInvoiceId = () => {
    const nextNum = invoices.length + 1;
    return `INV-${nextNum.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingInvoice) {
      // Update invoice
      setInvoices((prev) =>
        prev.map((invoice) =>
          invoice.id === editingInvoice.id
            ? { ...invoice, ...formData, amount: parseFloat(formData.amount) }
            : invoice,
        ),
      );
    } else {
      // Create new invoice
      const newInvoice = {
        id: generateInvoiceId(),
        ...formData,
        amount: parseFloat(formData.amount),
        created_at: new Date().toISOString().split('T')[0],
      };
      setInvoices((prev) => [...prev, newInvoice]);
    }

    resetForm();
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email,
      amount: invoice.amount.toString(),
      status: invoice.status,
      due_date: invoice.due_date,
      description: invoice.description,
    });
    setShowModal(true);
  };

  const handleDelete = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_email: '',
      amount: '',
      status: 'pending',
      due_date: '',
      description: '',
    });
    setEditingInvoice(null);
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'overdue':
        return 'status-inactive';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="admin-content">
      <div className="page-header">
        <h1 className="page-title">Invoices Management</h1>
        <p className="page-subtitle">Manage customer invoices and billing</p>
      </div>

      <div className="admin-card">
        <div className="card-header">
          <h2 className="card-title">Invoices List</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Create New Invoice
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <strong>{invoice.id}</strong>
                </td>
                <td>
                  <div>
                    <strong>{invoice.customer_name}</strong>
                    <br />
                    <small style={{ color: '#6c757d' }}>
                      {invoice.customer_email}
                    </small>
                  </div>
                </td>
                <td>
                  <strong>${invoice.amount}</strong>
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusColor(invoice.status)}`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td>{invoice.due_date}</td>
                <td>{invoice.created_at}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn action-btn-view"
                      onClick={() =>
                        alert(
                          `Viewing invoice ${invoice.id}\nDescription: ${invoice.description}`,
                        )
                      }
                    >
                      View
                    </button>
                    <button
                      className="action-btn action-btn-edit"
                      onClick={() => handleEdit(invoice)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn action-btn-delete"
                      onClick={() => handleDelete(invoice.id)}
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

      {/* Modal for Create/Edit Invoice */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
              </h3>
              <button className="modal-close" onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Customer Email</label>
                <input
                  type="email"
                  name="customer_email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="form-input"
                  step="0.01"
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
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
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
                  placeholder="Invoice description or notes"
                  required
                />
              </div>

              <div className="action-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
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

export default InvoicesPage;
