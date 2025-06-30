import React from 'react';
import ProductCard from './ProductCard';

const ProductsGrid = ({ 
  products, 
  viewMode, 
  productQuantities, 
  carts, 
  onQuantityChange, 
  onAddToCart, 
  onViewDetail 
}) => {
  return (
    <div className={`products-grid ${viewMode}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          viewMode={viewMode}
          currentQuantity={productQuantities[product.id] || 0}
          isInCart={carts.some((item) => item.item_id === product.id)}
          onQuantityChange={onQuantityChange}
          onAddToCart={onAddToCart}
          onViewDetail={onViewDetail}
          carts={carts}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;