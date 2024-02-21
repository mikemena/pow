import React from 'react';
import './TemplateGrid.css';

const WorkoutTemplateGrid = ({ templates, onDelete, workout_id }) => {
  // Check if 'templates' is an array and has items
  if (Array.isArray(templates) && templates.length > 0) {
    return (
      <div className='template-container'>
        {templates.map(template => (
          <div
            workout_id={template.workout_id}
            key={template.workout_id}
            className='workout'
          >
            <div className='workout-title'>
              <h2 className='workout-title'>{template.name}</h2>
            </div>
            <div className='template-section'>
              <p className='template-section-title'>Day Type</p>
              <p className='template-section-text'>{template.day_type}</p>
            </div>
            <div className='template-section'>
              <p className='template-section-title'>Plan Type</p>
              <p className='template-section-text'>{template.plan_type}</p>
            </div>
            <div className='template-section'>
              <p className='template-section-title'>Difficulty Level</p>
              <p className='template-section-text'>
                {template.difficulty_level}
              </p>
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
                  onDelete(template.workout_id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    return <p>No workout templates found</p>;
  }
};

export default WorkoutTemplateGrid;
