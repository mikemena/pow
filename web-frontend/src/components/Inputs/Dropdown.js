import React, { useState } from 'react';
import './Dropdown.css';

const Dropdown = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleSelectOption = option => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className='dropdown-container'>
      <div className='dropdown-header' onClick={() => setIsOpen(!isOpen)}>
        {selectedOption} <span className='dropdown-arrow'>&#9660;</span>
      </div>
      {isOpen && (
        <ul className='dropdown-list'>
          {options.map((option, index) => (
            <li
              key={index}
              className='dropdown-item'
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
