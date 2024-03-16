import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TbLayoutNavbarExpandFilled,
  TbLayoutBottombarExpandFilled,
  TbPencil
} from 'react-icons/tb';
import { MdDelete } from 'react-icons/md';
import Button from '../Inputs/Button';
import { DayContainerContext } from '../../contexts/dayContainerContext';
import './DayContainer.css';

const DayContainer = ({
  day,
  handleRemoveDay,
  handleAddExercise,
  handleRemoveExercise,
  isActive
}) => {
  const { expandedDayId, toggleExpand } = useContext(DayContainerContext);
  const isExpanded = expandedDayId === day.id;

  const [isEditing, setIsEditing] = useState(false);

  const dayContainerClass = isActive ? 'day-container active' : 'day-container';

  const toggleDayExpand = () => {
    toggleExpand(day.id);
  };
  console.log('day', day);
  console.log(day.exercises);

  return (
    <div>
      <>
        <div className={dayContainerClass}>
          <div className='day-container__header' onClick={toggleDayExpand}>
            <button
              className='day-container__expand-btn'
              title='Expand/Collapse Day'
            >
              {isExpanded ? (
                <TbLayoutBottombarExpandFilled size={20} />
              ) : (
                <TbLayoutNavbarExpandFilled size={20} />
              )}
            </button>

            {isEditing ? (
              <p>Editing</p>
            ) : (
              <div className='day-container__title_container'>
                <button className='day-container__edit-title-btn'>
                  <TbPencil size={20} />
                </button>
                <h2 className='day-container__title'>{day.name}</h2>
              </div>
            )}

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
              <MdDelete size={20} />
            </button>
          </div>
          {isExpanded && (
            <div className='day-container__body'>
              <div className='day-container__header'>
                <h3>Exercises</h3>
                <Button
                  id='save--exercise-btn'
                  onClick={handleAddExercise}
                  type='button'
                  bgColor='#EAEAEA'
                >
                  Add Exercise
                </Button>
              </div>
              <div className='day-container__exercises'>
                {day.exercises && day.exercises.length > 0 ? (
                  day.exercises.map(exercise => (
                    <div
                      key={exercise.exercise_id}
                      className='day-container__each-exercise'
                    >
                      <div className='day-container__exercise-details'>
                        <h4 className='day-container__exercise-name'>
                          {exercise.name}
                        </h4>
                        <p className='day-container__exercise-muscle'>
                          {exercise.muscle}
                        </p>
                      </div>
                      <button
                        className='day-container__remove-exercise-btn'
                        id={`remove-exercise-btn-${exercise.exercise_id}`}
                        type='button'
                        onClick={() =>
                          handleRemoveExercise(day.id, exercise.exercise_id)
                        }
                      >
                        <MdDelete size={30} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className='day-container__no-exercise-message'>
                    No exercises added
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

DayContainer.propTypes = {
  day: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onAddExercise: PropTypes.func.isRequired
};

export default DayContainer;
