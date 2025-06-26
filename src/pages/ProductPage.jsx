import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css';
import { useAuth } from '../context/AuthContext';
import SearchForm from '../components/SearchForm';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category');

  const { authToken, isLoggedIn } = useAuth();

  // Product and API States
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carts, setCarts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filter and Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 1000000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  // UI States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Pagination and Cart States
  const [productQuantities, setProductQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Real API integration
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        let url = `${API_BASE_URL}/items/list?limit=${itemsPerPage}&offset=${offset}`;

        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        if (selectedCategory && selectedCategory !== 'All Categories') {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (sortOption) {
          url += `&sort=${sortOption}`;
        }

        console.log('Fetching products from:', url);
        const response = await axios.get(url);
        console.log('API Response:', response.data);

        if (response.data && response.data.data) {
          setProducts(response.data.data);
          setTotalProducts(response.data.meta?.total || 0);

          // Extract unique categories from products and fetch categories
          // const uniqueCategories = [
          //   ...new Set(
          //     response.data.data
          //       .map((product) => product.category)
          //       .filter(
          //         (category) => category !== null && category !== undefined,
          //       ),
          //   ),
          // ];
          const urlCategory = `${API_BASE_URL}/items/categories`
          const responseCategory = await axios.get(urlCategory);
          // api category 
          setCategories(['All Categories', ...responseCategory.data.data]);

          // Set price range based on actual products
          if (response.data.data.length > 0) {
            const prices = response.data.data.map((p) => p.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setPriceRange([minPrice, maxPrice]);

            // Only set selected price range if it hasn't been modified by user
            if (
              selectedPriceRange[0] === 0 &&
              selectedPriceRange[1] === 1000000
            ) {
              setSelectedPriceRange([minPrice, maxPrice]);
            }
          }
        } else {
          setProducts([]);
          setTotalProducts(0);
        }

        // Fetch cart data if user is logged in
        if (isLoggedIn && authToken) {
          try {
            const cartResponse = await axios.get(`${API_BASE_URL}/cart/list`, {
              headers: { Authorization: `Bearer ${authToken}` },
            });
            if (cartResponse.data && cartResponse.data.cart_items) {
              setCarts(cartResponse.data.cart_items);

              // Initialize productQuantities based on cart items
              const initialQuantities = {};
              cartResponse.data.cart_items.forEach((cartItem) => {
                initialQuantities[cartItem.item_id || cartItem.item?.id] =
                  cartItem.quantity;
              });
              setProductQuantities((prev) => ({
                ...prev,
                ...initialQuantities,
              }));
            }
          } catch (cartErr) {
            console.error('Error fetching cart:', cartErr);
            setCarts([]);
          }
        } else {
          setCarts([]);
          setProductQuantities({});
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    itemsPerPage,
    selectedCategory,
    authToken,
    isLoggedIn,
    searchQuery,
    sortOption,
  ]);

  // Since we're using server-side pagination and filtering, products are already filtered
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Format currency
  const formatCurrency = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Generate search suggestions
  const generateSearchSuggestions = (query) => {
    if (!query) return [];

    const suggestions = products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.brand.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 5)
      .map((product) => ({
        type: 'product',
        text: product.name,
        category: product.category,
      }));

    const brandSuggestions = [...new Set(products.map((p) => p.brand))]
      .filter((brand) => brand.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map((brand) => ({
        type: 'brand',
        text: brand,
      }));

    return [...suggestions, ...brandSuggestions];
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setShowSuggestions(false);
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchSuggestions(generateSearchSuggestions(query));
    setShowSuggestions(query.length > 0);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSortOption('');
    setSelectedPriceRange(priceRange);
    setRatingFilter(0);
    setInStockOnly(false);
    setCurrentPage(1);
    setActiveFilters({});
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory && selectedCategory !== 'All Categories') count++;
    if (
      selectedPriceRange[0] !== priceRange[0] ||
      selectedPriceRange[1] !== priceRange[1]
    )
      count++;
    if (ratingFilter > 0) count++;
    if (inStockOnly) count++;
    return count;
  };

  // Handle quantity change
  const handleQuantityChange = (productId, value) => {
    let newQuantity;
    if (typeof value === 'number') {
      const currentQuantity = productQuantities[productId] || 0;
      newQuantity = Math.max(0, currentQuantity + value);
    } else {
      newQuantity = parseInt(value, 10);
      if (isNaN(newQuantity) || newQuantity < 0) {
        newQuantity = 0;
      }
    }
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: newQuantity,
    }));
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      alert('Please login to add products to cart');
      navigate('/login');
      return;
    }

    const quantity = productQuantities[product.id] || 0;
    // Simulate add to cart
    alert(`Added ${product.name} (${quantity} pcs) to cart!`);
    // Real implementation would make API call here
  };

  // Pagination component
  const PaginationControls = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 7;

      if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = Math.min(maxVisible - 1, totalPages);
      }
      if (currentPage >= totalPages - 2) {
        start = Math.max(totalPages - maxVisible + 2, 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }

      return pages;
    };

    return (
      <div className="pagination-wrapper">
        <div className="pagination-info">
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, totalProducts)} of{' '}
          {totalProducts} products
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button
              className="pagination-btn nav-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Previous
            </button>

            <div className="pagination-numbers">
              {getPageNumbers().map((page, index) =>
                page === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="pagination-ellipsis"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${page}`}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              className="pagination-btn nav-btn"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 4L10 8L6 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
  };

  // Product card component
  const ProductCard = ({ product }) => {
    const currentQuantity = productQuantities[product.id] || 0;
    const isInCart = carts.some((item) => item.item_id === product.id);

    const handleDetailPage = async (id) => {
      navigate(`/products/${id}`);
    };

    return (
      <div className={`product-card ${viewMode}`}>
        <div 
          onClick={() => handleDetailPage(product.id)} 
          className="product-image-wrapper">
          <img
            src={product.image_url}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          {!product.is_active && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
          <div className="product-badges">
            {product.rating >= 4.5 && (
              <span className="badge best-seller">⭐ Best Seller</span>
            )}
            {product.stock <= 5 && product.is_active && (
              <span className="badge low-stock">📦 Low Stock</span>
            )}
          </div>
        </div>

        <div className="product-info">
          <div className="product-category">
            {product.category || 'Uncategorized'}
          </div>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>

          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="rating-text">
              {product.rating || 0} ({product.reviews || 0} reviews)
            </span>
          </div>

          {product.features && product.features.length > 0 && (
            <div className="product-features">
              {product.features.slice(0, 2).map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          )}

          <div className="product-pricing">
            <div className="price-main">{formatCurrency(product.price)}</div>
            {product.brand && (
              <div className="product-brand">by {product.brand}</div>
            )}
          </div>

          {product.is_active && (
            <div className="quantity-controls">
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(product.id, -1)}
                  disabled={currentQuantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="quantity-input"
                  value={currentQuantity}
                  onChange={(e) =>
                    handleQuantityChange(product.id, e.target.value)
                  }
                  min="1"
                  max={product.stock}
                />
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(product.id, 1)}
                  disabled={currentQuantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-actions">
            <button
              className={`add-to-cart-btn ${!product.is_active ? 'disabled' : ''}`}
              onClick={() => handleAddToCart(product)}
              disabled={!product.is_active}
            >
              {!product.is_active ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1V15M1 8H15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Out of Stock
                </>
              ) : isInCart ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.5 3L6 10.5L2.5 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Update Cart
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 3H5L5.4 5M7 13C7.55228 13 8 12.5523 8 12C8 11.4477 7.55228 11 7 11C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13ZM13 13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13ZM5.4 5H14.2L13 9H6L5.4 5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Header Section */}
      <div className="products-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              {selectedCategory && selectedCategory !== 'All Categories'
                ? selectedCategory
                : 'All Products'}
            </h1>
            <p className="page-subtitle">
              Discover our carefully curated collection of premium products
            </p>
          </div>

          {/* Search Bar */}
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
              <SearchForm/>
              {/* <input
                type="text"
                className="search-input"
                placeholder="Search products, brands, categories..."
                // value={searchQuery}
                // onChange={handleSearchInputChange}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              /> */}
              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => handleSearch('')}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12 4L4 12M4 4L12 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSearch(suggestion.text)}
                  >
                    <span className="suggestion-type">
                      {suggestion.type === 'product' ? '📦' : '🏷️'}
                    </span>
                    <span className="suggestion-text">{suggestion.text}</span>
                    {suggestion.category && (
                      <span className="suggestion-category">
                        in {suggestion.category}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="controls-section">
        <div className="controls-wrapper">
          <div className="left-controls">
            <button
              className={`filter-toggle ${filtersOpen ? 'active' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M2.25 4.5H15.75M4.5 9H13.5M6.75 13.5H11.25"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="filter-count">{getActiveFiltersCount()}</span>
              )}
            </button>

            <div className="items-per-page">
              <label>Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>

            <div className="results-info">
              <span>{totalProducts} products found</span>
            </div>
          </div>

          <div className="right-controls">
            <div className="view-mode-toggle">
              <button
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="1"
                    y="1"
                    width="6"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="9"
                    y="1"
                    width="6"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="1"
                    y="9"
                    width="6"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="9"
                    y="9"
                    width="6"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              <button
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <line
                    x1="4"
                    y1="4"
                    x2="14"
                    y2="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="4"
                    y1="8"
                    x2="14"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="4"
                    y1="12"
                    x2="14"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="2" cy="4" r="0.5" fill="currentColor" />
                  <circle cx="2" cy="8" r="0.5" fill="currentColor" />
                  <circle cx="2" cy="12" r="0.5" fill="currentColor" />
                </svg>
              </button>
            </div>

            <div className="sort-selector">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort by: Default</option>
                <option value="popularity">Most Popular</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFiltersCount() > 0 && (
          <div className="active-filters">
            <div className="active-filters-content">
              <span className="active-filters-label">Active filters:</span>
              <div className="filter-tags">
                {searchQuery && (
                  <span className="filter-tag">
                    Search: "{searchQuery}"
                    <button onClick={() => handleSearch('')}>×</button>
                  </span>
                )}
                {selectedCategory && selectedCategory !== 'All Categories' && (
                  <span className="filter-tag">
                    Category: {selectedCategory}
                    <button
                      onClick={() => {
                        navigate('/products');
                        setCurrentPage(1);
                      }}
                    >
                      ×
                    </button>
                  </span>
                )}
                {(selectedPriceRange[0] !== priceRange[0] ||
                  selectedPriceRange[1] !== priceRange[1]) && (
                  <span className="filter-tag">
                    Price: {formatCurrency(selectedPriceRange[0])} -{' '}
                    {formatCurrency(selectedPriceRange[1])}
                    <button onClick={() => setSelectedPriceRange(priceRange)}>
                      ×
                    </button>
                  </span>
                )}
                {ratingFilter > 0 && (
                  <span className="filter-tag">
                    Rating: {ratingFilter}+ ⭐
                    <button onClick={() => setRatingFilter(0)}>×</button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="filter-tag">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)}>×</button>
                  </span>
                )}
              </div>
              <button className="clear-all-filters" onClick={clearAllFilters}>
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="products-content">
        {/* Sidebar Filters */}
        <div className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            <button
              className="close-filters"
              onClick={() => setFiltersOpen(false)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="filters-content">
            {/* Category Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Category</h4>
              <div className="filter-options">
                {categories.map((category) => (
                  <label key={category} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={
                        (!selectedCategory && category === 'All Categories') ||
                        selectedCategory === category
                      }
                      onChange={() => {
                        if (category === 'All Categories') {
                          navigate('/products');
                        } else {
                          navigate(
                            `/products?category=${encodeURIComponent(category)}`,
                          );
                        }
                        setCurrentPage(1);
                      }}
                    />
                    <span className="checkmark"></span>
                    {category}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Price Range</h4>
              <div className="price-range-filter">
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={selectedPriceRange[0]}
                    onChange={(e) =>
                      setSelectedPriceRange([
                        Number(e.target.value),
                        selectedPriceRange[1],
                      ])
                    }
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={selectedPriceRange[1]}
                    onChange={(e) =>
                      setSelectedPriceRange([
                        selectedPriceRange[0],
                        Number(e.target.value),
                      ])
                    }
                  />
                </div>
                <div className="price-range-display">
                  {formatCurrency(selectedPriceRange[0])} -{' '}
                  {formatCurrency(selectedPriceRange[1])}
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Minimum Rating</h4>
              <div className="rating-filter">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="filter-option">
                    <input
                      type="radio"
                      name="rating"
                      checked={ratingFilter === rating}
                      onChange={() =>
                        setRatingFilter(ratingFilter === rating ? 0 : rating)
                      }
                    />
                    <span className="checkmark"></span>
                    <div className="rating-display">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < rating ? 'filled' : ''}`}
                        >
                          ⭐
                        </span>
                      ))}
                      <span className="rating-text">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="filter-group">
              <h4 className="filter-title">Availability</h4>
              <label className="filter-option">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span className="checkmark"></span>
                In Stock Only
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-main">
          {products.length > 0 ? (
            <>
              <div className={`products-grid ${viewMode}`}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <PaginationControls />
            </>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search terms</p>
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Overlay for Mobile */}
      {filtersOpen && (
        <div
          className="filters-overlay"
          onClick={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductPage;
