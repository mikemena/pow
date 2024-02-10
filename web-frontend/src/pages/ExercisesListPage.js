import React, { useState, useEffect } from 'react';
import Exercise from '../components/Exercise/Exercise';
import SearchBar from '../components/SearchBar/SearchBar';
import ExerciseFilters from '../components/ExerciseFilters/ExerciseFilters';
import './ExercisesList.css';

const ExercisesListPage = () => {
  const [exercises, setExercises] = useState(null);

  useEffect(() => {
    fetch('http://localhost:9025/api/exercise-catalog')
      .then(response => response.json())
      .then(data => {
        setExercises(data);
        console.log(data);
      })
      .catch(error => console.error('Failed to fetch exercises:', error));
  }, []);

  if (!exercises) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className='page_title'>Exercises</h1>
      <SearchBar />
      <ExerciseFilters />
      <div>
        {exercises.map(exercise => (
          <Exercise
            key={exercise.id}
            name={exercise.name}
            muscle={exercise.muscle}
            equipment={exercise.equipment}
            image={`http://localhost:9025/${exercise.file_path}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ExercisesListPage;
