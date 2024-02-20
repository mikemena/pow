import React from 'react';
import './Exercise.css';

export default function Exercise({
  name,
  muscle,
  equipment,
  image,
  onClick,
  isSelected
}) {
  const className = isSelected ? 'selected' : '';
  return (
    <div className={className} onClick={onClick}>
      <img src={image} alt={name} className='exercise-image' />
      <div className='exercise-details'>
        <p className='exercise-title'>
          {name} ({equipment})
        </p>
        <p className='exercise-muscle'>{muscle} </p>
      </div>
    </div>
  );
}
