import React from 'react';
import './MuscleGroup.css';

const Muscle = ({ name, image, onClick }) => {
  return (
    <div className='muscle' onClick={onClick}>
      <div className='muscle-title'>{name}</div>
      <img src={image} alt={name} />
    </div>
  );
};

export default Muscle;
