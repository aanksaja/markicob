import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

function HomePage() {
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalProducts: 1247,
    totalUsers: 523,
    totalOrders: 892,
    revenue: 45678,
  });

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate loading stats (in real app, this would be an API call)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalProducts: prev.totalProducts + Math.floor(Math.random() * 3),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 2),
        totalOrders: prev.totalOrders + Math.floor(Math.random() * 5),
        revenue: prev.revenue + Math.floor(Math.random() * 100),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num * 1000);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      id: 'add-product',
      title: 'Add Product',
      description: 'Create new product listing',
      icon: '📦',
      color: 'blue',
      action: () => navigate('/products/add'),
      requiresAuth: true,
    },
    {
      id: 'view-products',
      title: 'View Products',
      description: 'Browse product catalog',
      icon: '🛍️',
      color: 'green',
      action: () => navigate('/products'),
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'User administration',
      icon: '👥',
      color: 'purple',
      action: () => navigate('/users/list'),
      requiresAuth: true,
    },
    {
      id: 'view-cart',
      title: 'View Cart',
      description: 'Check shopping cart',
      icon: '🛒',
      color: 'orange',
      action: () => navigate('/cart'),
      requiresAuth: true,
    },
    {
      id: 'profile-settings',
      title: 'Profile Settings',
      description: 'Manage your account',
      icon: '⚙️',
      color: 'red',
      action: () => navigate('/profile'),
      requiresAuth: true,
    },
    {
      id: 'about-us',
      title: 'About Us',
      description: 'Learn more about Panto',
      icon: 'ℹ️',
      color: 'cyan',
      action: () => navigate('/about'),
    },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Laptop',
      category: 'Electronics',
      price: 15999000,
      image: '💻',
      rating: 4.8,
      inStock: true,
    },
    {
      id: 2,
      name: 'Designer Chair',
      category: 'Furniture',
      price: 2499000,
      image: '🪑',
      rating: 4.6,
      inStock: true,
    },
    {
      id: 3,
      name: 'Smart Watch',
      category: 'Electronics',
      price: 3999000,
      image: '⌚',
      rating: 4.9,
      inStock: false,
    },
    {
      id: 4,
      name: 'Coffee Maker',
      category: 'Appliances',
      price: 1299000,
      image: '☕',
      rating: 4.7,
      inStock: true,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'order',
      message: 'New order #1247 received',
      time: '2 minutes ago',
      icon: '🛍️',
      color: 'green',
    },
    {
      id: 2,
      type: 'user',
      message: 'New user registration',
      time: '15 minutes ago',
      icon: '👤',
      color: 'blue',
    },
    {
      id: 3,
      type: 'product',
      message: 'Product "Smart Watch" updated',
      time: '1 hour ago',
      icon: '📦',
      color: 'purple',
    },
    {
      id: 4,
      type: 'system',
      message: 'System backup completed',
      time: '2 hours ago',
      icon: '💾',
      color: 'cyan',
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="hero-content">
          <div className="welcome-text">
            <h1 className="hero-title">
              {isLoggedIn ? (
                <>
                  {getGreeting()},{' '}
                  <span className="user-name">
                    {currentUser?.name || 'User'}
                  </span>
                  ! 👋
                </>
              ) : (
                <>
                  Welcome to <span className="brand-highlight">Panto</span>
                </>
              )}
            </h1>
            <p className="hero-subtitle">
              {isLoggedIn
                ? `Ready to manage your business? Today is ${currentTime.toLocaleDateString(
                    'id-ID',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}`
                : 'Your complete e-commerce management platform with powerful tools and beautiful design'}
            </p>
            <div className="current-time">
              🕐 {currentTime.toLocaleTimeString('id-ID')}
            </div>
          </div>

          {!isLoggedIn && (
            <div className="hero-cta">
              <button
                className="cta-button primary"
                onClick={() => navigate('/login')}
              >
                <span className="button-icon">🚀</span>
                Get Started
              </button>
              <button
                className="cta-button secondary"
                onClick={() => navigate('/about')}
              >
                <span className="button-icon">📖</span>
                Learn More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Dashboard */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">📊 Live Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <div className="stat-number">
                  {formatNumber(stats.totalProducts)}
                </div>
                <div className="stat-label">Total Products</div>
              </div>
              <div className="stat-trend positive">+12</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <div className="stat-number">
                  {formatNumber(stats.totalUsers)}
                </div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-trend positive">+5</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛍️</div>
              <div className="stat-info">
                <div className="stat-number">
                  {formatNumber(stats.totalOrders)}
                </div>
                <div className="stat-label">Total Orders</div>
              </div>
              <div className="stat-trend positive">+23</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <div className="stat-number">
                  {formatCurrency(stats.revenue)}
                </div>
                <div className="stat-label">Revenue</div>
              </div>
              <div className="stat-trend positive">+8.5%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <div className="container">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="actions-grid">
            {quickActions
              .filter((action) => !action.requiresAuth || isLoggedIn)
              .map((action) => (
                <div
                  key={action.id}
                  className={`action-card ${action.color}`}
                  onClick={action.action}
                >
                  <div className="action-icon">{action.icon}</div>
                  <div className="action-content">
                    <h3 className="action-title">{action.title}</h3>
                    <p className="action-description">{action.description}</p>
                  </div>
                  <div className="action-arrow">→</div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🌟 Featured Products</h2>
            <Link to="/products" className="view-all-link">
              View All Products →
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <span className="product-emoji">{product.image}</span>
                  {!product.inStock && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}
                </div>

                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    {'⭐'.repeat(Math.floor(product.rating))} {product.rating}
                  </div>
                  <div className="product-price">
                    {formatCurrency(product.price)}
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    className={`product-button ${!product.inStock ? 'disabled' : ''}`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? '🛒 Add to Cart' : '❌ Unavailable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      {isLoggedIn && (
        <section className="activity-section">
          <div className="container">
            <h2 className="section-title">📈 Recent Activity</h2>

            <div className="activity-container">
              <div className="activity-timeline">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon ${activity.color}`}>
                      {activity.icon}
                    </div>
                    <div className="activity-content">
                      <div className="activity-message">{activity.message}</div>
                      <div className="activity-time">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="activity-summary">
                <h3 className="summary-title">Today's Summary</h3>
                <div className="summary-stats">
                  <div className="summary-item">
                    <span className="summary-number">23</span>
                    <span className="summary-label">New Orders</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">8</span>
                    <span className="summary-label">New Users</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-number">95%</span>
                    <span className="summary-label">System Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Showcase */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">✨ Platform Features</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Beautiful Design</h3>
              <p className="feature-description">
                Modern, responsive interface with glassmorphism effects and
                smooth animations
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Lightning Fast</h3>
              <p className="feature-description">
                Optimized performance with efficient loading and real-time
                updates
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Reliable</h3>
              <p className="feature-description">
                Advanced security measures and reliable data protection
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile Responsive</h3>
              <p className="feature-description">
                Perfect experience across all devices and screen sizes
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3 className="feature-title">Global Ready</h3>
              <p className="feature-description">
                Multi-language support and international currency formatting
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Analytics Dashboard</h3>
              <p className="feature-description">
                Comprehensive analytics and reporting with real-time insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!isLoggedIn && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Get Started?</h2>
              <p className="cta-description">
                Join thousands of businesses already using Panto to manage their
                e-commerce operations
              </p>
              <div className="cta-buttons">
                <button
                  className="cta-button primary"
                  onClick={() => navigate('/login')}
                >
                  <span className="button-icon">🚀</span>
                  Start Your Journey
                </button>
                <button
                  className="cta-button secondary"
                  onClick={() => navigate('/about')}
                >
                  <span className="button-icon">❓</span>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
