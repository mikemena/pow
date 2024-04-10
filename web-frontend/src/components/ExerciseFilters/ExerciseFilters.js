import React from 'react';
import useFetchData from '../../hooks/useFetchData';
import { useTheme } from '../../contexts/themeContext';
import './ExerciseFilters.css';

function ExerciseFilters({ onMuscleChange, onEquipmentChange }) {
  const { theme } = useTheme();

  const {
    data: muscles,
    isLoading: isLoadingMuscles,
    error: errorMuscles
  } = useFetchData('http://localhost:9025/api/muscles');

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
    <div className='exercise-search-container'>
      <div className='exercise-search-container__filter-container'>
        <input
          list='muscles'
          className={`muscle-search ${theme}`}
          type='search'
          onChange={event => onMuscleChange(event.target.value)}
          placeholder='Search Muscles'
        />
        <datalist id='muscles'>
          {muscles.map((option, index) => (
            <option key={index} value={option.name} />
          ))}
        </datalist>
      </div>

      <div className='exercise-search-container'>
        <input
          list='equipments'
          className={`equipment-search ${theme}`}
          type='search'
          onChange={event => onEquipmentChange(event.target.value)}
          placeholder='Search Equipment'
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
