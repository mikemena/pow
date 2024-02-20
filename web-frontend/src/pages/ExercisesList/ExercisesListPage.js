import React, { useState, useMemo } from 'react';
import ExerciseSearch from '../../components/SearchBar/SearchBar';
import Exercise from '../../components/Exercise/Exercise';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ExerciseFilters from '../../components/ExerciseFilters/ExerciseFilters';
import useFetchData from '../../hooks/useFetchData';

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

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error loading exercises: {error}</div>;

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Exercises</h1>
      <ExerciseSearch onChange={handleSearch} exercises={exercises} />
      <ExerciseFilters
        onMuscleChange={handleMuscleChange}
        onEquipmentChange={handleEquipmentChange}
      />
      <Stack direction='column' spacing={2}>
        {filteredExercises.map(exercise => (
          <Exercise
            key={exercise.exercise_id}
            name={exercise.name}
            muscle={exercise.muscle}
            equipment={exercise.equipment}
            image={`http://localhost:9025/${exercise.file_path}`}
            onClick={() => console.log('Exercise clicked:', exercise.name)}
          />
        ))}
      </Stack>
    </div>
  );
};

export default ExercisesListPage;
