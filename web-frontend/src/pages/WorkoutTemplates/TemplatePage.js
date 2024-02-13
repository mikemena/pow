import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TemplatePage.css';
import TemplateGrid from '../../components/WorkoutTemplate/TemplateGrid';
import Button from '../../components/Inputs/Button';

const WorkoutTemplatePage = () => {
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:9025/api/workout-templates/2')
      .then(response => response.json())
      .then(data => {
        setWorkoutTemplates(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch workout templates:', error);
        setIsLoading(false); // Finish loading even if there was an error
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCreateNewWorkout = () => {
    // Redirect to the create workout page
    navigate('/create-workout');
  };

  const handleEmptyWorkout = () => {
    // Redirect to the create workout page
    navigate('/create-workout');
  };

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Start Workout</h1>
      <h2 className='page-subtitle'>Quick Start</h2>
      <div id='start-empty-container'>
        <Button onClick={handleEmptyWorkout}>Start an Empty Workout</Button>
      </div>
      <div className='template-header'>
        <h2 className='second-subtitle'>Templates</h2>
        <Button onClick={handleCreateNewWorkout}>Create New Template</Button>
      </div>
      <div id='workout-grid'>
        <TemplateGrid templates={workoutTemplates} />
      </div>
    </div>
  );
};

export default WorkoutTemplatePage;
