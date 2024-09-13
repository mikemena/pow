import React from 'react';
import { useTheme } from '../../contexts/themeContext';
import './Exercise.css';

const Exercise = ({ name, muscle, equipment, image, onClick, isSelected }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`exercise ${theme} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      role='button'
      aria-pressed={isSelected}
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className='exercise__image-container'>
        <img
          src={image}
          crossorigin='anonymous'
          alt={`${name} - ${muscle} muscle, ${equipment}`}
          className='exercise__image'
        />
        <div className={`exercise__glass ${theme}`}></div>
      </div>
      <div className='exercise__details'>
        <p className='exercise__title'>
          {name} ({equipment})
        </p>
        <p className='exercise__subtitle'>{muscle}</p>
      </div>
    </div>
  );
};

export default React.memo(Exercise);
