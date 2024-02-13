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

  // Generate a unique ID for the dropdown to link the label and div
  const dropdownId = `dropdown-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className='dropdown-container'>
      {label && (
        <label htmlFor={dropdownId} className='dropdown-label'>
          {label}
        </label>
      )}
      <div
        className='dropdown-header'
        id={dropdownId}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex='0' // Make the div focusable
        role='button' // ARIA role for better accessibility
        aria-haspopup='listbox' // Indicates that the button has a popup listbox
        aria-expanded={isOpen} // Indicates if the listbox is currently expanded
      >
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
