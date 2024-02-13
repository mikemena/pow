import React from 'react';
import Dropdown from '../../components/Inputs/Dropdown';

function ExerciseFilters({ onMuscleChange, onEquipmentChange }) {
  return (
    <div className='exercise-filters'>
      <Dropdown
        label='Equipment'
        fetchUrl='http://localhost:9025/api/equipments'
        defaultOption='Any Equipment'
        onSelect={onEquipmentChange}
      />
      <Dropdown
        label='Muscle'
        fetchUrl='http://localhost:9025/api/muscles'
        defaultOption='Any Muscle'
        onSelect={onMuscleChange}
      />
    </div>
  );
}

export default ExerciseFilters;
