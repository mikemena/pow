import React, { useState } from 'react';
import FilterDropdown from '../FilterDropdown/FilterDropdown';

function ExerciseFilters() {
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedMuscle, setSelectedMuscle] = useState('All');

  const handleEquipmentSelect = selectedEquipment => {
    setSelectedEquipment(selectedEquipment);
  };

  const handleMuscleSelect = selectedMuscle => {
    setSelectedMuscle(selectedMuscle);
  };

  return (
    <div className='exercise-filters'>
      <FilterDropdown
        fetchUrl='http://localhost:9025/api/equipments'
        defaultOption='Any Equipment'
        onSelect={handleEquipmentSelect}
        className='select-exercise-button'
        value={selectedEquipment}
      />
      <FilterDropdown
        fetchUrl='http://localhost:9025/api/muscles'
        defaultOption='Any Muscle'
        onSelect={handleMuscleSelect}
        className='select-exercise-button'
        value={selectedMuscle}
      />
      {/* ... other filters */}
    </div>
  );
}

export default ExerciseFilters;
