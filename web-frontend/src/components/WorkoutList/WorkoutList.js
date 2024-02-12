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


export default function Exercise({ id, name, muscle, equipment, image }) {
  return (
    <div key={id} className='exercise'>
      <img src={image} alt={name} className='exercise-image' />
      <div className='exercise-details'>
        <p className='exercise-title'>
          {name} ({equipment})
        </p>
        <p className='exercise-muscle'>{muscle} </p>
      </div>
    </div>
  );
}

