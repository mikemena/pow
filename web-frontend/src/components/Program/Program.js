import React from 'react';
import Navbar from '../Nav/Nav';
import './Program.css';

const Program = ({
  onDelete,
  onEdit,
  workout_id,
  name,
  day_type,
  plan_type,
  difficulty_level,
  exercises
}) => {
  return (
    <div className='workout-template'>
      <Navbar />
      <div workout_id={workout_id} key={workout_id} className='workout'>
        <div className='template-title'>
          <h2 className='template-title-text'>{name}</h2>
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
        <div className='template-section'>
          <p className='template-section-title'>Exercises</p>
          <p className='template-section-text'>
            {exercises
              .filter(exercise => exercise.exercise_name)
              .map(exercise => exercise.exercise_name)
              .join(', ')}
          </p>
        </div>
        <div className='workout-template-actions-container'>
          <button
            className='button-class'
            onClick={() => console.log('Start Workout')}
          >
            Start
          </button>
          <button
            className='button-class'
            onClick={() => {
              const workout = {
                workout_id,
                name,
                day_type,
                plan_type,
                difficulty_level,
                exercises
              };

              onEdit(workout);
            }}
          >
            Edit
          </button>
          <button
            className='button-class'
            onClick={() => {
              onDelete(workout_id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Program;
