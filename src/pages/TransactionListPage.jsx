import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './TransactionListPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TransactionListPage = () => {
  const navigate = useNavigate();
  const { authToken, isLoggedIn, logout } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for demonstration (replace with API call)
  const mockTransactions = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 2500000,
      items: [
        { name: 'Premium Headphones', quantity: 1, price: 1500000 },
        { name: 'Wireless Mouse', quantity: 2, price: 500000 },
      ],
      shipping_address: 'Jakarta, Indonesia',
      payment_method: 'Credit Card',
      tracking_number: 'TRK123456789',
    },
    {
      id: 'ORD-002',
      date: '2024-01-12',
      status: 'shipped',
      total: 750000,
      items: [{ name: 'Bluetooth Speaker', quantity: 1, price: 750000 }],
      shipping_address: 'Bandung, Indonesia',
      payment_method: 'Bank Transfer',
      tracking_number: 'TRK987654321',
    },
    {
      id: 'ORD-003',
      date: '2024-01-10',
      status: 'processing',
      total: 1200000,
      items: [{ name: 'Smart Watch', quantity: 1, price: 1200000 }],
      shipping_address: 'Surabaya, Indonesia',
      payment_method: 'E-Wallet',
      tracking_number: null,
    },
    {
      id: 'ORD-004',
      date: '2024-01-08',
      status: 'cancelled',
      total: 450000,
      items: [{ name: 'Phone Case', quantity: 3, price: 150000 }],
      shipping_address: 'Yogyakarta, Indonesia',
      payment_method: 'Cash on Delivery',
      tracking_number: null,
    },
    {
      id: 'ORD-005',
      date: '2024-01-05',
      status: 'pending',
      total: 3200000,
      items: [{ name: 'Laptop', quantity: 1, price: 3200000 }],
      shipping_address: 'Medan, Indonesia',
      payment_method: 'Bank Transfer',
      tracking_number: null,
    },
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchTransactions();
  }, [isLoggedIn]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with actual API call
      // const response = await axios.get(`${API_BASE_URL}/orders/user`, {
      //   headers: {
      //     Authorization: `Bearer ${authToken}`,
      //   },
      // });
      // setTransactions(response.data.orders || []);

      // Using mock data for now
      setTimeout(() => {
        setTransactions(mockTransactions);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please login again.');
        logout();
      } else {
        setError('Failed to load transactions. Please try again later.');
      }
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Payment';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter = filter === 'all' || transaction.status === filter;
    const matchesSearch =
      searchTerm === '' ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleViewDetails = (transactionId) => {
    navigate(`/transactions/${transactionId}`);
  };

  const handleTrackOrder = (trackingNumber) => {
    if (trackingNumber) {
      // Open tracking page or modal
      alert(`Tracking order: ${trackingNumber}`);
    } else {
      alert('Tracking information not available yet.');
    }
  };

  const handleReorder = async (transaction) => {
    if (!isLoggedIn) {
      alert('Please login to reorder.');
      return;
    }

    try {
      // Add items back to cart
      for (const item of transaction.items) {
        // Replace with actual API call
        console.log('Adding to cart:', item);
      }
      alert('Items added to cart successfully!');
      navigate('/cart');
    } catch (err) {
      console.error('Error reordering:', err);
      alert('Failed to reorder items. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="transaction-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="transaction-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchTransactions}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-page">
      {/* Header */}
      <div className="transaction-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Home
          </button>
          <div className="header-text">
            <h1>My Orders</h1>
            <p>Track and manage your order history</p>
          </div>
        </div>
      </div>

      <div className="transaction-content">
        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-container">
            <div className="search-wrapper">
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                className="search-input"
                placeholder="Search orders by ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-tabs">
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'pending', label: 'Pending' },
              { key: 'processing', label: 'Processing' },
              { key: 'shipped', label: 'Shipped' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => {
                  setFilter(tab.key);
                  setCurrentPage(1);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        {currentTransactions.length === 0 ? (
          <div className="empty-transactions">
            <div className="empty-icon">📋</div>
            <h2>No orders found</h2>
            <p>
              {filter === 'all'
                ? "You haven't placed any orders yet."
                : `No orders found with status: ${filter}`}
            </p>
            <button
              className="start-shopping-btn"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="transactions-list">
              {currentTransactions.map((transaction) => (
                <div key={transaction.id} className="transaction-card">
                  <div className="transaction-header-card">
                    <div className="transaction-meta">
                      <h3 className="transaction-id">Order {transaction.id}</h3>
                      <p className="transaction-date">
                        Placed on{' '}
                        {new Date(transaction.date).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          },
                        )}
                      </p>
                    </div>
                    <div className="transaction-status">
                      <span
                        className={`status-badge ${getStatusColor(transaction.status)}`}
                      >
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                  </div>

                  <div className="transaction-body">
                    <div className="transaction-items">
                      <h4>Items ({transaction.items.length})</h4>
                      <div className="items-list">
                        {transaction.items.map((item, index) => (
                          <div key={index} className="item-summary">
                            <div className="item-details">
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">
                                Qty: {item.quantity}
                              </span>
                            </div>
                            <span className="item-price">
                              Rp {item.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="transaction-details">
                      <div className="detail-row">
                        <span className="detail-label">Total Amount:</span>
                        <span className="detail-value total-amount">
                          Rp {transaction.total.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Payment Method:</span>
                        <span className="detail-value">
                          {transaction.payment_method}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Shipping Address:</span>
                        <span className="detail-value">
                          {transaction.shipping_address}
                        </span>
                      </div>
                      {transaction.tracking_number && (
                        <div className="detail-row">
                          <span className="detail-label">Tracking Number:</span>
                          <span className="detail-value tracking-number">
                            {transaction.tracking_number}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="transaction-actions">
                    <button
                      className="action-btn secondary"
                      onClick={() => handleViewDetails(transaction.id)}
                    >
                      View Details
                    </button>
                    {transaction.tracking_number && (
                      <button
                        className="action-btn secondary"
                        onClick={() =>
                          handleTrackOrder(transaction.tracking_number)
                        }
                      >
                        Track Order
                      </button>
                    )}
                    {(transaction.status === 'delivered' ||
                      transaction.status === 'cancelled') && (
                      <button
                        className="action-btn primary"
                        onClick={() => handleReorder(transaction)}
                      >
                        Reorder
                      </button>
                    )}
                    {transaction.status === 'pending' && (
                      <button
                        className="action-btn primary"
                        onClick={() => navigate('/checkout')}
                      >
                        Complete Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination-number ${
                        currentPage === index + 1 ? 'active' : ''
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionListPage;
