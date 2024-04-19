import React, { useState, useMemo, useContext, useEffect } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import NavBar from '../../components/Nav/Nav';
import { useNavigate } from 'react-router-dom';
import { BsChevronCompactLeft } from 'react-icons/bs';
import { useTheme } from '../../contexts/themeContext';
import ExerciseSearch from '../../components/SearchBar/SearchBar';
import Exercise from '../../components/Exercise/Exercise';
import ExerciseFilters from '../../components/ExerciseFilters/ExerciseFilters';
import useFetchData from '../../hooks/useFetchData';
import './select-exercises.css';

const SelectExercisesPage = () => {
  const { addExercise, activeWorkout } = useContext(ProgramContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedExercises, setSelectedExercises] = useState([]);

  const navigate = useNavigate();

  const { theme } = useTheme();

  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');

  useEffect(() => {
    if (activeWorkout) {
      const selectedIds = new Set(
        (activeWorkout.exercises || []).map(ex => ex.id)
      );
      setSelectedExercises(exercises.filter(ex => selectedIds.has(ex.id)));
    }
  }, [activeWorkout, exercises]);

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

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>Error loading exercises: {error}</div>;

  const toggleExerciseSelection = exercise => {
    setSelectedExercises(prevSelected => {
      const isAlreadySelected = prevSelected.find(ex => ex.id === exercise.id);
      if (isAlreadySelected) {
        return prevSelected.filter(ex => ex.id !== exercise.id); // Remove if already selected
      } else {
        return [...prevSelected, exercise]; // Add if not already selected
      }
    });
  };

  const handleAddExercises = () => {
    console.log('Adding selected exercises:', selectedExercises);
    selectedExercises.forEach(exercise => {
      console.log('Adding:', exercise);
      addExercise(activeWorkout.id, exercise);
    });
    navigate('/create-program');
    console.log(
      'Updated active workout after adding exercises:',
      activeWorkout
    );
  };

  const goBack = () => {
    navigate('/create-program');
  };

  // console.log('Active Workout:', activeWorkout);

  return (
    <div className='select-exercise'>
      <NavBar isEditing='true' />
      <div className='select-exercise__header'>
        <button className='select-exercise__back-btn' onClick={goBack}>
          <BsChevronCompactLeft
            className={`workout__icon ${theme}`}
            size={30}
          />
        </button>
        <h1 className='create-prog-page__exercise-container-title'>
          {`Adding exercises for ${
            activeWorkout.name ? activeWorkout.name : 'your selected workout'
          }`}
        </h1>
        <button
          onClick={handleAddExercises}
          className='workout__add-exercise-btn'
        >
          Add
        </button>
      </div>

      <ExerciseSearch onChange={handleSearch} exercises={exercises} />
      <ExerciseFilters
        onMuscleChange={handleMuscleChange}
        onEquipmentChange={handleEquipmentChange}
      />
      <div className='exercise-container'>
        {filteredExercises.map(exercise => (
          <Exercise
            key={exercise.id}
            name={exercise.name}
            muscle={exercise.muscle}
            equipment={exercise.equipment}
            image={`http://localhost:9025/${exercise.file_path}`}
            isSelectable={false}
            onClick={() => toggleExerciseSelection(exercise)}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectExercisesPage;
