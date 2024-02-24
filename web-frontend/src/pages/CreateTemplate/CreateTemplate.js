import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import Exercise from '../../components/Exercise/Exercise';
import ExerciseFilters from '../../components/ExerciseFilters/ExerciseFilters';
import useFetchData from '../../hooks/useFetchData';
import Nav from '../../components/Nav/Nav';
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
  const [showDetails, setShowDetails] = useState(false);

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

  const handleNextClick = () => {
    setShowDetails(true); // This will trigger the slide-in of the details panel
  };

  const handleBackClick = () => {
    setShowDetails(false);
  }; // This will trigger the slide-out of the details panel

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

        <div className='slide-container'>
          <div
            className={`exercise-container ${showDetails ? 'slide-out' : ''}`}
          >
            {filteredExercises.map(exercise => (
              <Exercise
                key={exercise.exercise_id}
                name={exercise.name}
                muscle={exercise.muscle}
                equipment={exercise.equipment}
                image={`http://localhost:9025/${exercise.file_path}`}
                isSelectable={true} // Make the exercise selectable in this context
                isSelected={selectedExercises.has(exercise.exercise_id)}
                onClick={() => handleSelectExercise(exercise.exercise_id)}
              />
            ))}
          </div>
          {selectedExercises.size > 0 && !showDetails && (
            <div className='next-arrow-container' onClick={handleNextClick}>
              <div className='arrow'>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div className={`template-details ${showDetails ? 'slide-in' : ''}`}>
            Details go here...
            {showDetails && (
              <div className='back-arrow-container' onClick={handleBackClick}>
                <div className='back-arrow'>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
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
