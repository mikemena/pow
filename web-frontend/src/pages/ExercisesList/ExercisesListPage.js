import React, { useState, useEffect } from 'react';
import SearchBar from '../../components/SearchBar/SearchBar';
import ExerciseList from '../../components/ExerciseList/ExerciseList';
import ExerciseFilters from '../../components/ExerciseFilters/ExerciseFilters';
import './ExercisesListPage.css';

const ExercisesListPage = () => {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);

  useEffect(() => {
    const filterExercises = () => {
      let filtered = exercises;
      if (selectedMuscle && selectedMuscle !== 'All') {
        filtered = filtered.filter(
          exercise => exercise.muscle === selectedMuscle
        );
      }
      if (selectedEquipment && selectedEquipment !== 'All') {
        filtered = filtered.filter(
          exercise => exercise.equipment === selectedEquipment
        );
      }
      if (searchTerm) {
        filtered = filtered.filter(exercise =>
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredExercises(filtered);
    };
    filterExercises();
  }, [searchTerm, selectedMuscle, selectedEquipment, exercises]);

  const handleSearch = value => {
    setSearchTerm(value);
  };

  const handleMuscleChange = value => {
    setSelectedMuscle(value);
  };

  const handleEquipmentChange = value => {
    setSelectedEquipment(value);
  };

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Exercises</h1>
      <SearchBar onChange={handleSearch} />
      <ExerciseFilters
        onMuscleChange={handleMuscleChange}
        onEquipmentChange={handleEquipmentChange}
      />
      <ExerciseList
        searchTerm={searchTerm}
        selectedMuscle={selectedMuscle}
        selectedEquipment={selectedEquipment}
      />
    </div>
  );
};

export default ExercisesListPage;
