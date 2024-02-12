import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Workout.css';
import WorkoutList from '../../components/WorkoutList/WorkoutList';

const WorkoutTemplatePage = () => {
  const [templateName, setTemplateName] = useState('');
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:9025/api/workout-templates/2')
      .then(response => response.json())
      .then(data => {
        setWorkoutTemplates(data);
        setIsLoading(false); // Finish loading after fetching exercises
        console.log(data);
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

  return (
    <div className='page-layout'>
      <h1 className='page-title'>Start Workout</h1>
      <h2 className='page-subtitle'>Quick Start</h2>
      <button className='start-workout-button'>Start an Empty Workout</button>
      <div className='template-header'>
        <h2 className='second-subtitle'>Templates</h2>
        <button onClick={handleCreateNewWorkout}>Create New Template</button>
      </div>
      {}
      <WorkoutList
        key={workoutTemplates.workout_id}
        name={workoutTemplates.workout_name}
        day_type={workoutTemplates.workout_day_type}
        plan_type={workoutTemplates.plan_type}
        difficulty_level={workoutTemplates.difficulty_level}
      />
    </div>
  );
};

export default WorkoutTemplatePage;
