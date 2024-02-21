import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../../components/Inputs/Dropdown';
import SearchBar from '../../components/SearchBar/SearchBar';
import Exercise from '../../components/Exercise/Exercise';
import ExerciseFilters from '../../components/ExerciseFilters/ExerciseFilters';
import useFetchData from '../../hooks/useFetchData';
import './CreateTemplate.css';

const CreateTemplatePage = () => {
  const [templateName, setTemplateName] = useState('');
  const [planType, setPlanType] = useState('General');
  const [dayType, setDayType] = useState('Day of Week');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [selectedExercises, setSelectedExercises] = useState(new Set());
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
    console.log('Current Search Term: ', searchTerm); // Debugging line
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
    setPlanType(selectedPlanType);
  };

  const handleDayTypeChange = selectedDayType => {
    setDayType(selectedDayType);
  };

  const handleDifficultyChange = selectedDifficulty => {
    setDifficulty(selectedDifficulty);
  };

  const handleSaveTemplate = async event => {
    event.preventDefault();

    const templateData = {
      user_id: 2, // hardcoded for now, but should be the logged in user's ID
      workout_name: templateName,
      workout_day_type: dayType,
      plan_type: planType,
      difficulty_level: difficulty,
      exercises: Array.from(selectedExercises).map(exerciseId => ({
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

  const handleSelectExercise = exerciseId => {
    setSelectedExercises(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(exerciseId)) {
        newSelected.delete(exerciseId); //remove the exercise if it's already selected
      } else {
        newSelected.add(exerciseId);
      }
      return newSelected;
    });
  };

  if (isLoading) return <div>loading...</div>;
  if (error) return <div>Error loading exercises: {error}</div>;

  const dayTypes = ['Day of Week', 'Numerical'];
  const planTypes = ['General', 'Bulking', 'Cutting', 'Sport'];
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advance'];

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Create New Template</h1>
      <form onSubmit={handleSaveTemplate}>
        <div>
          <div class='input-container'>
            <input
              type='text'
              class='full-width-input'
              placeholder='Enter Workname Name'
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
            />
          </div>

          <div className='template-detail-container'>
            <div className='template-detail'>
              <select
                id='day-type'
                onSelect={handleDayTypeChange}
                placeholder='Select Day Type'
              >
                <option value=''>Select Day Type</option>
                {dayTypes.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className='template-detail'>
              <select
                id='plan-type'
                onChange={event => handlePlanTypeChange(event.target.value)}
                placeholder='Select Plan Type'
              >
                <option value=''>Select Plan Type</option>
                {planTypes.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className='template-detail'>
              <select
                id='difficulty-level'
                onChange={event => handleDifficultyChange(event.target.value)}
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
              isSelected={selectedExercises.has(exercise.id)}
              onClick={() => handleSelectExercise(exercise.id)}
            />
          ))}
        </div>
        <div className='button-container'>
          <button id='save-template-button' onClick={handleSaveTemplate}>
            Save Template
          </button>
          <button id='cancel-template-button' onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplatePage;
