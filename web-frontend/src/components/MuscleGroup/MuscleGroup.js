import React from 'react';
import './MuscleGroup.css';

const MuscleGroup = ({ name, image, onClick }) => {
  return (
    <div className='muscle-group' onClick={onClick}>
      <div className='muscle-group-name'>{name}</div>
      <img src={image} alt={name} />
    </div>
  );
};

export default MuscleGroup;
