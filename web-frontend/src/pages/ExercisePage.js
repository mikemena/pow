// src/pages/ExercisesPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ExercisesPage = () => {
  const { muscle } = useParams();
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    // Fetch exercises for the selected muscle group
    // Replace 'fetchExercises' with the actual API call
    const fetchExercises = async () => {
      const response = await fetch(`/api/exercises/${muscle}`);
      const data = await response.json();
      setExercises(data);
    };

    fetchExercises();
  }, [muscle]);

  return (
    <div>
      <h1>Exercises for {muscle}</h1>
      <ul>
        {exercises.map(exercise => (
          <li key={exercise.id}>
            {exercise.name}
            {/* Render additional exercise details */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExercisesPage;
