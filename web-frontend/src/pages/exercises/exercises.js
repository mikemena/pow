import React, { useState, useMemo } from 'react';
import NavBar from '../../components/Nav/Nav';
import ExerciseSearch from '../../components/Exercise/Search';
import Exercise from '../../components/Exercise/Exercise';
import useFetchData from '../../hooks/useFetchData';
import './exercises.css';

const ExercisesListPage = () => {
  const [localExercises, setLocalExercises] = useState([]);
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

  const handleSearch = newValue => setSearchTerm(newValue);
  const handleMuscleChange = value => setSelectedMuscle(value);
  const handleEquipmentChange = value => setSelectedEquipment(value);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading exercises: {error.message}</div>;

  return (
    <div className='select-exercise-page'>
      <NavBar isEditing='true' />
      <div className='select-exercise'>
        <div className='select-exercise__filters'>
          <ExerciseSearch
            onSearchTextChange={handleSearch}
            exercises={exercises}
            onMuscleChange={handleMuscleChange}
            onEquipmentChange={handleEquipmentChange}
          />
        </div>
        <div className='select-exercise__exercises'>
          {filteredExercises.map(exercise => {
            const isSelected = localExercises.some(
              ex => ex.catalog_exercise_id === exercise.id
            );
            return (
              <Exercise
                key={exercise.id}
                name={exercise.name}
                muscle={exercise.muscle}
                equipment={exercise.equipment}
                image={`http://localhost:9025/${exercise.file_path}`}
                isSelected={isSelected}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExercisesListPage;
