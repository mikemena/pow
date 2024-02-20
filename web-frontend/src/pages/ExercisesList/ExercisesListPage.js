import React, { useState, useMemo } from 'react';
import ExerciseSearch from '../../components/SearchBar/SearchBar';
import ExerciseList from '../../components/ExerciseList/ExerciseList';
import ExerciseFilters from '../../components/ExerciseFilters/ExerciseFilters';
import useFetchData from '../../hooks/useFetchData';
import './ExercisesListPage.css';

const ExercisesListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');

  const filteredExercises = useMemo(() => {
    console.log('Current Search Term: ', searchTerm); // Debugging line
    return exercises.filter(exercise => {
      const matchesMuscle =
        !selectedMuscle ||
        selectedMuscle === 'All' ||
        exercise.muscle === selectedMuscle;
      const matchesEquipment =
        !selectedEquipment ||
        selectedEquipment === 'All' ||
        exercise.equipment === selectedEquipment;
      const matchesSearchTerm =
        !searchTerm ||
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesMuscle && matchesEquipment && matchesSearchTerm;
    });
  }, [searchTerm, selectedMuscle, selectedEquipment, exercises]);

  const handleSearch = newValue => {
    setSearchTerm(newValue);
  };

  const handleMuscleChange = value => {
    setSelectedMuscle(value);
  };

  const handleEquipmentChange = value => {
    setSelectedEquipment(value);
  };

  const onSelect = exercise => {
    // Handle exercise selection logic here
  };

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Exercises</h1>
      <ExerciseSearch onChange={handleSearch} exercises={exercises} />
      <ExerciseFilters
        onMuscleChange={handleMuscleChange}
        onEquipmentChange={handleEquipmentChange}
      />
      <ExerciseList
        exercises={filteredExercises}
        isLoading={isLoading}
        onSelect={onSelect}
        onError={error}
      />
    </div>
  );
};

export default ExercisesListPage;
