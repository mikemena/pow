import React from 'react';
import './TemplateItem.css';

const TemplateItems = ({
  workout_id,
  name,
  day_type,
  plan_type,
  difficulty_level,
  onDelete
}) => {
  return (
    <div workout_id={workout_id} key={workout_id} className='workout'>
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
      <div className='accordion-content'>
        <button
          className='button-class'
          onClick={() => console.log('Start Workout')}
        >
          Start
        </button>
        <button
          className='button-class'
          onClick={() => console.log('Edit Workout')}
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
  );
};

export default TemplateItems;
