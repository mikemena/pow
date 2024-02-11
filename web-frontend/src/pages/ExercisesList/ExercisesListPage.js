import React, { useState, useEffect } from 'react';
import Exercise from '../../components/Exercise/Exercise';
import SearchBar from '../../components/SearchBar/SearchBar';
import ExerciseFilters from '../../components/ExerciseFilters/ExerciseFilters';
import './ExercisesList.css';

const ExercisesListPage = () => {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:9025/api/exercise-catalog')
      .then(response => response.json())
      .then(data => {
        setExercises(data);
        setFilteredExercises(data);
        setIsLoading(false); // Finish loading after fetching exercises
        console.log(data);
      })
      .catch(error => {
        console.error('Failed to fetch exercises:', error);
        setIsLoading(false); // Finish loading even if there was an error
      });
  }, []);

  useEffect(() => {
    const filterExercises = () => {
      let filtered = exercises;
      if (selectedMuscle && selectedMuscle !== 'All') {
        filtered = filtered.filter(
          exercise => exercise.muscle === selectedMuscle
        );
      }
      if (selectedEquipment && selectedEquipment !== 'All') {
        filtered = filtered.filter(
          exercise => exercise.equipment === selectedEquipment
        );
      }
      if (searchTerm) {
        filtered = filtered.filter(exercise =>
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredExercises(filtered);
    };
    filterExercises();
  }, [searchTerm, selectedMuscle, selectedEquipment]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleSearch = value => {
    setSearchTerm(value);
  };

  const handleMuscleChange = value => {
    setSelectedMuscle(value);
  };

  const handleEquipmentChange = value => {
    setSelectedEquipment(value);
  };

  return (
    <div className='exercise-page'>
      <h1 className='page_title'>Exercises</h1>
      <SearchBar onChange={handleSearch} />
      <ExerciseFilters
        onMuscleChange={handleMuscleChange}
        onEquipmentChange={handleEquipmentChange}
      />
      <div>
        {filteredExercises.map(exercise => (
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
