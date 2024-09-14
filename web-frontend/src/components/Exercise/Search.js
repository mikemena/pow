import React, { useState } from 'react';
import TextInput from '../Inputs/TextInput';
import useFetchData from '../../hooks/useFetchData';
import { useTheme } from '../../contexts/themeContext';
import './Search.css';

function ExerciseFilters({
  exercises = [],
  onSearchTextChange,
  onMuscleChange,
  onEquipmentChange
}) {
  const [inputValue, setInputValue] = useState('');

  const { theme } = useTheme();

  const handleInputChange = event => {
    const newValue = event.target.value;
    setInputValue(newValue);
    onSearchTextChange(newValue);
  };

  const {
    data: muscles,
    isLoading: isLoadingMuscles,
    error: errorMuscles
  } = useFetchData('http://localhost:9025/api/muscles');
  console.log(muscles);

  const {
    data: equipments,
    isLoading: isLoadingEquipments,
    error: errorEquipments
  } = useFetchData('http://localhost:9025/api/equipments');

  // Loading indicator or error message for equipments
  if (isLoadingEquipments) return <div>loading...</div>;
  if (errorEquipments)
    return <div>Error loading equipments: {errorEquipments}</div>;

  // Loading indicator or error message for muscles
  if (isLoadingMuscles) return <div>loading...</div>;
  if (errorMuscles) return <div>Error loading equipments: {errorMuscles}</div>;

  return (
    <div className={`exercise-search ${theme}`}>
      <div className='exercise-search__search-input-container'>
        <TextInput
          list='exercises'
          className={`exercise-search__search-text-input ${theme}`}
          id='exercise-search-bar'
          onChange={handleInputChange}
          value={inputValue}
          type='search'
          placeholder='Exercise Names'
        />
        <datalist id='exercises'>
          {exercises.map((exercise, index) => (
            <option key={index} value={exercise.name} />
          ))}
        </datalist>
      </div>

      <div className='exercise-search__search-input-container'>
        <input
          list='muscles'
          className={`exercise-search__muscle ${theme}`}
          type='search'
          onChange={event => onMuscleChange(event.target.value)}
          placeholder='Muscles'
        />
        <datalist id='muscles'>
          {muscles.map((option, index) => (
            <option key={index} value={option.muscle} />
          ))}
        </datalist>
      </div>

      <div className='exercise-search__search-input-container'>
        <input
          list='equipments'
          className={`exercise-search__equipment ${theme}`}
          type='search'
          onChange={event => onEquipmentChange(event.target.value)}
          placeholder='Equipment'
        />
        <datalist id='equipments'>
          {equipments.map((option, index) => (
            <option key={index} value={option.name} />
          ))}
        </datalist>
      </div>
    </div>
  );
}

export default ExerciseFilters;
