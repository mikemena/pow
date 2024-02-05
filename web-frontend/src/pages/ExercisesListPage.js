// src/pages/ExercisesListPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';

const ExercisesListPage = () => {
  const [exercises, setExercises] = useState([]);
  const location = useLocation();
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');

  // Effect to fetch exercises when the component mounts or when filters change
  useEffect(() => {
    // Check if a muscle was passed in the location state
    const muscle = location.state?.selectedMuscle;
    setSelectedMuscle(muscle);

    const fetchExercises = async () => {
      try {
        // Make an API call to fetch exercises for the selected muscle
        // If no muscle is selected, fetch all exercises or handle accordingly
        const response = await fetch(
          `http://localhost:9025/api/exercises/muscles/${muscle}`
        );
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
      }
    };

    if (muscle) {
      fetchExercises();
    }
  }, [location.state]);

  const handleSearch = query => {
    setSearchQuery(query);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
};

export default ExercisesListPage;
