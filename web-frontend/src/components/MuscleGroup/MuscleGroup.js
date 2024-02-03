import React from 'react';
import './MuscleGroup.css';

const MuscleGroup = ({ name, image }) => {
  return (
    <div className='muscle-group'>
      <img src={image} alt={name} />
      <p>{name}</p>
    </div>
  );
};

export default MuscleGroup;
