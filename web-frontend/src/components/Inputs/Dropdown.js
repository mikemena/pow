import React, { useState, useEffect } from 'react';
import './Dropdown.css';

const Dropdown = ({ label, options, fetchUrl, onSelect, defaultOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  useEffect(() => {
    if (!fetchUrl) return;

    // Fetch options from API
    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        const fetchedOptions = data.map(item => item.name); // Customize this as needed
        setDynamicOptions(fetchedOptions);
        if (!selectedOption || selectedOption === defaultOption) {
          setSelectedOption(
            fetchedOptions.length > 0 ? fetchedOptions[0] : defaultOption
          );
        }
      })
      .catch(error => console.error('Failed to fetch options:', error));
  }, [fetchUrl, defaultOption, selectedOption]);

  const handleSelectOption = option => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };
  // Use dynamicOptions if fetchUrl is provided, otherwise use static options
  const finalOptions = fetchUrl ? dynamicOptions : options;

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
          {finalOptions.map((option, index) => (
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
