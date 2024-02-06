import React from 'react';
import FilterDropdown from '../FilterDropdown/FilterDropdown';

function ExerciseFilters() {
  // State for the selected muscle and equipment could be managed here or higher up
  // if needed across multiple components.

  const handleEquipmentSelect = selectedEquipment => {
    // Handle selection logic for equipment
  };

  const handleMuscleSelect = selectedMuscle => {
    // Handle selection logic for muscle
  };

  return (
    <div className='exercise-filters'>
      <FilterDropdown
        fetchUrl='http://localhost:9025/api/equipments'
        defaultOption='Any Equipment'
        onSelect={handleEquipmentSelect}
        className='select-button'
      />
      <FilterDropdown
        fetchUrl='http://localhost:9025/api/muscles'
        defaultOption='Any Muscle'
        onSelect={handleMuscleSelect}
        className='select-button'
      />
      {/* ... other filters */}
    </div>
  );
}

export default ExerciseFilters;
