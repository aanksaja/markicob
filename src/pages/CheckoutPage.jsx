import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { authToken, isLoggedIn } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Transfer to our bank account',
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      icon: '📱',
      description: 'GoPay, OVO, DANA, ShopeePay',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when you receive your order',
    },
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchCartItems();
    loadUserData();
  }, [isLoggedIn]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/list`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCartItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setCustomerInfo({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.alamat || '',
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + (item.item?.price || 0) * item.quantity,
      0
    );
    const shipping = subtotal > 500000 ? 0 : 25000; // Free shipping over 500k
    const tax = subtotal * 0.11; // 11% PPN
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handleInputChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return false;
    }
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      alert('Please fill in all required customer information');
      return false;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return false;
    }
    return true;
  };

  const handleProceedToCheckout = async () => {
    if (!validateForm()) return;

    setProcessing(true);
    try {
      const totals = calculateTotals();
      const orderData = {
        customer_info: customerInfo,
        payment_method: selectedPayment,
        items: cartItems.map((item) => ({
          item_id: item.item.id,
          quantity: item.quantity,
          price: item.item.price,
        })),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
      };

      const response = await axios.post(
        `${API_BASE_URL}/orders/create`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        alert('Order placed successfully!');
        navigate('/transactions');
      } else {
        throw new Error(response.data.message || 'Order failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="back-btn" onClick={() => navigate('/cart')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Cart
        </button>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-main">
          {/* Customer Information */}
          <div className="checkout-section">
            <h2>Customer Information</h2>
            <div className="customer-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={customerInfo.address}
                    onChange={(e) =>
                      handleInputChange('address', e.target.value)
                    }
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`payment-option ${
                    selectedPayment === method.id ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selectedPayment === method.id}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                  />
                  <div className="payment-content">
                    <div className="payment-icon">{method.icon}</div>
                    <div className="payment-details">
                      <h3>{method.name}</h3>
                      <p>{method.description}</p>
                    </div>
                  </div>
                  <div className="payment-check">
                    {selectedPayment === method.id && <span>✓</span>}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="checkout-section">
            <h2>Order Items ({cartItems.length})</h2>
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    {item.item?.image_url ? (
                      <img src={item.item.image_url} alt={item.item.name} />
                    ) : (
                      <div className="placeholder-image">📦</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.item?.name}</h3>
                    <p className="item-price">
                      Rp {item.item?.price?.toLocaleString('id-ID')} ×{' '}
                      {item.quantity}
                    </p>
                  </div>
                  <div className="item-total">
                    Rp{' '}
                    {((item.item?.price || 0) * item.quantity).toLocaleString(
                      'id-ID'
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>Rp {totals.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping Fee</span>
              <span>
                {totals.shipping === 0 ? (
                  <span className="free-shipping">Free</span>
                ) : (
                  `Rp ${totals.shipping.toLocaleString('id-ID')}`
                )}
              </span>
            </div>
            <div className="summary-row">
              <span>Tax (11%)</span>
              <span>Rp {totals.tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rp {totals.total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {totals.shipping === 0 && (
            <div className="shipping-notice">🎉 You got free shipping!</div>
          )}

          <button
            className="checkout-btn"
            onClick={handleProceedToCheckout}
            disabled={processing || !selectedPayment}
          >
            {processing ? (
              <>
                <div className="btn-spinner"></div>
                Processing...
              </>
            ) : (
              `Proceed to Checkout - Rp ${totals.total.toLocaleString('id-ID')}`
            )}
          </button>

          <div className="security-notice">
            <span className="security-icon">🔒</span>
            Your payment information is secure and encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
