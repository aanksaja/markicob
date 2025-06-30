import React from 'react';

const FiltersSidebar = ({
  categories,
  selectedCategory,
  priceRange,
  selectedPriceRange,
  ratingFilter,
  inStockOnly,
  onCategoryChange,
  onPriceRangeChange,
  onRatingFilterChange,
  onStockFilterChange,
  onClearFilters,
  filtersOpen,
  onCloseFilters,
  formatCurrency
}) => {
  return (
    <div className={`filters-sidebar ${filtersOpen ? 'open' : ''}`}>
      <div className="filters-header">
        <h3>Filters</h3>
        <button className="close-filters" onClick={onCloseFilters}>
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
                  onChange={() => onCategoryChange(category)}
                />
                <span className="checkmark"></span>
                {category}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h4 className="filter-title">Price Range</h4>
          <div className="price-range-filter">
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={selectedPriceRange[0]}
                onChange={(e) =>
                  onPriceRangeChange([
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
                  onPriceRangeChange([
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

        <div className="filter-group">
          <h4 className="filter-title">Minimum Rating</h4>
          <div className="rating-filter">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="filter-option">
                <input
                  type="radio"
                  name="rating"
                  checked={ratingFilter === rating}
                  onChange={() => onRatingFilterChange(rating)}
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

        <div className="filter-group">
          <h4 className="filter-title">Availability</h4>
          <label className="filter-option">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onStockFilterChange(e.target.checked)}
            />
            <span className="checkmark"></span>
            In Stock Only
          </label>
        </div>
      </div>
    </div>
  );
};

export default FiltersSidebar;