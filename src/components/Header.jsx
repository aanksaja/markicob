import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Header.css';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = () => {
  const navigate = useNavigate();
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);

      // If no API URL configured, use default categories
      if (!API_BASE_URL) {
        setCategories([
          'Semua Kategori',
          'Electronics',
          'Furniture',
          'Clothing',
        ]);
        setLoadingCategories(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/items/categories`);
        const apiCategories = response.data.data || [];
        // Ensure no duplicates by using Set
        const uniqueCategories = [
          'Semua Kategori',
          ...new Set(apiCategories.filter((cat) => cat !== 'Semua Kategori')),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.warn(
          'Categories API not available, using default categories:',
          err.message,
        );
        setCategories([
          'Semua Kategori',
          'Electronics',
          'Furniture',
          'Clothing',
        ]);
        // Only show error if it's not a 404 (API unavailable)
        if (err.response?.status !== 404) {
          setErrorCategories('Gagal memuat kategori.');
        }
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category)}`);
    setIsProductsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
    setIsUsersDropdownOpen(false);
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Brand/Logo Section */}
        <div className="brand-section">
          <Link to="/" className="brand-link" onClick={handleLinkClick}>
            <div className="brand-logo">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="8" fill="url(#gradient)" />
                <path d="M8 12h16v8H8V12z" fill="white" fillOpacity="0.9" />
                <path
                  d="M12 8v16M20 8v16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0"
                    y1="0"
                    x2="32"
                    y2="32"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#667eea" />
                    <stop offset="1" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="brand-text">Panto</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="desktop-nav"
          role="navigation"
          aria-label="Main navigation"
        >
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleLinkClick}>
                <span className="nav-icon">🏠</span>
                Home
              </Link>
            </li>

            <li
              className="nav-item dropdown-container"
              onMouseEnter={() => setIsProductsDropdownOpen(true)}
              onMouseLeave={() => setIsProductsDropdownOpen(false)}
            >
              <button
                className="nav-link dropdown-trigger"
                aria-expanded={isProductsDropdownOpen}
                aria-haspopup="true"
              >
                <span className="nav-icon">📦</span>
                Products
                <svg
                  className={`dropdown-arrow ${isProductsDropdownOpen ? 'rotated' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className={`dropdown-menu ${isProductsDropdownOpen ? 'open' : ''}`}
                role="menu"
              >
                <div className="dropdown-content">
                  {loadingCategories ? (
                    <div className="dropdown-item loading">
                      <div className="loading-spinner"></div>
                      <span>Loading categories...</span>
                    </div>
                  ) : errorCategories ? (
                    <div className="dropdown-item error">
                      <span className="error-icon">⚠️</span>
                      <span>Failed to load categories</span>
                    </div>
                  ) : (
                    categories.map((category) => (
                      <button
                        key={category}
                        className="dropdown-item"
                        onClick={() => handleCategoryClick(category)}
                        role="menuitem"
                      >
                        <span className="category-icon">📂</span>
                        {category}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </li>

            {isLoggedIn && (
              <>
               
                <li className="nav-item">
                  <Link
                    to="/cart"
                    className="nav-link cart-link"
                    onClick={handleLinkClick}
                  >
                    <span className="nav-icon">🛒</span>
                    Cart
                    <span className="cart-badge">3</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="/profile"
                    className="nav-link"
                    onClick={handleLinkClick}
                  >
                    <span className="nav-icon">👤</span>
                    Profile
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Auth Actions */}
          <div className="auth-actions">
            {isLoggedIn ? (
              <button
                className="auth-button logout-button"
                onClick={handleLogout}
              >
                <span className="button-icon">🚪</span>
                Logout
              </button>
            ) : (
              <button
                className="auth-button login-button"
                onClick={handleLogin}
              >
                <span className="button-icon">🔐</span>
                Login
              </button>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          <span
            className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}
          ></span>
          <span
            className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}
          ></span>
          <span
            className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}
          ></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-nav-section">
            <Link to="/" className="mobile-nav-link" onClick={handleLinkClick}>
              <span className="nav-icon">🏠</span>
              Home
            </Link>

            <div className="mobile-dropdown">
              <button
                className="mobile-nav-link dropdown-trigger"
                onClick={() =>
                  setIsProductsDropdownOpen(!isProductsDropdownOpen)
                }
                aria-expanded={isProductsDropdownOpen}
              >
                <span className="nav-icon">📦</span>
                Products
                <svg
                  className={`dropdown-arrow ${isProductsDropdownOpen ? 'rotated' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div
                className={`mobile-dropdown-content ${isProductsDropdownOpen ? 'open' : ''}`}
              >
                {loadingCategories ? (
                  <div className="mobile-dropdown-item loading">
                    <div className="loading-spinner"></div>
                    <span>Loading...</span>
                  </div>
                ) : errorCategories ? (
                  <div className="mobile-dropdown-item error">
                    <span>Failed to load</span>
                  </div>
                ) : (
                  categories.map((category) => (
                    <button
                      key={category}
                      className="mobile-dropdown-item"
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  ))
                )}
              </div>
            </div>

            {isLoggedIn && (
              <>
                <div className="mobile-dropdown">
                  <button
                    className="mobile-nav-link dropdown-trigger"
                    onClick={() => setIsUsersDropdownOpen(!isUsersDropdownOpen)}
                    aria-expanded={isUsersDropdownOpen}
                  >
                    <span className="nav-icon">👥</span>
                    Users
                    <svg
                      className={`dropdown-arrow ${isUsersDropdownOpen ? 'rotated' : ''}`}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <div
                    className={`mobile-dropdown-content ${isUsersDropdownOpen ? 'open' : ''}`}
                  >
                    <Link
                      to="/users/list"
                      className="mobile-dropdown-item"
                      onClick={handleLinkClick}
                    >
                      List Users
                    </Link>
                    <Link
                      to="/users/add"
                      className="mobile-dropdown-item"
                      onClick={handleLinkClick}
                    >
                      Add User
                    </Link>
                  </div>
                </div>

                <Link
                  to="/cart"
                  className="mobile-nav-link"
                  onClick={handleLinkClick}
                >
                  <span className="nav-icon">🛒</span>
                  Cart
                  <span className="cart-badge">3</span>
                </Link>

                <Link
                  to="/profile"
                  className="mobile-nav-link"
                  onClick={handleLinkClick}
                >
                  <span className="nav-icon">👤</span>
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="mobile-auth-section">
            {isLoggedIn ? (
              <button
                className="mobile-auth-button logout-button"
                onClick={handleLogout}
              >
                <span className="button-icon">🚪</span>
                Logout
              </button>
            ) : (
              <button
                className="mobile-auth-button login-button"
                onClick={handleLogin}
              >
                <span className="button-icon">🔐</span>
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        ></div>
      )}
    </header>
  );
};

export default Header;
