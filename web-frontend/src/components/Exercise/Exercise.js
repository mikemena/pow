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
  const className = isSelected ? 'selected card' : 'card';
  return (
    <div className={className} onClick={onClick}>
      <img src={image} alt={name} className='card-image' />
      <div className='exercise-details'>
        <p className='card-title'>
          {name} ({equipment})
        </p>
        <p className='card-subtitle'>{muscle} </p>
      </div>
    </div>
  );
}
