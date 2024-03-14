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
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      className={`exercise ${isSelected ? 'exercise--selected' : ''}`}
      onClick={handleClick}
    >
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
