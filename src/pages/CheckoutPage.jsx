import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './CheckoutPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { authToken, isLoggedIn, logout } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Review

  // Form data
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  });

  const [shippingMethod, setShippingMethod] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [agreeTerm, setAgreeTerm] = useState(false);

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 50000,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 100000,
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day',
      price: 200000,
    },
  ];

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      description: 'Visa, Mastercard, American Express',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Transfer to our bank account',
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      description: 'GoPay, OVO, DANA',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive the item',
    },
  ];

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    fetchCartItems();
    loadUserProfile();
  }, [isLoggedIn]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/list`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCartItems(response.data.cart_items || []);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setError('Failed to load cart items.');
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        setShippingInfo((prev) => ({
          ...prev,
          fullName: parsedData.name || '',
          email: parsedData.email || '',
          phone: parsedData.phone || '',
          address: parsedData.alamat || '',
        }));
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.item.amount * item.quantity,
      0,
    );

    const selectedShipping = shippingOptions.find(
      (option) => option.id === shippingMethod,
    );
    const shipping = selectedShipping ? selectedShipping.price : 0;

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'shipping') {
      setShippingInfo((prev) => ({ ...prev, [field]: value }));
    } else if (section === 'payment') {
      setPaymentDetails((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return (
          shippingInfo.fullName &&
          shippingInfo.email &&
          shippingInfo.phone &&
          shippingInfo.address &&
          shippingInfo.city &&
          shippingInfo.postalCode &&
          shippingInfo.province &&
          shippingMethod
        );
      case 2:
        if (paymentMethod === 'credit_card') {
          return (
            paymentDetails.cardNumber &&
            paymentDetails.expiryDate &&
            paymentDetails.cvv &&
            paymentDetails.cardName
          );
        }
        return paymentMethod !== '';
      case 3:
        return agreeTerm;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      alert('Please fill in all required fields.');
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(3)) {
      alert('Please agree to the terms and conditions.');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        shipping_info: shippingInfo,
        payment_method: paymentMethod,
        payment_details: paymentMethod === 'credit_card' ? paymentDetails : {},
        shipping_method: shippingMethod,
        special_instructions: specialInstructions,
        items: cartItems.map((item) => ({
          item_id: item.item.id,
          quantity: item.quantity,
          price: item.item.amount,
        })),
        totals: calculateTotals(),
      };

      // Replace with actual API endpoint
      const response = await axios.post(
        `${API_BASE_URL}/orders/create`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      alert('Order placed successfully!');
      navigate('/transactions');
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
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
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out.</p>
          <button
            className="continue-shopping-btn"
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
      {/* Header */}
      <div className="checkout-header">
        <div className="header-content">
          <button className="back-button" onClick={() => navigate('/cart')}>
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
      </div>

      {/* Progress Steps */}
      <div className="checkout-steps">
        <div className="steps-container">
          {[
            { number: 1, title: 'Shipping & Delivery' },
            { number: 2, title: 'Payment Method' },
            { number: 3, title: 'Review & Place Order' },
          ].map((stepItem) => (
            <div
              key={stepItem.number}
              className={`step ${step >= stepItem.number ? 'active' : ''} ${
                step > stepItem.number ? 'completed' : ''
              }`}
            >
              <div className="step-number">{stepItem.number}</div>
              <span className="step-title">{stepItem.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-form">
          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    onChange={(e) =>
                      handleInputChange('shipping', 'fullName', e.target.value)
                    }
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) =>
                      handleInputChange('shipping', 'email', e.target.value)
                    }
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) =>
                      handleInputChange('shipping', 'phone', e.target.value)
                    }
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address *</label>
                  <textarea
                    value={shippingInfo.address}
                    onChange={(e) =>
                      handleInputChange('shipping', 'address', e.target.value)
                    }
                    placeholder="Enter your complete address"
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) =>
                      handleInputChange('shipping', 'city', e.target.value)
                    }
                    placeholder="Enter city"
                  />
                </div>
                <div className="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    value={shippingInfo.postalCode}
                    onChange={(e) =>
                      handleInputChange(
                        'shipping',
                        'postalCode',
                        e.target.value,
                      )
                    }
                    placeholder="Enter postal code"
                  />
                </div>
                <div className="form-group">
                  <label>Province *</label>
                  <select
                    value={shippingInfo.province}
                    onChange={(e) =>
                      handleInputChange('shipping', 'province', e.target.value)
                    }
                  >
                    <option value="">Select Province</option>
                    <option value="jakarta">DKI Jakarta</option>
                    <option value="jawa-barat">Jawa Barat</option>
                    <option value="jawa-tengah">Jawa Tengah</option>
                    <option value="jawa-timur">Jawa Timur</option>
                    <option value="bali">Bali</option>
                  </select>
                </div>
              </div>

              <div className="shipping-options">
                <h3>Shipping Method *</h3>
                <div className="shipping-methods">
                  {shippingOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`shipping-option ${
                        shippingMethod === option.id ? 'selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={shippingMethod === option.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      />
                      <div className="option-details">
                        <div className="option-name">{option.name}</div>
                        <div className="option-description">
                          {option.description}
                        </div>
                      </div>
                      <div className="option-price">
                        Rp {option.price.toLocaleString('id-ID')}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`payment-method ${
                      paymentMethod === method.id ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="method-details">
                      <div className="method-name">{method.name}</div>
                      <div className="method-description">
                        {method.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === 'credit_card' && (
                <div className="credit-card-form">
                  <h3>Credit Card Details</h3>
                  <div className="form-grid">
                    <div className="form-group full-width">
                      <label>Cardholder Name *</label>
                      <input
                        type="text"
                        value={paymentDetails.cardName}
                        onChange={(e) =>
                          handleInputChange(
                            'payment',
                            'cardName',
                            e.target.value,
                          )
                        }
                        placeholder="Name as it appears on card"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        value={paymentDetails.cardNumber}
                        onChange={(e) =>
                          handleInputChange(
                            'payment',
                            'cardNumber',
                            e.target.value,
                          )
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>
                    <div className="form-group">
                      <label>Expiry Date *</label>
                      <input
                        type="text"
                        value={paymentDetails.expiryDate}
                        onChange={(e) =>
                          handleInputChange(
                            'payment',
                            'expiryDate',
                            e.target.value,
                          )
                        }
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="text"
                        value={paymentDetails.cvv}
                        onChange={(e) =>
                          handleInputChange('payment', 'cvv', e.target.value)
                        }
                        placeholder="123"
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="special-instructions">
                <label>Special Instructions (Optional)</label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special delivery instructions..."
                  rows="3"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review Order */}
          {step === 3 && (
            <div className="form-section">
              <h2>Review Your Order</h2>

              <div className="review-section">
                <h3>Shipping Information</h3>
                <div className="review-details">
                  <p>
                    <strong>{shippingInfo.fullName}</strong>
                  </p>
                  <p>{shippingInfo.email}</p>
                  <p>{shippingInfo.phone}</p>
                  <p>{shippingInfo.address}</p>
                  <p>
                    {shippingInfo.city}, {shippingInfo.province}{' '}
                    {shippingInfo.postalCode}
                  </p>
                </div>
              </div>

              <div className="review-section">
                <h3>Payment & Shipping</h3>
                <div className="review-details">
                  <p>
                    <strong>Payment:</strong>{' '}
                    {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                  </p>
                  <p>
                    <strong>Shipping:</strong>{' '}
                    {shippingOptions.find((s) => s.id === shippingMethod)?.name}
                  </p>
                </div>
              </div>

              <div className="review-section">
                <h3>Order Items</h3>
                <div className="order-items">
                  {cartItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-info">
                        <h4>{item.item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p>
                          Price: Rp {item.item.amount.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="item-total">
                        Rp{' '}
                        {(item.item.amount * item.quantity).toLocaleString(
                          'id-ID',
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="terms-agreement">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreeTerm}
                    onChange={(e) => setAgreeTerm(e.target.checked)}
                  />
                  I agree to the{' '}
                  <a href="#" target="_blank">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" target="_blank">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {step > 1 && (
              <button
                className="nav-button prev-button"
                onClick={handlePreviousStep}
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                className="nav-button next-button"
                onClick={handleNextStep}
              >
                Next
              </button>
            ) : (
              <button
                className="nav-button submit-button"
                onClick={handleSubmitOrder}
                disabled={submitting || !agreeTerm}
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="item-details">
                  <span className="item-name">{item.item.name}</span>
                  <span className="item-quantity">Qty: {item.quantity}</span>
                </div>
                <span className="item-price">
                  Rp{' '}
                  {(item.item.amount * item.quantity).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>Rp {totals.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>Rp {totals.shipping.toLocaleString('id-ID')}</span>
            </div>
            <div className="total-row">
              <span>Tax (10%)</span>
              <span>Rp {totals.tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="total-row final-total">
              <span>Total</span>
              <span>Rp {totals.total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
