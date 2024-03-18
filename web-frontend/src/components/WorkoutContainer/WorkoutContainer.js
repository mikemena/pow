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
  handleWorkoutTitle,
  isActive
}) => {
  const { expandedWorkoutId, toggleExpand } = useContext(
    WorkoutContainerContext
  );
  const isExpanded = expandedWorkoutId === workout.id;

  const [isEditing, setIsEditing] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState(workout.name);

  const handleEditTitleChange = e => {
    setIsEditing(true);
    setWorkoutTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    handleWorkoutTitle(workout.id, workoutTitle);
    setIsEditing(false);
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
                <IoCheckmarkCircleSharp size={20} onClick={handleSaveTitle} />
              </button>
              <input
                type='text'
                value={workoutTitle}
                onChange={handleEditTitleChange}
                placeholder='Enter Title'
              />
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
              <div className='workout-container__exercises_headers'>
                <h4>Exercise</h4>
                <h4>Weight</h4>
                <h4>Reps</h4>
              </div>
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
                    <div className='workout-container__reps_container'>
                      <input
                        type='number'
                        placeholder='lbs'
                        className='workout-container__lbs'
                      />
                      <input
                        type='number'
                        placeholder='Reps'
                        className='workout-container__reps'
                      />
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
  );
};

WorkoutContainer.propTypes = {
  workout: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        exercise_id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        muscle: PropTypes.string.isRequired
      })
    )
  }).isRequired,
  handleRemoveWorkout: PropTypes.func.isRequired,
  handleAddExercise: PropTypes.func.isRequired,
  handleRemoveExercise: PropTypes.func.isRequired,
  handleWorkoutTitle: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired
};

export default WorkoutContainer;
