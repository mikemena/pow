import React, { useState } from 'react';
import './TemplateItem.css';
import Accordion from '../Accordion/Accordion';

const TemplateItems = ({
  workout_id,
  name,
  day_type,
  plan_type,
  difficulty_level,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  console.log('onDelete prop in TemplateItems:', onDelete);
  return (
    <div
      workout_id={workout_id}
      key={workout_id}
      className='workout'
      onMouseEnter={toggleAccordion}
      onMouseLeave={toggleAccordion}
    >
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
          isOpen={isOpen}
          onStart={() => console.log('Start Workout')}
          onEdit={() => console.log('Edit Workout')}
          onDelete={() => {
            onDelete(workout_id);
          }}
        />
      )}
    </div>
  );
};

export default TemplateItems;
