import React from 'react';
import './Accordion.css';

const Accordion = ({ onStart, onEdit, onDelete, isOpen }) => {
  console.log('onDelete prop in Accordion:', onDelete);

  return (
    <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
      <button className='accordion-button' onClick={onStart}>
        Start Workout
      </button>
      <button className='accordion-button' onClick={onEdit}>
        Edit Workout
      </button>
      <button className='accordion-button' onClick={onDelete}>
        Delete Workout
      </button>
    </div>
  );
};

export default Accordion;
