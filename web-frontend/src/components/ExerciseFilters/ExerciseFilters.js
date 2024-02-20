import React from 'react';
import useFetchData from '../../hooks/useFetchData';
import './ExerciseFilters.css';

function ExerciseFilters({ onMuscleChange, onEquipmentChange }) {
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
    <div className='exercise-filters-container'>
      <div className='exercise-filter'>
        {/* <label htmlFor='muscle-search'>Muscle</label> */}
        <input
          list='muscles'
          id='muscle-search'
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

      <div className='exercise-filter'>
        {/* <label htmlFor='equipment-search'>Equipment</label> */}
        <input
          list='equipments'
          id='equipment-search'
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
