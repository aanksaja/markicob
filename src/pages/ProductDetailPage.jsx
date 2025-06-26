import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken, isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviews, setShowReviews] = useState(false);

  // Mock reviews data (replace with API call)
  const [reviews] = useState([
    {
      id: 1,
      user: 'John Doe',
      rating: 5,
      comment: 'Excellent product! Great quality and fast delivery.',
      date: '2024-01-15',
    },
    {
      id: 2,
      user: 'Sarah Smith',
      rating: 4,
      comment: 'Good value for money. Recommended!',
      date: '2024-01-10',
    },
    {
      id: 3,
      user: 'Mike Johnson',
      rating: 5,
      comment: 'Perfect! Exactly what I was looking for.',
      date: '2024-01-05',
    },
  ]);

  const [relatedProducts] = useState([
    {
      id: 101,
      name: 'Similar Product 1',
      price: 750000,
      category: 'Electronics',
    },
    {
      id: 102,
      name: 'Similar Product 2',
      price: 890000,
      category: 'Electronics',
    },
    {
      id: 103,
      name: 'Similar Product 3',
      price: 650000,
      category: 'Electronics',
    },
  ]);

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/items/${id}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product detail:', err);
      setError('Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await axios.post(
        `${API_BASE_URL}/cart/add`,
        {
          item_id: product.id,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      alert('Please login to purchase');
      navigate('/login');
      return;
    }
    // Add to cart and navigate to checkout
    handleAddToCart();
    setTimeout(() => {
      navigate('/checkout');
    }, 1000);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Product Not Found</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <h2>Product not found</h2>
          <button className="back-btn" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const productImages = [
    'https://via.placeholder.com/600x600/f3f4f6/374151?text=Product+Image+1',
    'https://via.placeholder.com/600x600/f3f4f6/374151?text=Product+Image+2',
    'https://via.placeholder.com/600x600/f3f4f6/374151?text=Product+Image+3',
    'https://via.placeholder.com/600x600/f3f4f6/374151?text=Product+Image+4',
  ];

  return (
    <div className="product-detail-page">
      {/* Navigation */}
      <div className="breadcrumb">
        <div className="breadcrumb-container">
          <button
            onClick={() => navigate('/products')}
            className="breadcrumb-link"
          >
            Products
          </button>
          <span className="breadcrumb-separator">›</span>
          <button
            onClick={() => navigate(`/products?category=${product.category}`)}
            className="breadcrumb-link"
          >
            {product.category}
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <div className="product-detail-container">
        <div className="product-detail-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={product.image_url}
                alt={product.name}
                className="main-product-image"
              />
            </div>
            <div className="image-thumbnails">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`Product view ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {renderStars(Math.round(calculateAverageRating()))}
                </div>
                <span className="rating-text">
                  {calculateAverageRating()} ({reviews.length} reviews)
                </span>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              {/* <span className="original-price">
                Rp {(product.price * 1.2).toLocaleString('id-ID')}
              </span> */}
              {/* <span className="discount-badge">17% OFF</span> */}
            </div>

            <div className="product-details">
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{product.category}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Stock:</span>
                <span className="detail-value stock-available">In Stock {product.is_active}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">SKU:</span>
                <span className="detail-value">PRD-{product.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Brand:</span>
                <span className="detail-value">Premium Brand</span>
              </div>
            </div>

            <div className="product-description">
              <h3>Product Description</h3>
              <p>
                {product.description}
              </p>
              {/* <ul>
                <li>Premium quality materials</li>
                <li>Durable construction</li>
                <li>1-year warranty included</li>
                <li>Free shipping available</li>
                <li>Easy returns within 30 days</li>
              </ul> */}
            </div>

            {/* Purchase Section */}
            <div className="purchase-section">
              <div className="quantity-selector">
                <span className="quantity-label">Quantity:</span>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min="1"
                    max="99"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="purchase-buttons">
                <button
                  className="add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  className="buy-now-btn"
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            <button
              className="toggle-reviews-btn"
              onClick={() => setShowReviews(!showReviews)}
            >
              {showReviews ? 'Hide Reviews' : 'Show All Reviews'}
            </button>
          </div>

          <div className="reviews-summary">
            <div className="average-rating">
              <span className="rating-number">{calculateAverageRating()}</span>
              <div className="rating-stars">
                {renderStars(Math.round(calculateAverageRating()))}
              </div>
              <span className="total-reviews">({reviews.length} reviews)</span>
            </div>
          </div>

          {showReviews && (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">{review.user}</span>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="related-product-card">
                <div className="related-product-image">
                  <div className="placeholder-image">📦</div>
                </div>
                <h3 className="related-product-name">{relatedProduct.name}</h3>
                <p className="related-product-price">
                  Rp {relatedProduct.price.toLocaleString('id-ID')}
                </p>
                <button
                  className="view-product-btn"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  View Product
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
