import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import Dropdown from '../../components/Inputs/Dropdown';
import Button from '../../components/Inputs/Button';
import SearchBar from '../../components/SearchBar/SearchBar';
import Exercise from '../../components/Exercise/Exercise';
import ExerciseFilters from '../../components/ExerciseFilters/ExerciseFilters';

const CreateTemplatePage = () => {
  const [templateName, setTemplateName] = useState('');
  const [planType, setPlanType] = useState('General');
  const [dayType, setDayType] = useState('Day of Week');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:9025/api/exercise-catalog')
      .then(response => response.json())
      .then(data => {
        console.log('this is the api data for exercises', data);
        setExercises(data);
        setFilteredExercises(data);
        setIsLoading(false); // Finish loading after fetching exercises
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
  }, [searchTerm, selectedMuscle, selectedEquipment, exercises]);

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
      exercises: selectedExercises
    };
    console.log('JSON.stringify(templateData)', JSON.stringify(templateData));
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

  const handleExerciseSelect = (exerciseId, isSelected) => {
    setSelectedExercises(prevSelectedExercises => {
      if (isSelected) {
        // Add the exercise to the list if it's selected and not already included
        return [...prevSelectedExercises, exerciseId];
      } else {
        // Remove the exercise from the list if it's unselected
        return prevSelectedExercises.filter(id => id !== exerciseId);
      }
    });
  };

  console.log(planType, dayType, difficulty, selectedExercises);

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Create New Template</h1>
      <form onSubmit={handleSaveTemplate}>
        <div>
          <Input
            label='Template Name'
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
          />
          <Dropdown
            id='day-type'
            label='Workout Day Type'
            options={['Day of Week', 'Numerical']}
            onSelect={handleDayTypeChange}
          />
          <Dropdown
            id='plan-type'
            label='Plan Type'
            options={['General', 'Bulking', 'Cutting', 'Sport']}
            onSelect={handlePlanTypeChange}
          />

          <Dropdown
            id='difficulty-level'
            label='Difficulty Level'
            options={['Beginner', 'Intermediate', 'Advance']}
            onSelect={handleDifficultyChange}
          />
        </div>
        <SearchBar onChange={handleSearch} />
        <ExerciseFilters
          onMuscleChange={handleMuscleChange}
          onEquipmentChange={handleEquipmentChange}
        />
        {filteredExercises.map(exercise => {
          // Log the details of each exercise being rendered
          console.log('Rendering exercise:', {
            id: exercise.exercise_id,
            name: exercise.name
          });

          return (
            <Exercise
              key={exercise.exercise_id}
              id={exercise.exercise_id}
              name={exercise.name}
              muscle={exercise.muscle}
              equipment={exercise.equipment}
              image={`http://localhost:9025/${exercise.file_path}`}
              selectable
              onSelect={() =>
                handleExerciseSelect(
                  exercise.exercise_id,
                  !selectedExercises.includes(exercise.exercise_id)
                )
              }
            />
          );
        })}

        <div>
          <Button onClick={handleSaveTemplate}>Save Template</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplatePage;
