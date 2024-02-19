import React, { useState, useEffect } from 'react';
import Exercise from '../../components/Exercise/Exercise';
import Stack from '@mui/material/Stack';

const ExercisesList = ({ onSelect, selectedMuscle, selectedEquipment }) => {
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch exercises catalog
        const response = await fetch(
          'http://localhost:9025/api/exercise-catalog'
        );
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        setError(error.message);
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredExercises = exercises.filter(exercise => {
    return (
      (!selectedMuscle || exercise.muscle === selectedMuscle) &&
      (!selectedEquipment || exercise.equipment === selectedEquipment)
    );
  });

  if (isLoading) return <div>Loading exercises...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='page-layout'>
      <Stack direction='column' spacing={2}>
        {filteredExercises.map(exercise => (
          <Exercise
            key={exercise.exercise_id}
            name={exercise.name}
            muscle={exercise.muscle}
            equipment={exercise.equipment}
            image={`http://localhost:9025/${exercise.file_path}`}
            onSelect={onSelect}
          />
        ))}
      </Stack>
    </div>
  );
};

export default ExercisesList;
