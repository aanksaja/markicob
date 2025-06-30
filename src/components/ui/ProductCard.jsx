import React from 'react';

const ProductCard = ({ 
  product, 
  currentQuantity, 
  isInCart, 
  onQuantityChange, 
  onAddToCart, 
  onViewDetail,
  viewMode,
  carts
}) => {
  const formatCurrency = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };
  const mapCart = carts.reduce((acc, cart) => {
    acc[cart.item_id] = cart; // Use item's ID as the key
    return acc;
  }, {});

  return (
    <div className={`product-card ${viewMode}`}>
      <div
        onClick={() => onViewDetail(product.id)}
        className="product-image-wrapper"
      >
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
        <div>{product.name}</div>
        <div className="product-pricing">
          <div className="price-main">{formatCurrency(product.price)}</div>
        </div>

        {product.is_active && (
          <div className="quantity-controls">
            <div className="quantity-selector">
              <button
                className="quantity-btn"
                onClick={() => onQuantityChange(product.id, -1)}
                disabled={currentQuantity <= 0}
              >
                -
              </button>
              <input
                type="number"
                className="quantity-input"
                value={currentQuantity}
                onChange={(e) =>
                  onQuantityChange(product.id, e.target.value)
                }
                min="1"
                max={product.stock}
              />
              <button
                className="quantity-btn"
                onClick={() => onQuantityChange(product.id, 1)}
                disabled={currentQuantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="product-actions">
          <button
            className={`add-to-cart-btn${!product.is_active ? 'disabled' : ''}`}
            onClick={() => onAddToCart(product)}
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
            ) : (isInCart && (mapCart[product.id].quantity != currentQuantity) ) ? (
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
          {isInCart && <button className='remove-btn'>Remove</button>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;