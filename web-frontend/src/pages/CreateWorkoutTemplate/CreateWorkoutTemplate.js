import React, { useState, useEffect } from 'react';
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
    // Perform the POST API call to save the new template
    // Replace with your actual API call logic
    // ...

    // After saving, redirect back to the WorkoutPage
    navigate('/workouts');
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
        {filteredExercises.map(exercise => (
          <Exercise
            key={exercise.id}
            id={exercise.id}
            name={exercise.name}
            muscle={exercise.muscle}
            equipment={exercise.equipment}
            image={`http://localhost:9025/${exercise.file_path}`}
            selectable
            onSelect={() =>
              handleExerciseSelect(
                exercise.id,
                !selectedExercises.includes(exercise.id)
              )
            }
          />
        ))}
        <div>
          <Button onClick={handleSaveTemplate}>Save Template</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplatePage;
