import React from 'react';
import './WorkoutList.css';

const WorkoutList = ({
  workout_id,
  name,
  day_type,
  plan_type,
  difficulty_level
}) => {
  return (
    <div key={workout_id} className='workout'>
      <div className='workout-title'>
        <h2 className='workout-title'>{name}</h2>
      </div>
      <div className='template-section'>
        <p className='template-section-title'>Day Type</p>
        <p className='template-section-text'>{day_type}</p>
      </div>
      <div className='template-section'>
        <p className='template-section-title'>Plan Type</p>
        <p className='template-section-text'>{plan_type}</p>
      </div>
      <div className='template-section'>
        <p className='template-section-title'>Difficulty Level</p>
        <p className='template-section-text'>{difficulty_level}</p>
      </div>
      <p className='workout-description'>
        Some details about the workout go here.
      </p>
    </div>
  );
};

export default WorkoutList;
