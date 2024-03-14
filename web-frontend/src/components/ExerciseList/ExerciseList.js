import React, { useState, useMemo } from 'react';
import ExerciseSearch from '../SearchBar/SearchBar';
import Exercise from '../Exercise/Exercise';
import ExerciseFilters from '../ExerciseFilters/ExerciseFilters';
import useFetchData from '../../hooks/useFetchData';
import './exerciseList.css';

const searchStyle = {
  width: '550px',
  padding: '10px',
  borderRadius: '5px'
};

const ExerciseList = ({ isDraggable }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');

  const filteredExercises = useMemo(() => {
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

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>Error loading exercises: {error}</div>;

  return (
    <div id='exercise-container'>
      <ExerciseSearch
        style={searchStyle}
        onChange={handleSearch}
        exercises={exercises}
      />
      <ExerciseFilters
        className='exercise-container__filters'
        onMuscleChange={handleMuscleChange}
        onEquipmentChange={handleEquipmentChange}
      />
      <div className='exercise-container__exercise-list'>
        {filteredExercises.map(exercise => (
          <Exercise
            key={exercise.exercise_id}
            name={exercise.name}
            muscle={exercise.muscle}
            equipment={exercise.equipment}
            image={`http://localhost:9025/${exercise.file_path}`}
            isSelectable={false} // Make the exercise selectable in this context
            onClick={() => console.log('Exercise clicked:', exercise.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExerciseList;
