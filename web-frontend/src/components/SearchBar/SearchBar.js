import React from 'react';
import './SearchBar.css';

const SearchBar = ({ onChange }) => {
  return (
    <div className='search-bar'>
      <input
        type='text'
        placeholder='Search'
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
