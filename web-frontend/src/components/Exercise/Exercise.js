import React from 'react';
import './Exercise.css';

export default function Exercise({
  name,
  muscle,
  equipment,
  image,
  onClick,
  isSelectable,
  isSelected
}) {
  const exerciseClass = isSelected ? 'exercise selected' : 'exercise';
  return (
    <div className={exerciseClass} onClick={isSelectable ? onClick : undefined}>
      <div className='image-container'>
        <img src={image} alt={name} className='exercise-image' />
        <div className='glass'></div>
      </div>
      <div className='exercise-details'>
        <p className='exercise-title'>
          {name} ({equipment})
        </p>
        <p className='exercise-subtitle'>{muscle} </p>
      </div>
    </div>
  );
}
