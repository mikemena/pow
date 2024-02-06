import React, { useState, useEffect } from 'react';
import Dropdown from '../Dropdown/Dropdown';
import '../ExerciseFilters/ExerciseFilters.css';

function FilterDropdown({ fetchUrl, defaultOption, onSelect, className }) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(defaultOption);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        // Make sure you are setting an array of strings into the options state.
        const optionNames = data.map((item, index) => {
          // Assuming each item is an object with a 'name' field.
          return item.name;
        });
        setOptions(optionNames);
      })
      .catch(error =>
        console.error(`Failed to fetch ${defaultOption.toLowerCase()}:`, error)
      );
  }, [fetchUrl, defaultOption]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = optionName => {
    const selected = options.find(option => option === optionName);
    setSelectedOption(selected);
    setIsOpen(false); // Close the dropdown
    onSelect(selected); // Parent handler
  };

  const buttonClass =
    selectedOption === defaultOption ? 'button-grey' : 'button-orange';

  return (
    <div>
      <button
        onClick={toggleDropdown}
        className={`${className} ${buttonClass}`}
      >
        {selectedOption}
      </button>
      {isOpen && (
        <Dropdown
          options={options}
          selectedOption={selectedOption}
          onOptionSelect={handleSelect}
        />
      )}
    </div>
  );
}

export default FilterDropdown;
