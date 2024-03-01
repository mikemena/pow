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
        <img src={image} alt={name} id='exercise-image' />
        <div className='glass'></div>
      </div>
      <div id='exercise-details'>
        <p id='exercise-title'>
          {name} ({equipment})
        </p>
        <p id='exercise-subtitle'>{muscle} </p>
      </div>
    </div>
  );
}
