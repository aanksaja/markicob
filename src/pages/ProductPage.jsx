import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Product.css';
import { useAuth } from '../context/AuthContext';
import PaginationControls from '../components/ui/PaginationControls';
import ProductsGrid from '../components/ui/ProductsGrid';
import FiltersSidebar from '../components/ui/FiltersSidebar';
import ProductsHeader from '../components/ui/ProductsHeader';

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

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      // Check if API is available
      if (!API_BASE_URL) {
        console.warn('API_BASE_URL not configured, using mock data');
        const mockData = getMockProducts();
        setProducts(mockData.data);
        setTotalProducts(mockData.meta.total);
        setCategories(['All Categories', ...mockData.categories]);

        if (mockData.data.length > 0) {
          const prices = mockData.data.map((p) => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);

          if (
            selectedPriceRange[0] === 0 &&
            selectedPriceRange[1] === 1000000
          ) {
            setSelectedPriceRange([minPrice, maxPrice]);
          }
        }

        setCarts([]);
        setProductQuantities({});
        setLoading(false);
        return;
      }

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

          // Fetch categories
          try {
            const urlCategory = `${API_BASE_URL}/items/categories`;
            const responseCategory = await axios.get(urlCategory);
            setCategories(['All Categories', ...responseCategory.data.data]);
          } catch (categoryErr) {
            console.warn('Failed to fetch categories, using default ones');
            setCategories(['All Categories', 'Electronics', 'Furniture']);
          }

          // Set price range based on actual products
          if (response.data.data.length > 0) {
            const prices = response.data.data.map((p) => p.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            setPriceRange([minPrice, maxPrice]);

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
            if (cartResponse.data && cartResponse.data.data) {
              setCarts(cartResponse.data.data);

              const initialQuantities = {};
              cartResponse.data.data.forEach((cartItem) => {
                initialQuantities[cartItem.item_id || cartItem.item?.id] =
                  cartItem.quantity;
              });
              setProductQuantities((prev) => ({
                ...prev,
                ...initialQuantities,
              }));
            }
          } catch (cartErr) {
            console.warn('Cart API not available:', cartErr.message);
            setCarts([]);
          }
        } else {
          setCarts([]);
          setProductQuantities({});
        }
      } catch (err) {
        console.error(
          'API not available, falling back to mock data:',
          err.message,
        );

        // Fallback to mock data when API is not available
        const mockData = getMockProducts();
        setProducts(mockData.data);
        setTotalProducts(mockData.meta.total);
        setCategories(['All Categories', ...mockData.categories]);

        if (mockData.data.length > 0) {
          const prices = mockData.data.map((p) => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          setPriceRange([minPrice, maxPrice]);

          if (
            selectedPriceRange[0] === 0 &&
            selectedPriceRange[1] === 1000000
          ) {
            setSelectedPriceRange([minPrice, maxPrice]);
          }
        }

        setCarts([]);
        setProductQuantities({});

        // Show a warning but don't treat it as an error
        console.warn('Using offline mode with mock data');
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
    if(quantity == 0){
      alert('Quantity cannot be empty / zero !');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/cart/add`, {
          item_id: product.id,
          quantity: quantity
      },{
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      });
       alert('Add item to cart success');
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
    }
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
      <ProductsHeader
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        searchSuggestions={searchSuggestions}
        showSuggestions={showSuggestions}
        onSearchInputChange={handleSearchInputChange}
      />

      {/* Filters and Controls */}
      <div className="controls-section">
        {/* ... (keep the existing controls section) */}
      </div>

      <div className="products-content">
        <FiltersSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
          selectedPriceRange={selectedPriceRange}
          ratingFilter={ratingFilter}
          inStockOnly={inStockOnly}
          onCategoryChange={(category) => {
            if (category === 'All Categories') {
              navigate('/products');
            } else {
              navigate(`/products?category=${encodeURIComponent(category)}`);
            }
            setCurrentPage(1);
          }}
          onPriceRangeChange={setSelectedPriceRange}
          onRatingFilterChange={(rating) =>
            setRatingFilter(ratingFilter === rating ? 0 : rating)
          }
          onStockFilterChange={setInStockOnly}
          onClearFilters={clearAllFilters}
          filtersOpen={filtersOpen}
          onCloseFilters={() => setFiltersOpen(false)}
          formatCurrency={formatCurrency}
        />

        {/* Products Grid */}
        <div className="products-main">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading amazing products...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <ProductsGrid
                products={products}
                viewMode={viewMode}
                productQuantities={productQuantities}
                carts={carts}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                onViewDetail={(id) => navigate(`/products/${id}`)}
              />

              <PaginationControls
                currentPage={currentPage}
                totalItems={totalProducts}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
              />
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
