import React, { useState, useMemo, useContext, useEffect } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import { actionTypes } from '../../actions/actionTypes';
import NavBar from '../../components/Nav/Nav';
import { useNavigate } from 'react-router-dom';
import { BsChevronCompactLeft } from 'react-icons/bs';
import { useTheme } from '../../contexts/themeContext';
import ExerciseSearch from '../../components/Exercise/Search';
import Exercise from '../../components/Exercise/Exercise';
import useFetchData from '../../hooks/useFetchData';
import './select-exercises.css';

const SelectExercisesPage = () => {
  const { state, dispatch } = useContext(ProgramContext);
  const navigate = useNavigate();
  const { theme } = useTheme();
  // const location = useLocation();

  // Get the active workout ID from context state
  const activeWorkoutId = state.workout.activeWorkout;

  const activeWorkout = state.workout.workouts.find(
    workout => workout.id === activeWorkoutId
  );

  // Local state to manage exercises
  const [localExercises, setLocalExercises] = useState(
    activeWorkout ? [...activeWorkout.exercises] : []
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');

  useEffect(() => {
    if (activeWorkout) {
      // Initialize local state when the component mounts
      setLocalExercises([...activeWorkout.exercises]);
    }
  }, [activeWorkout]);

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

  const handleToggleExercise = exercise => {
    const exerciseExists = localExercises.some(ex => ex.id === exercise.id);

    if (exerciseExists) {
      // Remove the exercise from local state if it exists
      setLocalExercises(localExercises.filter(ex => ex.id !== exercise.id));
    } else {
      // Add the exercise to local state if it doesn't exist
      setLocalExercises([...localExercises, exercise]);
    }
  };

  const handleSaveExercises = () => {
    if (!activeWorkoutId) {
      alert('No active workout selected.');
      return;
    }

    dispatch({
      type: actionTypes.ADD_EXERCISE,
      payload: {
        workoutId: activeWorkoutId,
        exercises: localExercises
      }
    });

    navigate('/create-program'); // Navigate back after saving
  };

  const handleBack = () => {
    // Simply navigate back without saving changes
    navigate('/create-program');
  };

  const exerciseText = () => {
    const count = localExercises.length;
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
          <button className='select-exercise__back-btn' onClick={handleBack}>
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
                {exerciseText()}
              </span>
            </div>
          </div>
          <button
            onClick={handleSaveExercises}
            className='select-exercise__add-exercise-btn'
          >
            Save
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
            const isSelected = localExercises.some(ex => ex.id === exercise.id);
            return (
              <Exercise
                key={exercise.id}
                name={exercise.name}
                muscle={exercise.muscle}
                equipment={exercise.equipment}
                image={`http://localhost:9025/${exercise.file_path}`}
                isSelected={isSelected}
                onClick={() => handleToggleExercise(exercise)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectExercisesPage;
