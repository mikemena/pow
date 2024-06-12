import React, { useState, useMemo, useContext, useEffect } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import NavBar from '../../components/Nav/Nav';
import { useNavigate } from 'react-router-dom';
import { BsChevronCompactLeft } from 'react-icons/bs';
import { useTheme } from '../../contexts/themeContext';
import ExerciseSearch from '../../components/Exercise/Search';
import Exercise from '../../components/Exercise/Exercise';
import useFetchData from '../../hooks/useFetchData';
import './select-exercises.css';

const SelectExercisesPage = () => {
  const { state, addExercise, activeWorkout } = useContext(ProgramContext);
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
    if (activeWorkout && state.exercises[activeWorkout]) {
      setSelectedExercises(state.exercises[activeWorkout]);
    }
  }, [activeWorkout, state.exercises]);

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

  const toggleExerciseSelection = exercise => {
    console.log('Toggling exercise selection:', exercise);
    setSelectedExercises(prevSelected => {
      const isSelected = prevSelected.some(ex => ex.id === exercise.id);
      if (isSelected) {
        return prevSelected.filter(ex => ex.id !== exercise.id);
      } else {
        return [...prevSelected, exercise];
      }
    });
  };

  const handleAddExercises = () => {
    console.log('Adding exercises:', selectedExercises);
    if (selectedExercises.length === 0) {
      alert('No exercises selected to add.');
      return;
    }

    if (!activeWorkout) {
      alert('No active workout selected.');
      return;
    }

    addExercise(activeWorkout, selectedExercises);
    //setSelectedExercises([]); // Clear selected exercises
    navigate('/create-program');
  };

  const goBack = () => {
    //setSelectedExercises([]); // Clear selection
    navigate('/create-program');
  };

  const exerciseText = selectedExercises => {
    const count = selectedExercises?.length ?? 0;
    return count === 0
      ? 'No Exercises '
      : count === 1
      ? '1 Exercise '
      : `${count} Exercises `;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading exercises: {error.message}</div>;

  return (
    <div className='select-exercise-page'>
      <NavBar isEditing='true' />
      <div className='select-exercise'>
        <div className={`select-exercise__header ${theme}`}>
          <button className='select-exercise__back-btn' onClick={goBack}>
            <BsChevronCompactLeft
              className={`select-exercise__icon ${theme}`}
              size={30}
            />
          </button>
          <div className='select-exercise__title-container'>
            <h1 className={`select-exercise__title ${theme}`}>
              {`Adding exercises for ${
                activeWorkout?.name || 'your selected workout'
              }`}
            </h1>
            <div className='select-exercise__subtitle'>
              <span className={`select-exercise__count ${theme}`}>
                {exerciseText(selectedExercises)}
              </span>
            </div>
          </div>
          <button
            onClick={handleAddExercises}
            className='select-exercise__add-exercise-btn'
          >
            Addx
          </button>
        </div>
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
            const isSelected = selectedExercises.some(
              ex => ex.id === exercise.id
            );
            return (
              <Exercise
                key={exercise.id}
                name={exercise.name}
                muscle={exercise.muscle}
                equipment={exercise.equipment}
                image={`http://localhost:9025/${exercise.file_path}`}
                isSelected={isSelected}
                onClick={() => toggleExerciseSelection(exercise)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectExercisesPage;
