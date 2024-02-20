import React, { useState } from 'react';

export default function ExerciseSearch({ exercises = [], onChange }) {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = event => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onChange(newValue); // Call the provided onChange function with the new value
  };
  return (
    <div className='search-bar-container'>
      <input
        list='exercises'
        id='exercise-search'
        onChange={handleInputChange}
        value={inputValue}
        type='search'
        placeholder='Search Exercise Names'
      />
      <datalist id='exercises'>
        {exercises.map((exercise, index) => (
          <option key={index} value={exercise.name} />
        ))}
      </datalist>
    </div>
  );
}
