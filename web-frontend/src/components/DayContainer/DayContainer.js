import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TbLayoutNavbarExpandFilled,
  TbLayoutBottombarExpandFilled
} from 'react-icons/tb';
import { MdRemoveCircle } from 'react-icons/md';

import './DayContainer.css';

const DayContainer = ({ day, onAddExercise, onRemove }) => {
  const [exercises, setExercises] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  DayContainer.propTypes = {
    day: PropTypes.shape({
      name: PropTypes.string.isRequired
    }).isRequired,
    onAddExercise: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div className='day-container'>
        <div className='day-header' onClick={toggleExpand}>
          <button id='expand-day-card-button' onClick={toggleExpand}>
            {isExpanded ? (
              <TbLayoutBottombarExpandFilled />
            ) : (
              <TbLayoutNavbarExpandFilled />
            )}
          </button>
          <h2 id='day-card-title'>{day.name}</h2>
          <button id='delete-day-card-button' onClick={() => onRemove(day.id)}>
            <MdRemoveCircle />
          </button>
        </div>
        {isExpanded && (
          <div className='day-body'>
            <div className='day-body-header'>
              <h3>Exercises</h3>
              <button onClick={() => onAddExercise(day.id)}>
                Add Exercise
              </button>
            </div>
            <div className='day-body-content'>
              {exercises.map(exercise => (
                <div key={exercise.id} className='exercise'>
                  <h4>{exercise.name}</h4>
                  <button
                    onClick={() => {
                      setExercises(
                        exercises.filter(ex => ex.id !== exercise.id)
                      );
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayContainer;
