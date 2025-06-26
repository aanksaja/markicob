import React, { useState } from 'react';
import './SearchForm.css'; // Pastikan path benar

const SearchForm = ({ onSearch, initialValue = '', resetOnSearch = false }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(inputValue);
    if (resetOnSearch) setInputValue('');
  };

  const handleReset = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
        className="search-input"
        placeholder="Cari produk..."
      />
      {/* <button type="submit" className="search-button">
        Cari
      </button>
      {inputValue && (
        <button
          type="button"
          onClick={handleReset}
          className="search-button reset-button"
        >
          Reset
        </button>
      )} */}
    </form>
  );
};

export default SearchForm;
