import React from 'react';
import SearchForm from '../SearchForm';

const ProductsHeader = ({
  selectedCategory,
  searchQuery,
  onSearch,
  searchSuggestions,
  showSuggestions,
  onSearchInputChange,
}) => {
  return (
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
            <SearchForm onSearch={onSearch} />
            {searchQuery && (
              <button className="search-clear" onClick={() => onSearch('')}>
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
                  onClick={() => onSearch(suggestion.text)}
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
  );
};

export default ProductsHeader;
