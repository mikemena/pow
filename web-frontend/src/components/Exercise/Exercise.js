import React, { useState } from 'react';
import './Exercise.css';

export default function Exercise({
  id,
  name,
  muscle,
  equipment,
  image,
  onSelect
}) {
  const [isSelected, setIsSelected] = useState(false);

  const toggleSelect = () => {
    const newSelectedState = !isSelected;
    setIsSelected(newSelectedState);
    if (onSelect) {
      onSelect(id, newSelectedState);
    }
  };

  return (
    <div
      className={`exercise ${isSelected ? 'selected' : ''}`}
      onClick={toggleSelect}
    >
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
