// SearchBar.js
import React from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  return (
    <div className='search-bar'>
      <input
        type='text'
        placeholder='Search'
        onChange={e => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
