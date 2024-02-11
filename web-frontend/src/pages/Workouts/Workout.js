import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Workout.css';
import WorkoutList from '../../components/Workouts/WorkoutList';

const AddTemplatePage = () => {
  const [templateName, setTemplateName] = useState('');
  const navigate = useNavigate();

  const handleAddExercises = () => {
    // Redirect to exercises page and pass state
    navigate.push('/exercises', { isSelectingForTemplate: true, templateName });
  };

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Start Workout</h1>
      <h2 className='page-subtitle'>Quick Start</h2>
      <button>Start an Empty Workout</button>
      <div className='template-header'>
        <h2 className='page-subtitle'>Templates</h2>
        <button>Create New Template</button>
      </div>

      <button onClick={handleAddExercises}>Add Exercises</button>
      <WorkoutList />
    </div>
  );
};

export default AddTemplatePage;
