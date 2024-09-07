import React, { useState, useMemo, useContext, useEffect } from 'react';
import { ProgramContext } from '../../contexts/programContext';
import { actionTypes } from '../../actions/actionTypes';
import NavBar from '../../components/Nav/Nav';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsChevronCompactLeft } from 'react-icons/bs';
import { useTheme } from '../../contexts/themeContext';
import ExerciseSearch from '../../components/Exercise/Search';
import Exercise from '../../components/Exercise/Exercise';
import useFetchData from '../../hooks/useFetchData';
import './select-exercises.css';

const SelectExercisesPage = () => {
  const { addExercise, state, dispatch } = useContext(ProgramContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const { isNewProgram, programId } = location.state;

  const activeWorkoutId = state.workout.activeWorkout;
  const activeWorkout = state.workout.workouts.find(
    workout => workout.id === activeWorkoutId
  );

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
    if (!activeWorkoutId && state.workout.workouts.length > 0) {
      const workoutIdToSet = state.workout.workouts[0].id;

      dispatch({
        type: actionTypes.SET_ACTIVE_WORKOUT,
        payload: { activeWorkout: workoutIdToSet }
      });
    }
  }, [activeWorkoutId, state.workout.workouts, dispatch]);

  useEffect(() => {
    if (activeWorkout) {
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
    const exerciseExists = localExercises.some(
      ex => ex.catalog_exercise_id === exercise.id
    );

    if (exerciseExists) {
      setLocalExercises(
        localExercises.filter(ex => ex.catalog_exercise_id !== exercise.id)
      );
    } else {
      setLocalExercises([
        ...localExercises,
        { ...exercise, catalog_exercise_id: exercise.id }
      ]);
    }
  };

  const handleSaveExercises = () => {
    if (!activeWorkoutId) {
      alert('No active workout selected.');

      return;
    }

    addExercise(activeWorkoutId, localExercises);

    if (isNewProgram) {
      navigate('/create-program');
    } else {
      navigate(`/programs/${programId}/edit`);
    }
  };

  const handleBack = () => {
    if (isNewProgram) {
      navigate('/create-program');
    } else navigate(`/programs/${programId}/edit`);
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
            const isSelected = localExercises.some(
              ex => ex.catalog_exercise_id === exercise.id
            );
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
