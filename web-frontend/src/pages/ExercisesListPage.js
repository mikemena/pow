import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import ExerciseFilters from '../components/ExerciseFilters/ExerciseFilters';
import './ExercisesList.css';

const ExercisesListPage = () => {
  const [exercises, setExercises] = useState([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(''); // Add searchQuery state

  // Effect to fetch exercises when the component mounts or when filters change
  useEffect(() => {
    const muscle = location.state?.selectedMuscle;

    const fetchExercises = async () => {
      try {
        let apiUrl = `http://localhost:9025/api/exercises/muscles/${muscle}`;

        // Add searchQuery to the API URL if it's not empty
        if (searchQuery) {
          apiUrl += `?q=${searchQuery}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      }
    };

    if (muscle !== 'all') {
      fetchExercises();
    }
  }, [location.state, searchQuery]);

  const handleSearch = query => {
    setSearchQuery(query);
  };

  return (
    <div>
      <h1 className='page_title'>Exercises</h1>
      <SearchBar onSearch={handleSearch} />
      <ExerciseFilters />
      {/* Render the list of exercises based on the 'exercises' state */}
      <ul>
        {exercises.map(exercise => (
          <li key={exercise.id}>{exercise.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ExercisesListPage;
