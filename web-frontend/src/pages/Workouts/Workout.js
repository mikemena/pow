import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Workout.css';
import WorkoutList from '../../components/WorkoutList/WorkoutList';

const AddTemplatePage = () => {
  const [templateName, setTemplateName] = useState('');
  const navigate = useNavigate();

  const handleCreateNewWorkout = () => {
    // Redirect to the create workout page
    navigate('/create-workout');
  };

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Start Workout</h1>
      <h2 className='page-subtitle'>Quick Start</h2>
      <button className='start-workout-button'>Start an Empty Workout</button>
      <div className='template-header'>
        <h2 className='second-subtitle'>Templates</h2>
        <button onClick={handleCreateNewWorkout}>Create New Template</button>
      </div>
      <WorkoutList />
    </div>
  );
};

export default AddTemplatePage;
