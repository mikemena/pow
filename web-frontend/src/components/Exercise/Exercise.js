import React from 'react';
import { useTheme } from '../../contexts/themeContext';
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

  const { theme } = useTheme();

  return (
    <div
      className={`exercise-container ${theme} ${
        isSelected ? 'exercise-container--selected' : ''
      }`}
      onClick={handleClick}
    >
      <div className='exercise-container__image-container'>
        <img src={image} alt={name} className='exercise-container__image' />
        <div className={`exercise-container__glass ${theme}`}></div>
      </div>
      <div className='exercise-container__details'>
        <p className='exercise-container__title'>
          {name} ({equipment})
        </p>
        <p className='exercise-container__subtitle'>{muscle} </p>
      </div>
    </div>
  );
}
