import React from 'react';
import ExerciseSearch from '../../components/SearchBar/SearchBar';
import Exercise from '../../components/Exercise/Exercise';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import ExerciseFilters from '../../components/ExerciseFilters/ExerciseFilters';
import useFetchData from '../../hooks/useFetchData';
import './ExercisesListPage.css';

const ExercisesListPage = () => {
  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error loading exercises: {error}</div>;

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Exercises</h1>
      <ExerciseSearch exercises={exercises} />
      <ExerciseFilters />
      <Stack direction='column' spacing={2}>
        {exercises.map(exercise => (
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
