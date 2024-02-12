import React from 'react';
import './WorkoutList.css';

const WorkoutList = ({ onChange }) => {
  return (
    <div className='workout-container'>
      <div className='workout'>
        <h2 className='workout-title'>Chest</h2>
        <p className='workout-description'>
          Barbell Flat Bench, Dumbbell Flys, Incline Flat Bench Press
        </p>
      </div>
      <div className='workout'>
        <h2 className='workout-title'>Shoulders</h2>
        <p className='workout-description'>some description</p>
      </div>
    </div>
  );
};

export default WorkoutList;
