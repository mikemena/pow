import React, { useState, useMemo } from 'react';
import { useWorkout } from '../../../contexts/workoutContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../../components/SearchBar/SearchBar';
import Exercise from '../../../components/Exercise/Exercise';
import ExerciseFilters from '../../../components/ExerciseFilters/ExerciseFilters';
import useFetchData from '../../../hooks/useFetchData';
import Nav from '../../../components/Nav/Nav';
import './template.css';

const CreateTemplate = () => {
  const { workout, setWorkout } = useWorkout();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const navigate = useNavigate();

  const {
    data: exercises,
    isLoading,
    error
  } = useFetchData('http://localhost:9025/api/exercise-catalog');

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

  const handleSearch = value => {
    setSearchTerm(value);
  };

  const handleMuscleChange = value => {
    setSelectedMuscle(value);
  };

  const handleEquipmentChange = value => {
    setSelectedEquipment(value);
  };

  const handlePlanTypeChange = selectedPlanType => {
    setWorkout(prevWorkout => ({ ...prevWorkout, planType: selectedPlanType }));
  };

  const handleDayTypeChange = selectedDayType => {
    setWorkout(prevWorkout => ({ ...prevWorkout, dayType: selectedDayType }));
  };

  const handleDifficultyChange = selectedDifficulty => {
    setWorkout(prevWorkout => ({
      ...prevWorkout,
      difficulty: selectedDifficulty
    }));
  };

  const handleSaveTemplate = async event => {
    event.preventDefault();

    const templateData = {
      user_id: 2, // hardcoded for now, but should be the logged in user's ID
      workout_name: workout.templateName,
      workout_day_type: workout.dayType,
      plan_type: workout.planType,
      difficulty_level: workout.difficulty,
      exercises: Array.from(workout.selectedExercises).map(exerciseId => ({
        exercise_id: exerciseId
      }))
    };

    try {
      const response = await fetch(
        'http://localhost:9025/api/workout-templates',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(templateData)
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong with saving the template');
      }

      // Assuming the backend responds with the created template, you could use it here if needed
      // const savedTemplate = await response.json();

      // After saving, redirect back to the WorkoutPage
      navigate('/workouts');
    } catch (error) {
      console.error('Failed to save the template:', error);
      // Here, you could set an error state and display it to the user if you wish
    }
  };

  const handleCancel = () => {
    // Redirect to the create workout page
    navigate('/workouts');
  };

  const handleAddDetails = () => {
    navigate('/create-workout-details');
  };

  const handleSelectExercise = exercise => {
    setWorkout(prevWorkout => {
      const existingIndex = prevWorkout.selectedExercises.findIndex(
        ex => ex.exercise_id === exercise.exercise_id
      );

      let newSelectedExercises;
      if (existingIndex >= 0) {
        // Exercise is already selected, remove it
        newSelectedExercises = prevWorkout.selectedExercises.filter(
          (_, index) => index !== existingIndex
        );
      } else {
        // Exercise is not selected, add it
        newSelectedExercises = [...prevWorkout.selectedExercises, exercise];
      }

      return {
        ...prevWorkout,
        selectedExercises: newSelectedExercises
      };
    });
  };

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>Error loading exercises: {error}</div>;

  const dayTypes = ['Day of Week', 'Numerical'];
  const planTypes = ['General', 'Bulking', 'Cutting', 'Sport'];
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advance'];

  return (
    <div className='page-layout'>
      <Nav />
      <h1 className='page-title'>Create New Template</h1>
      <form onSubmit={handleSaveTemplate}>
        <div>
          <div className='input-container'>
            <input
              type='text'
              className='full-width-input'
              placeholder='Enter Workname Name'
              value={workout.templateName}
              onChange={e =>
                setWorkout(prevWorkout => ({
                  ...prevWorkout,
                  templateName: e.target.value
                }))
              }
            />
          </div>

          <div className='template-detail-container'>
            <div className='template-detail'>
              <select
                id='day-type'
                onChange={e => handleDayTypeChange(e.target.value)}
                placeholder='Select Day Type'
              >
                <option value=''>Select Day Type</option>
                {dayTypes.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className='template-detail'>
              <select
                id='plan-type'
                onChange={e => handlePlanTypeChange(e.target.value)}
                placeholder='Select Plan Type'
              >
                <option value=''>Select Plan Type</option>
                {planTypes.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className='template-detail'>
              <select
                id='difficulty-level'
                onChange={e => handleDifficultyChange(e.target.value)}
              >
                <option value=''>Select Difficulty Level</option>
                {difficultyLevels.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <SearchBar onChange={handleSearch} />
        <ExerciseFilters
          onMuscleChange={handleMuscleChange}
          onEquipmentChange={handleEquipmentChange}
        />

        <div className='exercise-container'>
          {filteredExercises.map(exercise => (
            <Exercise
              key={exercise.exercise_id}
              name={exercise.name}
              muscle={exercise.muscle}
              equipment={exercise.equipment}
              image={`http://localhost:9025/${exercise.file_path}`}
              isSelectable={true} // Make the exercise selectable in this context
              isSelected={workout.selectedExercises.some(
                ex => ex.exercise_id === exercise.exercise_id
              )}
              onClick={() => handleSelectExercise(exercise)}
            />
          ))}
        </div>
        <div className='button-container'>
          <button id='add-workout-details-button' onClick={handleAddDetails}>
            Add Workout Details
          </button>
          <button id='save-workout-button' onClick={handleSaveTemplate}>
            Save
          </button>
          <button id='cancel-workout-button' onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplate;