import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TbLayoutNavbarExpandFilled,
  TbLayoutBottombarExpandFilled,
  TbPencil
} from 'react-icons/tb';
import { IoCloseCircleSharp, IoCheckmarkCircleSharp } from 'react-icons/io5';
import { MdDelete } from 'react-icons/md';
import Button from '../Inputs/Button';
import { WorkoutContainerContext } from '../../contexts/workoutContainerContext';
import './WorkoutContainer.css';

const WorkoutContainer = ({
  workout,
  handleRemoveWorkout,
  handleAddExercise,
  handleRemoveExercise,
  isActive
}) => {
  const { expandedWorkoutId, toggleExpand } = useContext(
    WorkoutContainerContext
  );
  const isExpanded = expandedWorkoutId === workout.id;

  const [isEditing, setIsEditing] = useState(false);

  const handleEditTitleChange = e => {
    setIsEditing(true);
    console.log('Editing', isEditing);
  };

  const handleSaveTitleChange = e => {
    console.log('Save Title');
  };

  const handleCloseTitleChange = e => {
    setIsEditing(false);
    console.log('Editing', isEditing);
  };

  const workoutContainerClass = isActive
    ? 'workout-container active'
    : 'workout-container';

  const toggleWorkoutExpand = () => {
    toggleExpand(workout.id);
  };
  console.log('workout', workout);
  console.log(workout.exercises);

  return (
    <div>
      <>
        <div className={workoutContainerClass}>
          <div
            className='workout-container__header'
            onClick={toggleWorkoutExpand}
          >
            <button
              className='workout-container__expand-btn'
              title='Expand/Collapse Workout'
            >
              {isExpanded ? (
                <TbLayoutBottombarExpandFilled size={20} />
              ) : (
                <TbLayoutNavbarExpandFilled size={20} />
              )}
            </button>

            {isEditing ? (
              <div className='workout-container__title_container'>
                <button className='workout-container__save-title-btn'>
                  <IoCheckmarkCircleSharp
                    size={20}
                    onClick={handleSaveTitleChange}
                  />
                </button>
                <input type='text' placeholder='Enter Title' />
                <button className='workout-container__close-title-btn'>
                  <IoCloseCircleSharp
                    size={20}
                    onClick={handleCloseTitleChange}
                  />
                </button>
              </div>
            ) : (
              <div className='workout-container__title_container'>
                <button className='workout-container__edit-title-btn'>
                  <TbPencil size={20} onClick={handleEditTitleChange} />
                </button>
                <h2 className='workout-container__title'>{workout.name}</h2>
              </div>
            )}

            <button
              className='workout-container__delete-btn'
              onClick={() => {
                const confirm = window.confirm(
                  `Are you sure you want to remove ${workout.name}?`
                );
                if (confirm) {
                  handleRemoveWorkout(workout.id);
                }
              }}
            >
              <MdDelete size={20} />
            </button>
          </div>
          {isExpanded && (
            <div className='workout-container__body'>
              <div className='workout-container__header'>
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
              <div className='workout-container__exercises'>
                {workout.exercises && workout.exercises.length > 0 ? (
                  workout.exercises.map(exercise => (
                    <div
                      key={exercise.exercise_id}
                      className='workout-container__each-exercise'
                    >
                      <div className='workout-container__exercise-details'>
                        <h4 className='workout-container__exercise-name'>
                          {exercise.name}
                        </h4>
                        <p className='workout-container__exercise-muscle'>
                          {exercise.muscle}
                        </p>
                      </div>
                      <button
                        className='workout-container__remove-exercise-btn'
                        id={`remove-exercise-btn-${exercise.exercise_id}`}
                        type='button'
                        onClick={() =>
                          handleRemoveExercise(workout.id, exercise.exercise_id)
                        }
                      >
                        <MdDelete size={30} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className='workout-container__no-exercise-message'>
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

WorkoutContainer.propTypes = {
  workout: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onAddExercise: PropTypes.func.isRequired
};

export default WorkoutContainer;
