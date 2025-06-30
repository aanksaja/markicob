import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CartPage = () => {
  const { authToken, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Calculate totals
  const calculateTotals = useCallback(() => {
    const subtotal = cartItems.reduce((total, cartItem) => {
      const quantity = quantities[cartItem.id] || cartItem.quantity;
      // return total + cartItem.item.price * quantity;
      return 0;
    }, 0);

    const shipping = subtotal > 0 ? 50000 : 0; // Free shipping over certain price
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  }, [cartItems, quantities]);

  const fetchCartItems = useCallback(async () => {
    if (!isLoggedIn || !authToken) {
      setError('You must be logged in to view your cart.');
      setLoading(false);
      return;
    }

    // If no API URL configured, show empty cart
    if (!API_BASE_URL) {
      console.warn('API not configured, showing empty cart');
      setCartItems([]);
      setQuantities({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/cart/list`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setCartItems(response.data.data || []);

      // Initialize quantities state
      const initialQuantities = {};
      response.data.data?.forEach((item) => {
        initialQuantities[item.id] = item.quantity;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.warn('Cart API error:', err.message);
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please login again.');
        logout();
        localStorage.removeItem('authToken');
        navigate('/login');
      } else if (err.response?.status === 404) {
        // API not available, show empty cart without error
        console.warn('Cart API not available, showing empty cart');
        setCartItems([]);
        setQuantities({});
      } else {
        setError('Failed to load cart. Please try again later.');
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [authToken, isLoggedIn, logout]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleRemoveFromCart = async (cartItemId) => {
    if (!isLoggedIn || !authToken) {
      alert('You must be logged in to manage your cart.');
      return;
    }

    if (
      window.confirm(
        'Are you sure you want to remove this item from your cart?'
      )
    ) {
      setUpdatingItems((prev) => new Set(prev).add(cartItemId));
      try {
        await axios.delete(`${API_BASE_URL}/cart/delete?ids=${cartItemId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        await fetchCartItems();
      } catch (err) {
        console.error('Error removing item from cart:', err);
        if (err.response && err.response.status === 401) {
          alert('Your session has expired. Please login again.');
          logout();
          localStorage.removeItem('authToken');
          navigate('/login');
        } else {
          alert('Failed to remove item from cart. Please try again.');
        }
      } finally {
        setUpdatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cartItemId);
          return newSet;
        });
      }
    }
  };

  const handleUpdateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      newQuantity = 1;
    }
    if (newQuantity > 99) {
      newQuantity = 99;
    }

    setQuantities((prev) => ({
      ...prev,
      [cartItemId]: newQuantity,
    }));
  };

  const handleUpdateCart = async (cartItemId) => {
    if (!isLoggedIn || !authToken) {
      alert('You must be logged in to manage your cart.');
      return;
    }

    const newQuantity = quantities[cartItemId];
    setUpdatingItems((prev) => new Set(prev).add(cartItemId));

    try {
      await axios.put(
        `${API_BASE_URL}/cart/update/${cartItemId}`,
        {
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      await fetchCartItems();
    } catch (err) {
      console.error('Error updating cart item:', err);
      if (err.response && err.response.status === 401) {
        alert('Your session has expired. Please login again.');
        logout();
        localStorage.removeItem('authToken');
        navigate('/login');
      } else {
        alert('Failed to update cart item. Please try again.');
      }
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cart-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={fetchCartItems}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button
            className="continue-shopping-btn"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <div className="header-text">
          <h1>Shopping Cart</h1>
          <p>
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your
            cart
          </p>
        </div>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((cartItem) => {
            const currentQuantity =
              quantities[cartItem.id] || cartItem.quantity;
            const hasChanged = currentQuantity !== cartItem.quantity;
            const isUpdating = updatingItems.has(cartItem.id);

            return (
              <div key={cartItem.id} className="cart-item">
                <div className="item-image">
                  <div className="placeholder-image">
                    <span>📦</span>
                  </div>
                </div>

                <div className="item-details">
                  <h3 className="item-name">{cartItem.item.name}</h3>
                  <p className="item-category">{cartItem.item.category}</p>
                  <p className="item-price">
                    Rp {cartItem.item.price.toLocaleString('id-ID')}
                  </p>
                  <p className="item-stock">In Stock</p>
                </div>

                <div className="item-controls">
                  <div className="quantity-section">
                    <label className="quantity-label">Quantity</label>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleUpdateQuantity(cartItem.id, currentQuantity - 1)
                        }
                        disabled={currentQuantity <= 1 || isUpdating}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        className="quantity-input"
                        value={currentQuantity}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            cartItem.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        min="1"
                        max="99"
                        disabled={isUpdating}
                      />
                      <button
                        className="quantity-btn"
                        onClick={() =>
                          handleUpdateQuantity(cartItem.id, currentQuantity + 1)
                        }
                        disabled={currentQuantity >= 99 || isUpdating}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-actions">
                    {hasChanged && (
                      <button
                        className="update-btn"
                        onClick={() => handleUpdateCart(cartItem.id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : 'Update'}
                      </button>
                    )}
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveFromCart(cartItem.id)}
                      disabled={isUpdating}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  <p className="total-price">
                    Rp{' '}
                    {(cartItem.item.price * currentQuantity).toLocaleString(
                      'id-ID'
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="cart-summary">
          <div className="summary-header">
            <h2>Order Summary</h2>
          </div>

          <div className="summary-details">
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>Rp {totals.subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {totals.shipping === 0
                  ? 'Free'
                  : `Rp ${totals.shipping.toLocaleString('id-ID')}`}
              </span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>Rp {totals.tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row">
              <span>Total</span>
              <span>Rp {totals.total.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="summary-actions">
            <button
              className="continue-shopping-btn"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
