import React from 'react';

const Accordion = ({ onStart, onEdit, onDelete }) => {
  return (
    <div className='accordion-content'>
      <button onClick={onStart}>Start Workout</button>
      <button onClick={onEdit}>Edit Workout</button>
      <button onClick={onDelete}>Delete Workout</button>
    </div>
  );
};

export default Accordion;
