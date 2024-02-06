import React from 'react';
import './Dropdown.css';

function Dropdown({ options, selectedOption, onOptionSelect }) {
  return (
    <div className='dropdown'>
      <ul className='dropdown-list'>
        {options.map((option, index) => (
          <li
            key={index}
            className={`dropdown-item ${
              selectedOption === option ? 'selected' : ''
            }`}
            onClick={() => onOptionSelect(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dropdown;
