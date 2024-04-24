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
  const { theme } = useTheme();

  return (
    <div
      className={`exercise ${theme} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className='exercise__image-container'>
        <img src={image} alt={name} className='exercise__image' />
        <div className={`exercise__glass ${theme}`}></div>
      </div>
      <div className='exercise__details'>
        <p className='exercise__title'>
          {name} ({equipment})
        </p>
        <p className='exercise__subtitle'>{muscle} </p>
      </div>
    </div>
  );
}
