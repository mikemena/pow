import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  TbLayoutNavbarExpandFilled,
  TbLayoutBottombarExpandFilled
} from 'react-icons/tb';
import { MdRemoveCircle } from 'react-icons/md';
import Button from '../Inputs/Button';
import { DayContainerContext } from '../../contexts/dayContainerContext';
import './DayContainer.css';

const DayContainer = ({ day, onAddExercise, handleRemoveDay }) => {
  const [exercises, setExercises] = useState([]);
  const { expandedDayId, toggleExpand } = useContext(DayContainerContext);
  const isExpanded = expandedDayId === day.id;

  const toggleDayExpand = () => {
    toggleExpand(day.id);
  };

  return (
    <div>
      <div className='day-container'>
        <div className='day-container__header' onClick={toggleDayExpand}>
          <button
            className='day-container__expand-btn'
            onClick={toggleDayExpand}
            title='Expand/Collapse Day'
          >
            {isExpanded ? (
              <TbLayoutBottombarExpandFilled size={30} />
            ) : (
              <TbLayoutNavbarExpandFilled size={30} />
            )}
          </button>
          <h2 className='day-container__title'>{day.name}</h2>
          <button
            className='day-container__delete-btn'
            onClick={() => {
              const confirm = window.confirm(
                `Are you sure you want to remove ${day.name}?`
              );
              if (confirm) {
                handleRemoveDay(day.id);
              }
            }}
          >
            <MdRemoveCircle size={30} />
          </button>
        </div>
        {isExpanded && (
          <div className='day-container__body'>
            <div className='day-container__header'>
              <h3>Exercises</h3>
              <Button
                id='save--exercise-btn'
                onClick={() => onAddExercise(day.id)}
                type='button'
                bgColor='#EAEAEA'
              >
                Add Exercise
              </Button>
            </div>
            <div className='day-container__content'>
              {exercises.map(exercise => (
                <div key={exercise.id} className='day-container__exercise'>
                  <h4>{exercise.name}</h4>
                  <Button
                    id='remove-exercise-btn'
                    type='button'
                    bgColor='#EAEAEA'
                    onClick={() => {
                      setExercises(
                        exercises.filter(ex => ex.id !== exercise.id)
                      );
                    }}
                  >
                    Remove Exercise
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

DayContainer.propTypes = {
  day: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onAddExercise: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default DayContainer;
