import React, { useState } from 'react';
import './DayContainer.css';

const DayContainer = ({ day, onAddExercise }) => {
  const [exercises, setExercises] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div id='day-container' className={isExpanded ? 'expanded' : ''}>
      <div id='day-header'>
        <h2>{day}</h2>
        <button class='collapse-trigger' onClick={toggleExpand}>
          {/* This will change based on the state */}
          <span class='icon'></span>
        </button>
        <button id='btn-add-exercise' onClick={() => onAddExercise(day)}>
          Add Exercise
        </button>
      </div>
      {/* Content to expand/collapse */}
      <div id='day-content'>
        <p>some stuff here...</p>
      </div>
    </div>
  );
};

export default DayContainer;
