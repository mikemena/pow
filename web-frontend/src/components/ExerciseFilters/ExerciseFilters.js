import React from 'react';
import FilterDropdown from '../FilterDropdown/FilterDropdown';

function ExerciseFilters({ onMuscleChange, onEquipmentChange }) {
  return (
    <div className='exercise-filters'>
      <FilterDropdown
        fetchUrl='http://localhost:9025/api/equipments'
        defaultOption='Any Equipment'
        onSelect={onEquipmentChange}
        className='select-exercise-button'
      />
      <FilterDropdown
        fetchUrl='http://localhost:9025/api/muscles'
        defaultOption='Any Muscle'
        onSelect={onMuscleChange}
        className='select-exercise-button'
      />
      {/* ... other filters */}
    </div>
  );
}

export default ExerciseFilters;
