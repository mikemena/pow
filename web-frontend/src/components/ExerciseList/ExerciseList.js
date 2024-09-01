import React, { useState, useMemo, useContext } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import ExerciseSearch from '../SearchBar/SearchBar';
import Exercise from '../Exercise/Exercise';
import ExerciseFilters from '../ExerciseFilters/ExerciseFilters';
import useFetchData from '../../hooks/useFetchData';
import { useTheme } from '../../contexts/themeContext';
import './exerciseList.css';

const searchStyle = {
  width: '550px',
  padding: '10px',
  borderRadius: '5px'
};

const ExerciseList = ({
  selectedExercises,
  onSelectExercise,
  activeWorkout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const { addExercise } = useContext(ProgramContext);

  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');

  const { theme } = useTheme();

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

  const handleAddExercise = exercise => {
    console.log('adding exercise', exercise);
    if (activeWorkout) {
      addExercise(activeWorkout, exercise);
    }
  };

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>Error loading exercises: {error}</div>;

  return (
    <div className={`exercise-tile ${theme}`}>
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
        {filteredExercises
          .filter(
            exercise =>
              !selectedExercises.some(e => e.exerciseCatalogId === exercise.id)
          )
          .map(exercise => {
            const isSelected = selectedExercises.some(
              e => e.exerciseCatalogId === exercise.id
            );
            return (
              <Exercise
                key={exercise.id}
                name={exercise.name}
                muscle={exercise.muscle}
                equipment={exercise.equipment}
                image={`http://localhost:9025/${exercise.file_path}`}
                isSelected={isSelected}
                onClick={() => handleAddExercise(exercise)}
              />
            );
          })}
      </div>
    </div>
  );
};

export default ExerciseList;
