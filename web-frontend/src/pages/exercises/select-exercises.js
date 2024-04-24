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
    // Initialize with exercises that are already part of the workout
    if (activeWorkout && activeWorkout.exercises) {
      const selectedIds = new Set(
        activeWorkout.exercises.map(ex => ex.exerciseCatalogId)
      );
      console.log('selectedIds', selectedIds);
      setSelectedExercises(
        exercises.filter(ex => selectedIds.has(ex.exerciseCatalogId))
      );
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
    console.log('toggleExerciseSelection', exercise);
    setSelectedExercises(prevSelected => {
      console.log('prevSelected', prevSelected);
      const isSelected = prevSelected.some(
        ex => ex.exerciseCatalogId === exercise.id
      );
      if (isSelected) {
        return prevSelected.filter(ex => ex.exerciseCatalogId !== exercise.id);
      } else {
        return [...prevSelected, exercise];
      }
    });
  };

  const handleAddExercises = () => {
    if (selectedExercises.length === 0) {
      alert('No exercises selected to add.');
      return;
    }

    selectedExercises.forEach(exercise => {
      if (exercise && exercise.id) {
        // Ensure necessary identifiers are present

        addExercise(activeWorkout.id, exercise);
      } else {
      }
    });

    // Assuming addExercise processes synchronously; otherwise handle asynchronously
    navigate('/create-program'); // Navigate after all exercises have been added
  };

  const goBack = () => {
    navigate('/create-program');
  };

  const exerciseText = selectedExercises => {
    const count = selectedExercises?.length ?? 0;

    if (count === 0) {
      return 'No Exercises ';
    } else if (count === 1) {
      return '1 Exercise ';
    } else {
      return `${count} Exercises `;
    }
  };

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
                activeWorkout.name
                  ? activeWorkout.name
                  : 'your selected workout'
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
            Add
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
            return (
              <Exercise
                key={exercise.index}
                name={exercise.name}
                muscle={exercise.muscle}
                equipment={exercise.equipment}
                image={`http://localhost:9025/${exercise.file_path}`}
                isSelected={
                  selectedExercises.some(
                    ex => ex.exerciseCatalogId === exercise.exerciseCatalogId
                  ) ||
                  activeWorkout.exercises.some(
                    e => e.exerciseCatalogId === exercise.exerciseCatalogId
                  )
                }
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
