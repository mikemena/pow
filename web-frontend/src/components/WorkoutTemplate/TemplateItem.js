import React, { useState } from 'react';
import './TemplateItem.css';
import Accordion from '../Accordion/Accordion';

const WorkoutList = ({
  workout_id,
  name,
  day_type,
  plan_type,
  difficulty_level
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div key={workout_id} id='workout' onClick={toggleAccordion}>
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
      {isOpen && (
        <Accordion
          onStart={() => console.log('Start Workout')}
          onEdit={() => console.log('Edit Workout')}
          onDelete={() => console.log('Delete Workout')}
        />
      )}
    </div>
  );
};

export default WorkoutList;
